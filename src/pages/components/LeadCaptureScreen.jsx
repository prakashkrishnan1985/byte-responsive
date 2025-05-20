import React, { useState, useEffect, useRef } from 'react';
import './styles/LeadCaptureScreen.css';
import Orb from './OrbBackground';
import Typewriter from 'typewriter-effect';
import axios from 'axios';
import * as faceapi from '@vladmandic/face-api';

import MicListener from './DemoMicListener';
import { sendQuery, processAudio } from './api';

const MODEL_URL = "/models";
const API_BASE_URL = "https://model-api-dev.bytesized.com.au";

const initSpeechSynthesis = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const synth = window.speechSynthesis;

        return new Promise((resolve) => {
            const loadVoices = () => {
                const voices = synth.getVoices();
                if (voices.length > 0) {
                    resolve(buildSynthAPI(synth, voices));
                } else {
                    synth.onvoiceschanged = () => {
                        const updatedVoices = synth.getVoices();
                        resolve(buildSynthAPI(synth, updatedVoices));
                    };
                }
            };

            loadVoices();
        });
    }

    return Promise.resolve({
        speakThinking: (text, onEnd) => {
            console.log('[TTS fallback] Thinking:', text);
            if (onEnd) onEnd();
        },
        speakTalking: (text, onEnd) => {
            console.log('[TTS fallback] Talking:', text);
            if (onEnd) onEnd();
        },
        stopSpeaking: () => { },
        getVoices: () => []
    });
};

const buildSynthAPI = (synth, voices) => {
    const getThinkingVoice = () =>
        voices.find(v => v.name.includes('Google UK English Male')) ||
        voices.find(v => v.name.includes('Male')) ||
        voices.find(v => v.lang.includes('en')) ||
        voices[0];

    const getTalkingVoice = () =>
        voices.find(v => v.name.includes('Google UK English Female')) ||
        voices.find(v => v.name.includes('Female')) ||
        voices.find(v => v.lang.includes('en')) ||
        voices[0];

    const speakThinking = (text, onEnd = () => { }) => {
        if (!text) return;
        synth.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = getThinkingVoice();
        utterance.rate = 1.0;
        utterance.pitch = 1.1;
        utterance.volume = 1.0;
        utterance.onend = onEnd;
        synth.speak(utterance);
    };

    const speakTalking = (text, onEnd = () => { }) => {
        if (!text) return;
        synth.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = getTalkingVoice();
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        utterance.onend = onEnd;
        synth.speak(utterance);
    };

    const stopSpeaking = () => {
        synth.cancel();
    };

    return {
        speakThinking,
        speakTalking,
        stopSpeaking,
        getVoices: () => voices
    };
};

const THINKING_MIN_DURATION = 3000;
const THINKING_TYPING_DURATION = 40;
const usedThinkingIndices = new Map();

const questions = [
    { key: 'inputMethod', prompt: "Hello there! Before we begin, would you prefer to chat by talking or typing?", type: 'choice', options: ['Talk', 'Type'] },
    { key: 'name', prompt: "Great! And just so I don't call you 'hey you' the whole time... what should I call you?", type: 'text', placeholder: 'Your name' },
    { key: 'email', promptTemplate: "Thanks {name}! Mind sharing your email? Totally optional...just in case you'd like a follow-up later.", prompt: "Mind sharing your email? Totally optional...just in case you'd like a follow-up later.", type: 'email', placeholder: 'you@example.com' },
    { key: 'consentToPhoto', promptTemplate: "Quick one, {name}: if you smile, can I snap a picture? Only if you're cool with it.", prompt: "Quick one: if you smile, can I snap a picture? Only if you're cool with it.", type: 'checkbox' },
    { key: 'welcomeMessage', prompt: "", type: 'message' },
    { key: 'tone', promptTemplate: "Lastly, {name}, how should I sound? Pick a tone that matches your vibe.", prompt: "Lastly, how should I sound? Pick a tone that matches your vibe.", type: 'tone' }
];

const tones = ['Joker (Dark Knight)', 'David Attenborough', 'Corporate Assistant', 'GPT Mode'];

const thinkingVariants = {
    inputMethod: (value) => [
        `They chose to ${value?.toLowerCase() || '...'} — next up, get their name for a more human touch.`,
        `${value} selected. Now, what's their name? Makes everything less robotic.`,
        `Input method locked in: ${value}. Time to ask who I'm talking to.`,
        `Alright, ${value} it is. Let's follow that up by asking their name.`,
        `So, ${value.toLowerCase()} it is. I should now make it more personal.`,
        `They went with ${value}. Names matter — let's get theirs.`,
        `Got it. They prefer to ${value.toLowerCase()}. Let's build some rapport with a name.`,
        `The user prefers to ${value.toLowerCase()}. Now I should get their name so I can personalize our conversation.`
    ],
    name: (value) => [
        `They go by ${value || '...'} — that's a start! Email next, but no pressure.`,
        `Name captured: ${value}. A good moment to ask for an email.`,
        `Cool, ${value} it is. I'll casually ask for an email now.`,
        `Nice. Now let's gently nudge toward getting an email (optional of course).`,
        `Logged their name as ${value}. That opens the door to asking for an email.`,
        `We're on a first-name basis now: ${value}. Let's prompt for email.`,
        `Step one complete: got their name. Now I'll suggest an optional email.`
    ],
    email: (value) => {
        if (!value?.trim()) {
            return [
                `They skipped the email. All good — time to ask for photo consent.`,
                `No email given. I'll move on to asking about the photo.`,
                `Email's optional anyway — next, ask for photo permission.`,
                `They chose not to share an email. Let's not hold up the flow.`,
                `Privacy respected. Onward to checking photo consent.`,
                `No email input — let's see if they're cool with a snapshot.`,
                `Blank email field. No worries. Moving to the next interaction point.`
            ];
        }
        return [
            `Got their email: ${value}. Let's ask if I can take a photo.`,
            `Email received. I'll check if they're okay with a quick snapshot.`,
            `Email in the bag — now to see if a smile is in our future.`,
            `They entered ${value}. Time to ask about photo permission.`,
            `Now that I have their email, I can prompt for camera access.`,
            `${value} added. Next step: photo consent.`,
            `That email works. Let's transition to photo permission.`
        ];
    },
    consentToPhoto: (value) => value
        ? [
            `They agreed to the photo — setting up the camera now.`,
            `Photo consent granted. Initiating smile detection.`,
            `Perfect! They're up for a picture. Getting things ready.`,
            `Got the go-ahead for a photo. Let's see that smile.`,
            `Photo? Yes. Let's power up the camera.`,
            `Permission confirmed. Preparing the snapshot sequence.`,
            `They're okay with the photo. Time to make it work.`
        ]
        : [
            `They'd rather skip the photo — totally fine.`,
            `No photo? No problem. Let's move on.`,
            `They declined the photo. Respect that and continue.`,
            `Skipping the camera step. Plenty more to cover.`,
            `No photo access — that's their call. Onward.`,
            `They're not comfortable with a photo. All good.`,
            `Not taking a photo. I'll pivot to the tone question.`
        ],
    welcomeMessage: () => [
        `Intro done. Time to ask how I should sound.`,
        `Now that we've met, let's talk tone.`,
        `We're almost set — just need to pick a voice style.`,
        `One last bit: picking a tone for how I'll respond.`,
        `We've covered the basics. Now let's personalize the voice.`,
        `Great progress. Final step: tone of voice.`,
        `Now I just need to know how I should *sound*.`
    ],
    default: () => [
        `Thinking about the next best step to keep this flowing...`,
        `Hmm... figuring out what makes sense to ask next.`,
        `Just taking a second to plan the next move.`,
        `Let me process that and decide what's next.`,
        `A quick moment to reflect before the next question.`,
        `Mapping out the smoothest way forward...`,
        `Loading the next thoughtful question...`
    ]
};

function getUniqueThinkingMessage(key, value) {
    console.log(`Getting thinking message for key: ${key}, value: ${value}`);
    const variants = (thinkingVariants[key] || thinkingVariants.default)(value);
    if (!variants.length) return '';

    if (!usedThinkingIndices.has(key)) {
        usedThinkingIndices.set(key, new Set());
    }

    const used = usedThinkingIndices.get(key);

    if (used.size === variants.length) {
        used.clear();
    }

    let index;
    do {
        index = Math.floor(Math.random() * variants.length);
    } while (used.has(index));

    used.add(index);
    console.log(`Selected message: ${variants[index]}`);
    return variants[index];
}

const LeadCaptureScreen = ({ onNext }) => {
    const [speechQueue, setSpeechQueue] = useState([]);
    const [isProcessingSpeechQueue, setIsProcessingSpeechQueue] = useState(false);
    const [isBackendAudioPlaying, setIsBackendAudioPlaying] = useState(false);
    const [isSpeechBlocked, setIsSpeechBlocked] = useState(false);
    const [typingComplete, setTypingComplete] = useState(false);
    const [speechInputReady, setSpeechInputReady] = useState(false);
    const [questionSpoken, setQuestionSpoken] = useState(false);
    const [lastSpokenStep, setLastSpokenStep] = useState(-1);

    const [step, setStep] = useState(0);
    const [leadInfo, setLeadInfo] = useState({
        name: '',
        email: '',
        consentToPhoto: false,
        tone: '',
        inputMethod: '',
        welcomeMessage: ''
    });
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(true);

    const [isThinking, setIsThinking] = useState(false);
    const [thinkingText, setThinkingText] = useState('');
    const [thinkingProgress, setThinkingProgress] = useState(0);
    const [thinkingComplete, setThinkingComplete] = useState(false);
    const thinkingTimerRef = useRef(null);

    const [isModelLoading, setIsModelLoading] = useState(false);
    const [smileDetected, setSmileDetected] = useState(false);
    const [photoTaken, setPhotoTaken] = useState(false);
    const [cameraError, setCameraError] = useState('');
    const [photoData, setPhotoData] = useState(null);

    const [isProcessingImage, setIsProcessingImage] = useState(false);
    const [apiError, setApiError] = useState('');
    const [apiOperationComplete, setApiOperationComplete] = useState(true);

    const [isSpeechMode, setIsSpeechMode] = useState(false);
    const [currentTranscript, setCurrentTranscript] = useState('');
    const [isListening, setIsListening] = useState(false);

    const [isSpeaking, setIsSpeaking] = useState(false);
    const [waitingForSpeechToEnd, setWaitingForSpeechToEnd] = useState(false);
    const speechSynthRef = useRef(null);
    const pendingActionRef = useRef(null);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const detectionRef = useRef(null);
    const audioRef = useRef(new Audio());

    const currentQuestion = step < questions.length ? questions[step] : null;

    const personalizedQuestion = (() => {
        if (!currentQuestion) return null;

        if (currentQuestion.promptTemplate && leadInfo.name) {
            return {
                ...currentQuestion,
                prompt: currentQuestion.promptTemplate.replace('{name}', leadInfo.name)
            };
        }

        return currentQuestion;
    })();

    const debugSpeechState = () => {
        console.log("Speech State Debug:", {
            step,
            lastSpokenStep,
            isSpeechMode,
            isSpeechBlocked,
            isBackendAudioPlaying,
            isSpeaking,
            typingComplete,
            isThinking,
            personalizedQuestion: personalizedQuestion?.prompt
        });
    };

    useEffect(() => {
        const handleAudioEnded = () => {
            console.log('Backend audio playback ended');
            setIsBackendAudioPlaying(false);
            setIsSpeechBlocked(false);
        };

        const handleCanPlayThrough = () => {
            console.log('Backend audio ready to play');
            setIsBackendAudioPlaying(true);
        };

        const currentAudio = audioRef.current;
        currentAudio.removeEventListener('ended', handleAudioEnded);
        currentAudio.removeEventListener('canplaythrough', handleCanPlayThrough);

        currentAudio.addEventListener('ended', handleAudioEnded);
        currentAudio.addEventListener('canplaythrough', handleCanPlayThrough);

        return () => {
            currentAudio.removeEventListener('ended', handleAudioEnded);
            currentAudio.removeEventListener('canplaythrough', handleCanPlayThrough);
        };
    }, []);

    const moveToToneStep = () => {
        console.log("Moving to tone selection step (step 5)");
        setStep(5);
    };

    useEffect(() => {
        if (step === 4) {
            console.log("On welcome message step, checking for", leadInfo.welcomeMessage);
            if (!leadInfo.welcomeMessage && !questions[4].prompt) {
                questions[4].prompt = "Welcome! Thanks for the photo.";
            }
        }
    }, [step, leadInfo.welcomeMessage]);

    useEffect(() => {
        const shouldSpeak =
            typingComplete &&
            !isThinking &&
            !isSpeaking &&
            !isBackendAudioPlaying &&
            isSpeechMode &&
            !isSpeechBlocked &&
            personalizedQuestion?.prompt &&
            lastSpokenStep !== step;

        console.log("Speech conditions check:", {
            typingComplete,
            isThinking,
            isSpeaking,
            isBackendAudioPlaying,
            isSpeechMode,
            isSpeechBlocked,
            prompt: personalizedQuestion?.prompt?.substring(0, 20) + "...",
            step,
            lastSpokenStep,
            shouldSpeak
        });

        if (shouldSpeak) {
            console.log(`Speaking prompt for step ${step}: "${personalizedQuestion.prompt}"`);

            if (step === 4 && personalizedQuestion.key === 'welcomeMessage') {
                if (!isBackendAudioPlaying) {
                    console.log("Speaking welcome message with speech synthesis");
                    setLastSpokenStep(step);
                    speakWithAction(personalizedQuestion.prompt);
                } else {
                    console.log("Welcome message will be played by backend audio, skipping speech");
                }
            } else {
                console.log(`Regular speech for step ${step}`);

                setTimeout(() => {
                    setLastSpokenStep(step);
                    speakWithAction(personalizedQuestion.prompt, () => {
                        if (personalizedQuestion.type === 'text') {
                            setIsListening(true);
                        }
                    });
                }, 300);
            }
        }
    }, [
        typingComplete,
        isThinking,
        isSpeaking,
        isBackendAudioPlaying,
        isSpeechMode,
        isSpeechBlocked,
        personalizedQuestion?.prompt,
        step,
        lastSpokenStep
    ]);

    useEffect(() => {
        let isMounted = true;
        console.log("Initializing speech synthesis...");

        const enableSpeechOnClick = () => {
            console.log("Testing speech synthesis on click...");
            if (speechSynthRef.current && typeof speechSynthRef.current.speakTalking === 'function') {
                speechSynthRef.current.speakTalking('', () => {
                    console.log("Speech test complete");
                    setLastSpokenStep(-1);
                });
            }
            document.removeEventListener('click', enableSpeechOnClick);
            document.removeEventListener('touchstart', enableSpeechOnTouch);
        };

        const enableSpeechOnTouch = () => {
            console.log("Testing speech synthesis on touch...");
            if (speechSynthRef.current && typeof speechSynthRef.current.speakTalking === 'function') {
                speechSynthRef.current.speakTalking('', () => {
                    console.log("Speech test complete");
                    setLastSpokenStep(-1);
                });
            }
            document.removeEventListener('click', enableSpeechOnClick);
            document.removeEventListener('touchstart', enableSpeechOnTouch);
        };

        const initSpeech = async () => {
            try {
                const synthAPI = await initSpeechSynthesis();

                if (!isMounted) return;

                if (synthAPI) {
                    console.log("Speech synthesis initialized successfully");
                    speechSynthRef.current = synthAPI;

                    console.log("Testing speech synthesis initially...");
                    if (speechSynthRef.current && typeof speechSynthRef.current.speakTalking === 'function') {
                        speechSynthRef.current.speakTalking('', () => {
                            console.log("Initial speech test complete");
                            setLastSpokenStep(-1);
                        });
                    }

                    document.addEventListener('click', enableSpeechOnClick);
                    document.addEventListener('touchstart', enableSpeechOnTouch);
                } else {
                    console.error("Failed to initialize speech synthesis");
                }
            } catch (err) {
                console.error("Error initializing speech:", err);
            }
        };

        initSpeech();

        return () => {
            isMounted = false;
            document.removeEventListener('click', enableSpeechOnClick);
            document.removeEventListener('touchstart', enableSpeechOnTouch);
        };
    }, []);

    const typewriterKey = `typewriter-${step}`;

    const executePendingAction = () => {
        if (pendingActionRef.current) {
            const action = pendingActionRef.current;
            pendingActionRef.current = null;
            action();
        }
    };

    const speakWithAction = (text, action) => {
        console.log("Attempting to speak:", text);
        console.log("Speech conditions:", {
            isBackendAudioPlaying,
            isSpeechBlocked,
            isSpeechMode,
            hasSpeechRef: !!speechSynthRef.current
        });

        if (isBackendAudioPlaying || isSpeechBlocked || !isSpeechMode || !speechSynthRef.current) {
            console.log("Cannot speak due to conditions, executing action anyway");
            if (action) action();
            return;
        }

        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsBackendAudioPlaying(false);

        if (!speechSynthRef.current || typeof speechSynthRef.current.speakTalking !== 'function') {
            console.log("Speech synthesis not available");
            if (action) action();
            return;
        }

        console.log("Speaking:", text);
        setIsSpeaking(true);

        if (action) {
            pendingActionRef.current = action;
        }

        speechSynthRef.current.speakTalking(text, () => {
            console.log("Speech completed for:", text);
            setIsSpeaking(false);
            executePendingAction();
        });
    };

    const simulateThinkingTyping = (text) => {
        console.log('Simulating thinking typing with text:', text);
        let i = 0;
        const length = text.length;

        setThinkingProgress(0);
        setThinkingComplete(false);

        if (thinkingTimerRef.current) {
            clearInterval(thinkingTimerRef.current);
        }

        if (speechSynthRef.current && typeof speechSynthRef.current.stopSpeaking === 'function') {
            speechSynthRef.current.stopSpeaking();
            setIsSpeaking(true);

            setWaitingForSpeechToEnd(true);

            speechSynthRef.current.speakThinking(text, () => {
                setIsSpeaking(false);
                setWaitingForSpeechToEnd(false);
                setThinkingComplete(true);
            });
        }

        const typeNextChar = () => {
            if (i <= length) {
                setThinkingText(text.substring(0, i));
                setThinkingProgress(i / length);
                i++;
            } else {
                clearInterval(thinkingTimerRef.current);
                if (!isSpeechMode) {
                    const elapsedTime = length * THINKING_TYPING_DURATION;
                    const remainingTime = Math.max(0, THINKING_MIN_DURATION - elapsedTime);

                    setTimeout(() => {
                        setThinkingComplete(true);
                    }, remainingTime);
                }
            }
        };

        thinkingTimerRef.current = setInterval(typeNextChar, THINKING_TYPING_DURATION);
    };

    const goToNextStep = () => {
        if (step + 1 < questions.length) {
            const key = currentQuestion.key;
            const value = leadInfo[key];

            let thinking;
            if (key === 'consentToPhoto' && value === true && photoTaken) {
                thinking = getUniqueThinkingMessage('welcomeMessage', '');
            } else {
                thinking = getUniqueThinkingMessage(key, value);
            }

            setThinkingText('');
            setIsThinking(true);
            setWaitingForSpeechToEnd(false);
            simulateThinkingTyping(thinking);

            setTimeout(() => {
                setStep(prev => prev + 1);
            }, 100);
        }
    };

    const canProceedToNextStep = () => {
        return thinkingComplete && apiOperationComplete && !waitingForSpeechToEnd && !isSpeaking;
    };

    useEffect(() => {
        if (isThinking && canProceedToNextStep()) {
            console.log('Thinking and API operations complete, proceeding to next step');

            const visibilityDelay = 1000;

            setTimeout(() => {
                setIsThinking(false);
                setThinkingComplete(false);
                setThinkingProgress(0);
                setIsTyping(true);
            }, visibilityDelay);
        }
    }, [isThinking, thinkingComplete, apiOperationComplete, isSpeaking, waitingForSpeechToEnd]);

    const handleInputSubmit = () => {
        if (!personalizedQuestion) return;
        const key = personalizedQuestion.key;
        const submittedValue = inputValue.trim();

        setInputValue('');
        setLeadInfo(prev => {
            const newState = { ...prev, [key]: submittedValue };

            const thinkingMsg = getUniqueThinkingMessage(key, submittedValue);

            setThinkingText('');
            setIsThinking(true);
            setWaitingForSpeechToEnd(false);
            simulateThinkingTyping(thinkingMsg);

            setTimeout(() => {
                setStep(step + 1);
            }, 100);

            return newState;
        });
    };

    const handleCheckboxChange = async (e) => {
        if (!personalizedQuestion) return;
        const key = personalizedQuestion.key;
        const isChecked = e.target.checked;
    
        setLeadInfo(prev => ({ ...prev, [key]: isChecked }));
    
        if (key === 'consentToPhoto') {
            if (isChecked) {
                setApiOperationComplete(false);
                initializeCamera();
            } else {
                const thinkingMsg = getUniqueThinkingMessage(key, isChecked);
                
                const defaultMsg = "Thanks for letting me know! Let's continue.";
                setLeadInfo(prev => ({
                    ...prev,
                    welcomeMessage: defaultMsg
                }));
                questions[4].prompt = defaultMsg;
                
                setThinkingText('');
                setIsThinking(true);
                setWaitingForSpeechToEnd(false);
                simulateThinkingTyping(thinkingMsg);
                
                setTimeout(() => {
                    console.log("Moving to welcome after declining photo");
                    setStep(4);
                    
                    setTimeout(() => {
                        console.log("Moving to tone after welcome");
                        setStep(5);
                    }, 3000);
                }, 1500);
            }
        } else {
            const thinkingMsg = getUniqueThinkingMessage(key, isChecked);
            
            setThinkingText('');
            setIsThinking(true);
            setWaitingForSpeechToEnd(false);
            simulateThinkingTyping(thinkingMsg);
            
            setTimeout(() => {
                setStep(step + 1);
            }, 100);
        }
    };
    
    const logStateDebug = () => {
        console.log("Current State:", {
            step,
            currentQuestion: currentQuestion?.key,
            isThinking,
            isTyping,
            typingComplete,
            isSpeaking,
            isBackendAudioPlaying,
            isSpeechBlocked,
            lastSpokenStep,
            welcomeMessage: leadInfo.welcomeMessage
        });
    };
    

    const handleChoiceSelect = (value) => {
        if (!personalizedQuestion) return;
        const key = personalizedQuestion.key;

        if (key === 'inputMethod' && value === 'Talk') {
            setIsSpeechMode(true);
        } else {
            setIsSpeechMode(false);
        }

        setLeadInfo(prev => {
            const newState = { ...prev, [key]: value };

            const thinkingMsg = getUniqueThinkingMessage(key, value);

            setThinkingText('');
            setIsThinking(true);
            setWaitingForSpeechToEnd(false);
            simulateThinkingTyping(thinkingMsg);

            setTimeout(() => {
                setStep(step + 1);
            }, 100);

            return newState;
        });
    };

    const handleToneSelect = (tone) => {
        const updatedInfo = {
            ...leadInfo,
            tone
        };

        setLeadInfo(updatedInfo);

        if (typeof onNext === 'function') {
            console.log('Calling onNext with leadInfo:', updatedInfo);
            onNext(updatedInfo);
        } else {
            console.log('onNext is not a function, cannot proceed. Final data:', updatedInfo);
            goToNextStep();
        }
    };

    const handleReset = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        if (detectionRef.current) {
            clearInterval(detectionRef.current);
            detectionRef.current = null;
        }

        if (thinkingTimerRef.current) {
            clearInterval(thinkingTimerRef.current);
        }

        if (speechSynthRef.current && typeof speechSynthRef.current.stopSpeaking === 'function') {
            speechSynthRef.current.stopSpeaking();
        }

        setLeadInfo({
            name: '',
            email: '',
            consentToPhoto: false,
            tone: '',
            inputMethod: '',
            welcomeMessage: ''
        });
        setStep(0);
        setInputValue('');
        setIsTyping(true);
        setIsThinking(false);
        setThinkingComplete(false);
        setThinkingProgress(0);
        setSmileDetected(false);
        setPhotoTaken(false);
        setPhotoData(null);
        setCameraError('');
        setApiError('');
        setApiOperationComplete(true);
        setIsSpeechMode(false);
        setCurrentTranscript('');
        setIsListening(false);
        setIsSpeaking(false);
        setWaitingForSpeechToEnd(false);
        pendingActionRef.current = null;
        setLastSpokenStep(-1);
        setIsSpeechBlocked(false);
        setIsBackendAudioPlaying(false);
    };

    const initializeCamera = async () => {
        try {
            console.log('Starting camera initialization...');
            setIsModelLoading(true);

            try {
                await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
                await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
                console.log('Face detection models loaded successfully');
            } catch (modelErr) {
                console.error('Error loading face detection models:', modelErr);
                setCameraError(`Could not load face detection models: ${modelErr.message}`);
                setApiOperationComplete(true);
                goToNextStep();
                return;
            }

            console.log('Requesting camera access...');
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' },
                audio: false
            });

            console.log('Camera access granted');

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;

                videoRef.current.onloadedmetadata = () => {
                    console.log('Video metadata loaded');
                    videoRef.current.play()
                        .then(() => {
                            console.log('Video playback started');
                            setIsModelLoading(false);

                            startFaceDetection();
                        })
                        .catch(playErr => {
                            console.error('Error starting video playback:', playErr);
                            setCameraError(`Error starting video playback: ${playErr.message}`);
                            setIsModelLoading(false);
                            setApiOperationComplete(true);
                            goToNextStep();
                        });
                };
            } else {
                console.error('Video ref is not available');
                setCameraError('Video element not found');
                setIsModelLoading(false);
                setApiOperationComplete(true);
                goToNextStep();
            }
        } catch (err) {
            console.error('Error initializing camera:', err);
            setCameraError(`Could not initialize camera: ${err.message}`);
            setIsModelLoading(false);
            setApiOperationComplete(true);

            goToNextStep();
        }
    };

    const startFaceDetection = () => {
        console.log('Starting face detection...');
        if (!videoRef.current) {
            console.error('Video reference not available for face detection');
            setApiOperationComplete(true);
            goToNextStep();
            return;
        }

        console.log('Setting up face detection interval');
        detectionRef.current = setInterval(async () => {
            if (!videoRef.current || videoRef.current.readyState !== 4) {
                console.log('Video not ready yet, waiting...');
                return;
            }

            try {
                const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 });
                const detections = await faceapi.detectAllFaces(videoRef.current, options);

                if (detections && detections.length > 0) {
                    const withExpressions = await faceapi.detectAllFaces(videoRef.current, options).withFaceExpressions();
                    if (withExpressions && withExpressions.length > 0) {
                        const detection = withExpressions[0];
                        const isSmiling = detection.expressions.happy > 0.7;

                        console.log(`Smile detection: ${isSmiling ? 'Smiling' : 'Not smiling'}`);

                        if (isSmiling && !smileDetected) {
                            console.log('Smile confirmed! Capturing photo...');
                            setSmileDetected(true);
                            capturePhoto();
                            clearInterval(detectionRef.current);
                            detectionRef.current = null;
                        }
                    }
                }
            } catch (err) {
                console.error('Error in face detection:', err);
            }
        }, 500);

        setTimeout(() => {
            if (detectionRef.current) {
                console.log('Smile detection timeout reached. Moving on...');
                clearInterval(detectionRef.current);
                detectionRef.current = null;

                if (!smileDetected) {
                    setCameraError('Could not detect a smile. Moving on...');
                    setApiOperationComplete(true);
                    goToNextStep();
                }
            }
        }, 20000);
    };

    const capturePhoto = () => {
        console.log('Capturing photo...');
        if (!videoRef.current || !canvasRef.current) {
            setApiOperationComplete(true);
            setStep(prev => prev + 1);
            return;
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;

        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;

        try {
            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            console.log('Photo captured successfully');

            const base64Image = canvas.toDataURL('image/jpeg');

            setPhotoData(base64Image);
            setPhotoTaken(true);

            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }

            setTimeout(() => {
                const base64DataPart = base64Image.split(',')[1];
                console.log('Processing image with API...');
                processImageWithAPI(base64DataPart);
            }, 500);

        } catch (err) {
            console.error('Error capturing photo:', err);
            setCameraError(`Error capturing photo: ${err.message}`);
            setApiOperationComplete(true);

            console.log("Photo capture error, moving to welcome step");
            setStep(4);
        }
    };

    const processImageWithAPI = async (base64Image) => {
        console.log('Processing image with API...');
        setIsProcessingImage(true);
        setApiError('');

        try {
            console.log('Sending API request...');
            const response = await axios.post(`${API_BASE_URL}/process-image-base64`, {
                model: "gpt-4o",
                prompt: `You're shown an image of a visitor's outfit — including visible clothing, accessories, and possibly their posture or expression. Create a friendly, welcoming message that mentions safe visual details like color, style, or accessories. Avoid referring to faces or personal characteristics. Keep the tone warm and professional.`,
                base64_image: base64Image
            });

            console.log('API response received:', response.data);

            const welcomeMsg = response.data.message?.content || "Welcome! Nice to meet you.";

            setLeadInfo(prev => ({
                ...prev,
                welcomeMessage: welcomeMsg
            }));

            questions[4].prompt = welcomeMsg;

            if (speechSynthRef.current && typeof speechSynthRef.current.stopSpeaking === 'function') {
                speechSynthRef.current.stopSpeaking();
                setIsSpeaking(false);
            }

            pendingActionRef.current = null;

            if (detectionRef.current) {
                clearInterval(detectionRef.current);
                detectionRef.current = null;
            }

            setThinkingComplete(true);
            setApiOperationComplete(true);
            setIsThinking(false);

            if (response.data.audio_path) {
                setIsSpeechBlocked(true);
                console.log('Speech blocked for audio playback');

                const audioUrl = `${API_BASE_URL}${response.data.audio_path}?t=${Date.now()}`;
                audioRef.current.src = audioUrl;

                setLastSpokenStep(4);

                setIsBackendAudioPlaying(true);

                const handleAudioComplete = () => {
                    console.log("Welcome message audio completed");
                    setIsBackendAudioPlaying(false);
                    setIsSpeechBlocked(false);

                    setTimeout(() => {
                        console.log("Moving to tone selection after audio");
                        setStep(5); 
                    }, 1000);

                    audioRef.current.removeEventListener('ended', handleAudioComplete);
                };

                audioRef.current.removeEventListener('ended', () => { });
                audioRef.current.addEventListener('ended', handleAudioComplete);

                setTimeout(() => {
                    audioRef.current.play().catch(err => {
                        console.error('Error playing audio:', err);
                        setIsBackendAudioPlaying(false);
                        setIsSpeechBlocked(false);

                        console.log("Audio playback failed, moving to welcome message step");
                        setStep(4);
                    });
                }, 300);

                setTimeout(() => {
                    if (isBackendAudioPlaying) {
                        console.log("Audio taking too long, forcing continuation");
                        setIsBackendAudioPlaying(false);
                        setIsSpeechBlocked(false);

                        if (step !== 5) {
                            console.log("Moving to tone selection after timeout");
                            setStep(5);
                        }
                    }
                }, 15000);

                console.log("Moving to welcome message step");
                setStep(4);
            } else {
                setIsSpeechBlocked(false);
                console.log("No audio, moving to welcome message step");
                setStep(4);

                setTimeout(() => {
                    console.log("Moving to tone selection with no audio");
                    setStep(5);
                }, 3000);
            }

        } catch (err) {
            console.error('Error processing image with API:', err);
            setApiError(`Error processing image: ${err.message}`);

            const defaultMsg = "Thanks for the photo! Great to meet you.";
            setLeadInfo(prev => ({
                ...prev,
                welcomeMessage: defaultMsg
            }));
            questions[4].prompt = defaultMsg;

            setIsSpeechBlocked(false);
            setIsBackendAudioPlaying(false);
            setLastSpokenStep(-1);

            console.log("Error in API, moving to welcome message with default text");
            setStep(4);

            setTimeout(() => {
                console.log("Moving to tone selection after error");
                setStep(5);
            }, 3000);
        } finally {
            setIsProcessingImage(false);
            setApiOperationComplete(true);
        }
    };

    const moveToWelcomeStep = () => {
        console.log("Moving to welcome message step (step 4)");
        setStep(4);
    };


    const handleTranscript = (text, isFinal = false) => {
        if (!speechInputReady) return;

        setIsListening(true);
        setCurrentTranscript(text);

        if (isFinal && text.trim()) {
            setIsListening(false);
            setInputValue(text);
            setSpeechInputReady(false);

            if (personalizedQuestion) {
                const key = personalizedQuestion.key;
                setLeadInfo(prev => {
                    const newState = { ...prev, [key]: text };
                    const thinkingMsg = getUniqueThinkingMessage(key, text);
                    setThinkingText('');
                    setIsThinking(true);
                    setWaitingForSpeechToEnd(false);
                    simulateThinkingTyping(thinkingMsg);

                    setTimeout(() => {
                        setStep(step + 1);
                        setCurrentTranscript('');
                    }, 100);

                    return newState;
                });
            }
        }
    };

    return (
        <div className="lead-capture-layout">
            <div className="orb-column">
                <Orb
                    hoverIntensity={0.5}
                    rotateOnHover={true}
                    hue={0}
                    forceHoverState={isTyping || isThinking}
                />
            </div>

            <div className="text-column">
                <h1 className="byte-heading">Hi, I'm Byte. Let's play a quick game!</h1>

                {photoTaken && photoData && (
                    <div className="captured-photo-container">
                        <img
                            src={photoData}
                            alt="Captured"
                            className="captured-photo-thumbnail"
                        />
                    </div>
                )}

                <div className="lead-form">
                    {personalizedQuestion && !isThinking ? (
                        <div className={`byte-question ${isSpeaking ? 'speaking' : ''}`}>
                            <Typewriter
                                key={`typewriter-${step}-${personalizedQuestion.prompt.substring(0, 10)}`}
                                options={{
                                    delay: 40,
                                    cursor: '|',
                                    deleteSpeed: 0,
                                }}
                                onInit={(typewriter) => {
                                    console.log(`Initializing typewriter for step ${step}: ${personalizedQuestion.key}`);
                                    setIsTyping(true);
                                    setTypingComplete(false);

                                    let typingDelay = 200;

                                    if (step === 4 && personalizedQuestion.key === 'welcomeMessage') {
                                        console.log("Welcome message typewriter - audio playing:", isBackendAudioPlaying);

                                        if (isBackendAudioPlaying) {
                                            typingDelay = 2000;

                                            setTimeout(() => {
                                                if (isBackendAudioPlaying) {
                                                    console.log("Audio still playing, delaying typewriter more");
                                                    const checkAudio = setInterval(() => {
                                                        if (!isBackendAudioPlaying) {
                                                            clearInterval(checkAudio);
                                                            console.log("Audio finished, now typing welcome message");
                                                            typewriter
                                                                .typeString(personalizedQuestion.prompt)
                                                                .callFunction(() => {
                                                                    setIsTyping(false);
                                                                    setTypingComplete(true);
                                                                })
                                                                .start();
                                                        }
                                                    }, 500);

                                                    setTimeout(() => {
                                                        clearInterval(checkAudio);
                                                        if (isTyping && !typingComplete) {
                                                            console.log("Failsafe: typing welcome message after timeout");
                                                            typewriter
                                                                .typeString(personalizedQuestion.prompt)
                                                                .callFunction(() => {
                                                                    setIsTyping(false);
                                                                    setTypingComplete(true);
                                                                })
                                                                .start();
                                                        }
                                                    }, 5000);

                                                    return;
                                                }
                                            }, typingDelay);
                                        }
                                    }

                                    setTimeout(() => {
                                        console.log(`Starting typewriter for step ${step} after delay`);
                                        typewriter
                                            .typeString(personalizedQuestion.prompt)
                                            .callFunction(() => {
                                                console.log(`Typing complete for step ${step}`);
                                                setIsTyping(false);
                                                setTypingComplete(true);
                                                setSpeechInputReady(true);
                                            })
                                            .start();
                                    }, typingDelay);
                                }}
                            />
                        </div>
                    ) : (
                        <div className="byte-question-loading">
                            <div className="spinner-container">
                                <div className="spinner"></div>
                                <p>Thinking...</p>
                            </div>
                        </div>
                    )}

                    {personalizedQuestion && !isThinking && (
                        <>
                            {personalizedQuestion.type === 'choice' && (
                                <div className="choice-selection">
                                    {personalizedQuestion.options.map(option => (
                                        <button
                                            key={option}
                                            onClick={() => handleChoiceSelect(option)}
                                            className="choice-button"
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {!isTyping && (
                                <>
                                    {personalizedQuestion.type === 'text' && (
                                        <>
                                            {isSpeechMode ? (
                                                <div className="speech-input-container">
                                                    <MicListener
                                                        onTranscript={handleTranscript}
                                                        customerId="lead_capture"
                                                        namespace="LeadCapture"
                                                        isAutoStart={!isTyping && !isSpeaking}
                                                        onListeningStateChange={setIsListening}
                                                    />
                                                    <div className="transcript-display">
                                                        {isListening ? (
                                                            <p>Listening... {currentTranscript}</p>
                                                        ) : (
                                                            <p>{currentTranscript || "Please speak your name..."}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <input
                                                        type="text"
                                                        value={inputValue}
                                                        onChange={e => setInputValue(e.target.value)}
                                                        placeholder={personalizedQuestion.placeholder}
                                                        onKeyDown={e => {
                                                            if (e.key === 'Enter' && inputValue.trim() !== '') handleInputSubmit();
                                                        }}
                                                    />
                                                    <button
                                                        className="next-button"
                                                        onClick={handleInputSubmit}
                                                        disabled={!inputValue.trim()}
                                                    >
                                                        Next →
                                                    </button>
                                                </>
                                            )}
                                        </>
                                    )}

                                    {personalizedQuestion.type === 'email' && (
                                        <>
                                            <input
                                                type="email"
                                                value={inputValue}
                                                onChange={e => setInputValue(e.target.value)}
                                                placeholder={personalizedQuestion.placeholder}
                                                onKeyDown={e => {
                                                    if (e.key === 'Enter') handleInputSubmit();
                                                }}
                                            />
                                            <div className="optional-field-note">
                                                {isSpeechMode ?
                                                    "For better accuracy, please type your email. This field is optional." :
                                                    "This field is optional. You can leave it blank and click Next."}
                                            </div>
                                            <button
                                                className="next-button"
                                                onClick={handleInputSubmit}
                                            >
                                                Next →
                                            </button>
                                        </>
                                    )}

                                    {personalizedQuestion.type === 'checkbox' && (
                                        <div className="consent-options">
                                            <button
                                                className={`consent-button ${leadInfo[personalizedQuestion.key] ? 'consent-yes-selected' : ''}`}
                                                onClick={() => handleCheckboxChange({ target: { checked: true } })}
                                            >
                                                Yes
                                            </button>
                                            <button
                                                className={`consent-button ${leadInfo[personalizedQuestion.key] === false && leadInfo[personalizedQuestion.key] !== undefined ? 'consent-no-selected' : ''}`}
                                                onClick={() => handleCheckboxChange({ target: { checked: false } })}
                                            >
                                                No
                                            </button>
                                        </div>
                                    )}

                                    {personalizedQuestion.type === 'tone' && (
                                        <div className="tone-selection">
                                            {tones.map(tone => (
                                                <button
                                                    key={tone}
                                                    className={leadInfo.tone === tone ? 'selected-tone' : ''}
                                                    onClick={() => handleToneSelect(tone)}
                                                >
                                                    {tone}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {personalizedQuestion.type === 'message' && (
                                        <button
                                            className="next-button"
                                            onClick={() => {
                                                if (step === 4) {
                                                    moveToToneStep();
                                                } else {
                                                    goToNextStep();
                                                }
                                            }}
                                        >
                                            Next →
                                        </button>
                                    )}

                                </>
                            )}

                            {personalizedQuestion.key === 'consentToPhoto' && leadInfo.consentToPhoto && !photoTaken && (
                                <div className="camera-container">
                                    <div className="camera-status">
                                        {isModelLoading ? 'Loading face detection...' :
                                            smileDetected ? 'Great smile! Capturing photo...' :
                                                'Please smile for the camera!'}
                                    </div>
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        muted
                                        className="camera-video"
                                    />
                                    {cameraError && (
                                        <div className="camera-error">
                                            {cameraError}
                                        </div>
                                    )}
                                </div>
                            )}

                            <canvas ref={canvasRef} style={{ display: 'none' }} />

                            {isProcessingImage && (
                                <div className="processing-indicator">
                                    <div className="spinner"></div>
                                    <div>Analyzing your photo...</div>
                                </div>
                            )}

                            {apiError && (
                                <div className="api-error">
                                    {apiError}
                                </div>
                            )}
                        </>
                    )}
                </div>

                <audio
                    ref={audioRef}
                    style={{ display: 'none' }}
                    onError={(e) => console.error('Audio playback error:', e)}
                />

                <div className="start-over-container">
                    <button
                        className="start-over-button"
                        onClick={handleReset}
                        title="Start over from the beginning"
                    >
                        ↺ Start Over
                    </button>
                </div>

                {isThinking && (
                    <div className={`thinking-box ${isSpeechMode && isSpeaking ? 'speaking' : ''}`}>
                        <div className="thinking-header">This is what I'm thinking...</div>
                        <div className="thinking-indicator">
                            <span className="thinking-dot"></span>
                            <span className="thinking-dot"></span>
                            <span className="thinking-dot"></span>
                        </div>
                        <div className="thinking-text">{thinkingText}</div>
                        <div className="thinking-progress-container">
                            <div
                                className="thinking-progress-bar"
                                style={{ width: `${thinkingProgress * 100}%` }}
                            />
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default LeadCaptureScreen;