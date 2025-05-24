import React, { useState, useEffect, useRef } from "react";
import "./styles/LeadCaptureScreen.css";
import Orb from "./OrbBackground";
import Typewriter from "typewriter-effect";
import axios from "axios";
import * as faceapi from "@vladmandic/face-api";
import MicListener from "./DemoMicListener";
import RAGQuestScreen from "./RAGQuestScreen";
import "./styles/RAGQuestScreen.css";
import { sendQuery, processAudio } from "./api";
import {
  Box,
  Button,
  Input,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DemonstratingNER from "./DemonStraingComponent";

import micIcon from "../../../src/assets/icons/mic.svg";
import penIcon from "../../../src/assets/icons/pen.svg";

const MODEL_URL = "/models";
const API_BASE_URL = "https://model-api-dev.bytesized.com.au";
//const API_BASE_URL = "http://localhost:8000";

// Demo messages for different stages
const getDemoMessage = (stage, additionalContext = {}) => {
  const messages = {
    // Input method selection
    inputMethod_choice: "🎯 Demonstrating: User Interface Adaptability",

    // Speech-related demos
    speech_listening:
      "🎤 Demonstrating: Speech-to-Text (STT) + Real-time Audio Processing",
    speech_processing:
      "🧠 Demonstrating: Natural Language Processing (NLP) + Name Extraction API",

    // Text-related demos
    text_input: "⌨️ Demonstrating: Text Processing + API Integration",

    // Email processing
    email_processing: "📧 Demonstrating: Email Validation + Data Processing",

    // Camera and vision
    camera_init:
      "📷 Demonstrating: Computer Vision Setup + Face Detection Models",
    face_detection:
      "👁️ Demonstrating: Real-time Face Detection + Expression Recognition",
    smile_detection:
      "😊 Demonstrating: Emotion AI + Facial Expression Analysis",
    photo_capture: "📸 Demonstrating: Image Capture + Base64 Encoding",
    image_processing:
      "🤖 Demonstrating: Vision AI (GPT-4o) + Image Analysis + TTS Generation",

    // Speech synthesis
    tts_thinking: "💭 Demonstrating: Text-to-Speech (TTS) + Voice Synthesis",
    tts_talking: "🗣️ Demonstrating: Advanced TTS + Voice Modulation",

    // Quest/RAG
    quest_launch:
      "🎮 Demonstrating: Retrieval-Augmented Generation (RAG) + Interactive AI",

    // General processing
    api_call: "🌐 Demonstrating: API Integration + Backend Processing",
    data_processing: "⚙️ Demonstrating: Data Processing + State Management",
  };

  return messages[stage] || "🔄 Demonstrating: AI Processing";
};

const initSpeechSynthesis = () => {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
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
      console.log("[TTS fallback] Thinking:", text);
      if (onEnd) onEnd();
    },
    speakTalking: (text, onEnd) => {
      console.log("[TTS fallback] Talking:", text);
      if (onEnd) onEnd();
    },
    stopSpeaking: () => {},
    getVoices: () => [],
  });
};

const buildSynthAPI = (synth, voices) => {
  const getThinkingVoice = () =>
    voices.find((v) => v.name.includes("Google UK English Male")) ||
    voices.find((v) => v.name.includes("Male")) ||
    voices.find((v) => v.lang.includes("en")) ||
    voices[0];

  const getTalkingVoice = () =>
    voices.find((v) => v.name.includes("Google UK English Female")) ||
    voices.find((v) => v.name.includes("Female")) ||
    voices.find((v) => v.lang.includes("en")) ||
    voices[0];

  const speakThinking = (text, onEnd = () => {}) => {
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

  const speakTalking = (text, onEnd = () => {}, onStart = () => {}) => {
    if (!text) return;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = getTalkingVoice();
    utterance.onstart = onStart;
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
    getVoices: () => voices,
  };
};

const THINKING_MIN_DURATION = 3000;
const THINKING_TYPING_DURATION = 40;
const usedThinkingIndices = new Map();

const questions = [
  {
    key: "inputMethod",
    prompt:
      "Hello there! Before we begin, would you prefer to chat by talking or typing?",
    type: "choice",
    options: ["Talk", "Type"],
  },
  {
    key: "name",
    prompt:
      "Great! And just so I don't call you 'hey you' the whole time... what should I call you?",
    type: "text",
    placeholder: "Your name",
  },
  {
    key: "email",
    promptTemplate:
      "Thanks {name}! Mind sharing your email? Totally optional...just in case you'd like a follow-up later.",
    prompt:
      "Mind sharing your email? Totally optional...just in case you'd like a follow-up later.",
    type: "email",
    placeholder: "you@example.com",
  },
  {
    key: "consentToPhoto",
    promptTemplate:
      "Quick one, {name}: if you smile, can I snap a picture? Only if you're cool with it.",
    prompt:
      "Quick one: if you smile, can I snap a picture? Only if you're cool with it.",
    type: "checkbox",
  },
  { key: "welcomeMessage", prompt: "", type: "message" },
  {
    key: "questFlow",
    promptTemplate:
      "Perfect! One last thing, {name} - would you like to try our interactive quest to learn about company policies?",
    prompt:
      "Perfect! One last thing - would you like to try our interactive quest to learn about company policies?",
    type: "choice",
    options: ["Yes, let's do it!", "Skip to finish"],
  },
  {
    key: "tone",
    promptTemplate:
      "Lastly, {name}, how should I sound? Pick a tone that matches your vibe.",
    prompt: "Lastly, how should I sound? Pick a tone that matches your vibe.",
    type: "tone",
  },
];

const tones = [
  "Joker (Dark Knight)",
  "David Attenborough",
  "Corporate Assistant",
  "GPT Mode",
];

const thinkingVariants = {
  inputMethod: (value) => [
    `They chose to ${
      value?.toLowerCase() || "..."
    } — next up, get their name for a more human touch.`,
    `${value} selected. Now, what's their name? Makes everything less robotic.`,
    `Input method locked in: ${value}. Time to ask who I'm talking to.`,
    `Alright, ${value} it is. Let's follow that up by asking their name.`,
    `So, ${value.toLowerCase()} it is. I should now make it more personal.`,
    `They went with ${value}. Names matter — let's get theirs.`,
    `Got it. They prefer to ${value.toLowerCase()}. Let's build some rapport with a name.`,
    `The user prefers to ${value.toLowerCase()}. Now I should get their name so I can personalize our conversation.`,
  ],
  name: (value) => [
    `They go by ${
      value || "..."
    } — that's a start! Email next, but no pressure.`,
    `Name captured: ${value}. A good moment to ask for an email.`,
    `Cool, ${value} it is. I'll casually ask for an email now.`,
    `Nice. Now let's gently nudge toward getting an email (optional of course).`,
    `Logged their name as ${value}. That opens the door to asking for an email.`,
    `We're on a first-name basis now: ${value}. Let's prompt for email.`,
    `Step one complete: got their name. Now I'll suggest an optional email.`,
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
        `Blank email field. No worries. Moving to the next interaction point.`,
      ];
    }
    return [
      `Got their email: ${value}. Let's ask if I can take a photo.`,
      `Email received. I'll check if they're okay with a quick snapshot.`,
      `Email in the bag — now to see if a smile is in our future.`,
      `They entered ${value}. Time to ask about photo permission.`,
      `Now that I have their email, I can prompt for camera access.`,
      `${value} added. Next step: photo consent.`,
      `That email works. Let's transition to photo permission.`,
    ];
  },
  consentToPhoto: (value) =>
    value
      ? [
          `They agreed to the photo — setting up the camera now.`,
          `Photo consent granted. Initiating smile detection.`,
          `Perfect! They're up for a picture. Getting things ready.`,
          `Got the go-ahead for a photo. Let's see that smile.`,
          `Photo? Yes. Let's power up the camera.`,
          `Permission confirmed. Preparing the snapshot sequence.`,
          `They're okay with the photo. Time to make it work.`,
        ]
      : [
          `They'd rather skip the photo — totally fine.`,
          `No photo? No problem. Let's move on.`,
          `They declined the photo. Respect that and continue.`,
          `Skipping the camera step. Plenty more to cover.`,
          `No photo access — that's their call. Onward.`,
          `They're not comfortable with a photo. All good.`,
          `Not taking a photo. I'll pivot to the tone question.`,
        ],
  welcomeMessage: () => [
    `Intro done. Time to ask about the quest.`,
    `Now that we've met, let's see if they want to try the quest.`,
    `We're almost set — just need to see if they want the interactive experience.`,
    `One last bit: asking about the policy quest.`,
    `We've covered the basics. Now let's see if they want to explore.`,
    `Great progress. Next: the quest question.`,
    `Now I just need to know if they want the full experience.`,
  ],
  questFlow: (value) =>
    value === "Yes, let's do it!"
      ? [
          `They're excited for the quest! Let's launch the RAG interactive experience.`,
          `Adventure time! They chose the quest — loading RAG up now.`,
          `Perfect! They want the full experience. Quest mode activated to demonstrate RAG.`,
          `Great choice! The quest will show them how RAG Works.`,
          `They're up for it! Time to start the reimbursement riddle to demonstrate RAG.`,
          `Quest selected. This will be fun and educational with our RAG Implementation.`,
          `Loading the policy quest — they're going to love this interactive RAG approach.`,
        ]
      : [
          `They want to skip to the end — that's totally fine.`,
          `No quest today. Let's wrap up with tone selection.`,
          `They prefer the quick route. Moving to tone selection.`,
          `Fair enough! Some people prefer efficiency. Let's finish up.`,
          `Skipping the quest — straight to the final step.`,
          `No worries about the quest. Let's pick a tone and finish.`,
          `Quick and simple it is! Just need to select the tone.`,
        ],
  default: () => [
    `Thinking about the next best step to keep this flowing...`,
    `Hmm... figuring out what makes sense to ask next.`,
    `Just taking a second to plan the next move.`,
    `Let me process that and decide what's next.`,
    `A quick moment to reflect before the next question.`,
    `Mapping out the smoothest way forward...`,
    `Loading the next thoughtful question...`,
  ],
};

function getUniqueThinkingMessage(key, value) {
  console.log(`Getting thinking message for key: ${key}, value: ${value}`);
  const variants = (thinkingVariants[key] || thinkingVariants.default)(value);
  if (!variants.length) return "";

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
  const [showQuestFlow, setShowQuestFlow] = useState(false);
  const [questCompleted, setQuestCompleted] = useState(false);
  const [voiceStarted, setVoiceStarted] = useState(false);

  // Demo message state
  const [demoMessage, setDemoMessage] = useState("");
  const [showDemoMessage, setShowDemoMessage] = useState(false);

  const [step, setStep] = useState(0);
  const [leadInfo, setLeadInfo] = useState({
    name: "",
    email: "",
    consentToPhoto: false,
    tone: "",
    inputMethod: "",
    welcomeMessage: "",
    questFlow: "",
  });
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  const [isThinking, setIsThinking] = useState(false);
  const [thinkingText, setThinkingText] = useState("");
  const [thinkingProgress, setThinkingProgress] = useState(0);
  const [thinkingComplete, setThinkingComplete] = useState(false);
  const thinkingTimerRef = useRef(null);

  const [isModelLoading, setIsModelLoading] = useState(false);
  const [smileDetected, setSmileDetected] = useState(false);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [photoData, setPhotoData] = useState(null);

  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [apiError, setApiError] = useState("");
  const [apiOperationComplete, setApiOperationComplete] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xl")); // Check if mobile screen
  const isTablet = useMediaQuery("(max-width:800px)");
  const [isSpeechMode, setIsSpeechMode] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState("");
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
        prompt: currentQuestion.promptTemplate.replace("{name}", leadInfo.name),
      };
    }

    return currentQuestion;
  })();

  // Function to show demo message that persists until stage changes
  const showDemoTech = (stage, additionalContext = {}) => {
    const message = getDemoMessage(stage, additionalContext);
    console.log(`Showing demo message: ${message}`);

    setDemoMessage(message);
    setShowDemoMessage(true);
  };

  // Function to hide demo message when stage changes
  const hideDemoMessage = () => {
    setShowDemoMessage(false);
    setDemoMessage("");
  };

  // Enhanced thinking simulation with demo messages
  const simulateThinkingTyping = (text) => {
    console.log("Simulating thinking typing with text:", text);

    // Hide previous demo message when thinking starts
    hideDemoMessage();

    // Show TTS demo when thinking starts
    if (isSpeechMode) {
      showDemoTech("tts_thinking");
    }

    let i = 0;
    const length = text.length;

    setThinkingProgress(0);
    setThinkingComplete(false);

    if (thinkingTimerRef.current) {
      clearInterval(thinkingTimerRef.current);
    }

    if (
      speechSynthRef.current &&
      typeof speechSynthRef.current.stopSpeaking === "function"
    ) {
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
          const remainingTime = Math.max(
            0,
            THINKING_MIN_DURATION - elapsedTime
          );

          setTimeout(() => {
            setThinkingComplete(true);
          }, remainingTime);
        }
      }
    };

    thinkingTimerRef.current = setInterval(
      typeNextChar,
      THINKING_TYPING_DURATION
    );
  };

  const handleQuestComplete = (finalData) => {
    console.log("Quest completed with data:", finalData);
    setQuestCompleted(true);
    setShowQuestFlow(false);
    setIsThinking(false);
    setThinkingText("");
    setStep(questions.length);
  };

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
      personalizedQuestion: personalizedQuestion?.prompt,
    });
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      console.log("Backend audio playback ended");
      setIsBackendAudioPlaying(false);
      setIsSpeechBlocked(false);
    };

    const handleReady = () => {
      console.log("Backend audio ready to play");
      setVoiceStarted(true);
      setIsBackendAudioPlaying(true);
    };
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("canplaythrough", handleReady);
    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("canplaythrough", handleReady);
    };
  }, []);

  const moveToToneStep = () => {
    console.log("Moving to tone selection step (step 5)");
    setStep(6);
  };

  useEffect(() => {
    if (step === 4) {
      console.log(
        "On welcome message step, checking for",
        leadInfo.welcomeMessage
      );
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
      shouldSpeak,
    });

    if (shouldSpeak) {
      console.log(
        `Speaking prompt for step ${step}: "${personalizedQuestion.prompt}"`
      );

      // Show TTS demo when about to speak
      showDemoTech("tts_talking");

      // Show TTS demo when about to speak
      showDemoTech("tts_talking");

      if (step === 4 && personalizedQuestion.key === "welcomeMessage") {
        if (!isBackendAudioPlaying) {
          console.log("Speaking welcome message with speech synthesis");
          setLastSpokenStep(step);
          speakWithAction(personalizedQuestion.prompt);
        } else {
          console.log(
            "Welcome message will be played by backend audio, skipping speech"
          );
        }
      } else {
        console.log(`Regular speech for step ${step}`);

        setTimeout(() => {
          setLastSpokenStep(step);
          speakWithAction(personalizedQuestion.prompt, () => {
            if (personalizedQuestion.type === "text") {
              setIsListening(true);
              // Show STT demo when listening starts
              showDemoTech("speech_listening");
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
    lastSpokenStep,
  ]);

  useEffect(() => {
    let isMounted = true;
    console.log("Initializing speech synthesis...");

    const enableSpeechOnClick = () => {
      console.log("Testing speech synthesis on click...");
      if (
        speechSynthRef.current &&
        typeof speechSynthRef.current.speakTalking === "function"
      ) {
        speechSynthRef.current.speakTalking("", () => {
          console.log("Speech test complete");
          setLastSpokenStep(-1);
        });
      }
      document.removeEventListener("click", enableSpeechOnClick);
      document.removeEventListener("touchstart", enableSpeechOnTouch);
    };

    const enableSpeechOnTouch = () => {
      console.log("Testing speech synthesis on touch...");
      if (
        speechSynthRef.current &&
        typeof speechSynthRef.current.speakTalking === "function"
      ) {
        speechSynthRef.current.speakTalking("", () => {
          console.log("Speech test complete");
          setLastSpokenStep(-1);
        });
      }
      document.removeEventListener("click", enableSpeechOnClick);
      document.removeEventListener("touchstart", enableSpeechOnTouch);
    };

    const initSpeech = async () => {
      try {
        const synthAPI = await initSpeechSynthesis();

        if (!isMounted) return;

        if (synthAPI) {
          console.log("Speech synthesis initialized successfully");
          speechSynthRef.current = synthAPI;

          console.log("Testing speech synthesis initially...");
          if (
            speechSynthRef.current &&
            typeof speechSynthRef.current.speakTalking === "function"
          ) {
            speechSynthRef.current.speakTalking("", () => {
              console.log("Initial speech test complete");
              setLastSpokenStep(-1);
            });
          }

          document.addEventListener("click", enableSpeechOnClick);
          document.addEventListener("touchstart", enableSpeechOnTouch);
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
      document.removeEventListener("click", enableSpeechOnClick);
      document.removeEventListener("touchstart", enableSpeechOnTouch);
    };
  }, []);

  const typewriterKey = `typewriter-${step}`;

  const executePendingAction = () => {
    if (pendingActionRef.current) {
      const fn = pendingActionRef.current;
      pendingActionRef.current = null;
      fn();
    }
  };

  const speakWithAction = (text, action) => {
    console.log("Attempting to speak:", text);
    console.log("Speech conditions:", {
      isBackendAudioPlaying,
      isSpeechBlocked,
      isSpeechMode,
      hasSpeechRef: !!speechSynthRef.current,
    });

    if (
      isBackendAudioPlaying ||
      isSpeechBlocked ||
      !isSpeechMode ||
      !speechSynthRef.current
    ) {
      setVoiceStarted(true);
      console.log("TTS not allowed/available – execute action immediately");
      action?.();
      return;
    }

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsBackendAudioPlaying(false);

    if (typeof speechSynthRef.current.speakTalking !== "function") {
      console.log("Speech synthesis API missing");
      action?.();
      return;
    }

    setIsSpeaking(true);
    setVoiceStarted(false);

    if (action) pendingActionRef.current = action;

    speechSynthRef.current.speakTalking(
      text,
      () => {
        setIsSpeaking(false);
        executePendingAction();
      },
      () => {
        setVoiceStarted(true);
      }
    );
  };

  const goToNextStep = () => {
    if (step + 1 < questions.length) {
      const key = currentQuestion.key;
      const value = leadInfo[key];

      let thinking;
      if (key === "consentToPhoto" && value === true && photoTaken) {
        thinking = getUniqueThinkingMessage("welcomeMessage", "");
      } else {
        thinking = getUniqueThinkingMessage(key, value);
      }

      setThinkingText("");
      setIsThinking(true);
      setWaitingForSpeechToEnd(false);
      simulateThinkingTyping(thinking);

      setTimeout(() => {
        setStep((prev) => prev + 1);
      }, 100);
    }
  };

  const canProceedToNextStep = () => {
    return (
      thinkingComplete &&
      apiOperationComplete &&
      !waitingForSpeechToEnd &&
      !isSpeaking
    );
  };

  useEffect(() => {
    setVoiceStarted(false);
    // Hide demo messages when step changes
    hideDemoMessage();
  }, [step]);

  useEffect(() => {
    if (isThinking && canProceedToNextStep()) {
      console.log("Thinking done – leaving thinking state");
      const visibilityDelay = 1000;

      setTimeout(() => {
        setIsThinking(false);
        setThinkingComplete(false);
        setThinkingProgress(0);
        setIsTyping(true);

        executePendingAction();
      }, visibilityDelay);
    }
  }, [
    isThinking,
    thinkingComplete,
    apiOperationComplete,
    isSpeaking,
    waitingForSpeechToEnd,
  ]);

  const handleInputSubmit = async () => {
    if (!personalizedQuestion) return;

    const key = personalizedQuestion.key;
    const submittedValue = inputValue.trim();
    setInputValue("");

    console.log(`Submitting value for key: ${key} = "${submittedValue}"`);

    let finalValue = submittedValue;

    if (key === "name" && submittedValue) {
      try {
        console.log("Calling extract-names API...");
        showDemoTech("speech_processing");

        const response = await axios.post(`${API_BASE_URL}/extract-names`, {
          text: submittedValue,
        });
        if (response.data.name) {
          finalValue = response.data.name;
          console.log(
            `Name refined from "${submittedValue}" to "${finalValue}"`
          );
        }
      } catch (error) {
        console.error("Name extraction API error:", error);
      }
    } else if (key === "email") {
      showDemoTech("email_processing");
    } else {
      showDemoTech("text_input");
    }

    setLeadInfo((prev) => {
      const newState = { ...prev, [key]: finalValue };

      const thinkingMsg = getUniqueThinkingMessage(key, finalValue);

      setThinkingText("");
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

    setLeadInfo((prev) => ({ ...prev, [key]: isChecked }));

    if (key === "consentToPhoto") {
      if (isChecked) {
        setApiOperationComplete(false);
        showDemoTech("camera_init");
        initializeCamera();
      } else {
        const thinkingMsg = getUniqueThinkingMessage(key, isChecked);

        const defaultMsg = "Thanks for letting me know! Let's continue.";
        setLeadInfo((prev) => ({
          ...prev,
          welcomeMessage: defaultMsg,
        }));
        questions[4].prompt = defaultMsg;

        setThinkingText("");
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

      setThinkingText("");
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
      welcomeMessage: leadInfo.welcomeMessage,
    });
  };

  const handleChoiceSelect = (value) => {
    if (!personalizedQuestion) return;
    const key = personalizedQuestion.key;

    // Show demo message for input method selection
    if (key === "inputMethod") {
      showDemoTech("inputMethod_choice");
    }

    // Show demo message for input method selection
    if (key === "inputMethod") {
      showDemoTech("inputMethod_choice");
    }

    if (key === "inputMethod" && value === "Talk") {
      setIsSpeechMode(true);
    } else if (key === "inputMethod") {
      setIsSpeechMode(false);
    }

    if (key === "questFlow") {
      setLeadInfo((prev) => ({ ...prev, [key]: value }));

      if (value === "Yes, let's do it!") {
        const thinkingMsg = getUniqueThinkingMessage(key, value);
        pendingActionRef.current = () => {
          showDemoTech("quest_launch");
          setShowQuestFlow(true);
        };
        setThinkingText("");
        setIsThinking(true);
        setWaitingForSpeechToEnd(false);
        simulateThinkingTyping(thinkingMsg);
        return;
      }
    }

    setLeadInfo((prev) => {
      const newState = { ...prev, [key]: value };

      const thinkingMsg = getUniqueThinkingMessage(key, value);

      setThinkingText("");
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
    showDemoTech("data_processing");

    const updatedInfo = {
      ...leadInfo,
      tone,
    };

    setLeadInfo(updatedInfo);

    if (typeof onNext === "function") {
      console.log("Calling onNext with leadInfo:", updatedInfo);
      onNext(updatedInfo);
    } else {
      console.log(
        "onNext is not a function, cannot proceed. Final data:",
        updatedInfo
      );
      goToNextStep();
    }
  };

  const handleReset = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (detectionRef.current) {
      clearInterval(detectionRef.current);
      detectionRef.current = null;
    }

    if (thinkingTimerRef.current) {
      clearInterval(thinkingTimerRef.current);
    }

    if (
      speechSynthRef.current &&
      typeof speechSynthRef.current.stopSpeaking === "function"
    ) {
      speechSynthRef.current.stopSpeaking();
    }

    setLeadInfo({
      name: "",
      email: "",
      consentToPhoto: false,
      tone: "",
      inputMethod: "",
      welcomeMessage: "",
      questFlow: "",
    });
    setStep(0);
    setInputValue("");
    setIsTyping(true);
    setIsThinking(false);
    setThinkingComplete(false);
    setThinkingProgress(0);
    setSmileDetected(false);
    setPhotoTaken(false);
    setPhotoData(null);
    setCameraError("");
    setApiError("");
    setApiOperationComplete(true);
    setIsSpeechMode(false);
    setCurrentTranscript("");
    setIsListening(false);
    setIsSpeaking(false);
    setWaitingForSpeechToEnd(false);
    pendingActionRef.current = null;
    setLastSpokenStep(-1);
    setIsSpeechBlocked(false);
    setIsBackendAudioPlaying(false);
    setShowQuestFlow(false);
    setQuestCompleted(false);
    setShowDemoMessage(false);
    setDemoMessage("");
  };

  const initializeCamera = async () => {
    try {
      console.log("Starting camera initialization...");
      setIsModelLoading(true);

      try {
        showDemoTech("camera_init");
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        console.log("Face detection models loaded successfully");
      } catch (modelErr) {
        console.error("Error loading face detection models:", modelErr);
        setCameraError(
          `Could not load face detection models: ${modelErr.message}`
        );
        setApiOperationComplete(true);
        goToNextStep();
        return;
      }

      console.log("Requesting camera access...");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });

      console.log("Camera access granted");

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;

        videoRef.current.onloadedmetadata = () => {
          console.log("Video metadata loaded");
          videoRef.current
            .play()
            .then(() => {
              console.log("Video playback started");
              setIsModelLoading(false);
              showDemoTech("face_detection");
              startFaceDetection();
            })
            .catch((playErr) => {
              console.error("Error starting video playback:", playErr);
              setCameraError(
                `Error starting video playback: ${playErr.message}`
              );
              setIsModelLoading(false);
              setApiOperationComplete(true);
              goToNextStep();
            });
        };
      } else {
        console.error("Video ref is not available");
        setCameraError("Video element not found");
        setIsModelLoading(false);
        setApiOperationComplete(true);
        goToNextStep();
      }
    } catch (err) {
      console.error("Error initializing camera:", err);
      setCameraError(`Could not initialize camera: ${err.message}`);
      setIsModelLoading(false);
      setApiOperationComplete(true);

      goToNextStep();
    }
  };

  const startFaceDetection = () => {
    console.log("Starting face detection...");
    if (!videoRef.current) {
      console.error("Video reference not available for face detection");
      setApiOperationComplete(true);
      goToNextStep();
      return;
    }

    console.log("Setting up face detection interval");
    detectionRef.current = setInterval(async () => {
      if (!videoRef.current || videoRef.current.readyState !== 4) {
        console.log("Video not ready yet, waiting...");
        return;
      }

      try {
        const options = new faceapi.TinyFaceDetectorOptions({
          inputSize: 224,
          scoreThreshold: 0.5,
        });
        const detections = await faceapi.detectAllFaces(
          videoRef.current,
          options
        );

        if (detections && detections.length > 0) {
          const withExpressions = await faceapi
            .detectAllFaces(videoRef.current, options)
            .withFaceExpressions();
          if (withExpressions && withExpressions.length > 0) {
            const detection = withExpressions[0];
            const isSmiling = detection.expressions.happy > 0.7;

            console.log(
              `Smile detection: ${isSmiling ? "Smiling" : "Not smiling"}`
            );

            if (isSmiling && !smileDetected) {
              console.log("Smile confirmed! Capturing photo...");
              setSmileDetected(true);
              showDemoTech("smile_detection");
              setTimeout(() => {
                showDemoTech("photo_capture");
                capturePhoto();
              }, 500);
              clearInterval(detectionRef.current);
              detectionRef.current = null;
            }
          }
        }
      } catch (err) {
        console.error("Error in face detection:", err);
      }
    }, 500);

    setTimeout(() => {
      if (detectionRef.current) {
        console.log("Smile detection timeout reached. Moving on...");
        clearInterval(detectionRef.current);
        detectionRef.current = null;

        if (!smileDetected) {
          setCameraError("Could not detect a smile. Moving on...");
          setApiOperationComplete(true);
          goToNextStep();
        }
      }
    }, 20000);
  };

  const capturePhoto = () => {
    console.log("Capturing photo...");
    if (!videoRef.current || !canvasRef.current) {
      setApiOperationComplete(true);
      setStep((prev) => prev + 1);
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    try {
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      console.log("Photo captured successfully");

      const base64Image = canvas.toDataURL("image/jpeg");

      setPhotoData(base64Image);
      setPhotoTaken(true);

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      setTimeout(() => {
        const base64DataPart = base64Image.split(",")[1];
        console.log("Processing image with API...");
        showDemoTech("image_processing");
        processImageWithAPI(base64DataPart);
      }, 500);
    } catch (err) {
      console.error("Error capturing photo:", err);
      setCameraError(`Error capturing photo: ${err.message}`);
      setApiOperationComplete(true);

      console.log("Photo capture error, moving to welcome step");
      setStep(4);
    }
  };

  const processImageWithAPI = async (base64Image) => {
    console.log("Processing image with API...");
    setIsProcessingImage(true);
    setApiError("");

    try {
      console.log("Sending API request...");
      const response = await axios.post(
        `${API_BASE_URL}/process-image-base64`,
        {
          model: "gpt-4o",
          prompt: `You're shown an image of a visitor's outfit — including visible clothing, accessories, and possibly their posture or expression. Create a friendly, welcoming message that mentions safe visual details like color, style, or accessories. Avoid referring to faces or personal characteristics. Keep the tone warm and professional.`,
          base64_image: base64Image,
        }
      );

      console.log("API response received:", response.data);

      const welcomeMsg =
        response.data.message?.content || "Welcome! Nice to meet you.";

      setLeadInfo((prev) => ({
        ...prev,
        welcomeMessage: welcomeMsg,
      }));

      questions[4].prompt = welcomeMsg;

      if (
        speechSynthRef.current &&
        typeof speechSynthRef.current.stopSpeaking === "function"
      ) {
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
        console.log("Speech blocked for audio playback");

        const audioUrl = `${API_BASE_URL}${
          response.data.audio_path
        }?t=${Date.now()}`;
        audioRef.current.src = audioUrl;

        setLastSpokenStep(4);

        setIsBackendAudioPlaying(true);

        const handleAudioComplete = () => {
          console.log("Welcome message audio completed");
          setIsBackendAudioPlaying(false);
          setIsSpeechBlocked(false);

          setTimeout(() => {
            console.log("Moving to quest flow after audio");
            setStep(5);
          }, 1000);

          audioRef.current.removeEventListener("ended", handleAudioComplete);
        };

        audioRef.current.removeEventListener("ended", () => {});
        audioRef.current.addEventListener("ended", handleAudioComplete);

        setTimeout(() => {
          audioRef.current.play().catch((err) => {
            console.error("Error playing audio:", err);
            setIsBackendAudioPlaying(false);
            setIsSpeechBlocked(false);

            console.log(
              "Audio playback failed, moving to welcome message step"
            );
            setStep(4);
          });
        }, 300);

        setTimeout(() => {
          if (isBackendAudioPlaying) {
            console.log("Audio taking too long, forcing continuation");
            setIsBackendAudioPlaying(false);
            setIsSpeechBlocked(false);

            if (step !== 5) {
              console.log("Moving to quest flow after timeout");
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
          console.log("Moving to quest flow with no audio");
          setStep(5);
        }, 3000);
      }
    } catch (err) {
      console.error("Error processing image with API:", err);
      setApiError(`Error processing image: ${err.message}`);

      const defaultMsg = "Thanks for the photo! Great to meet you.";
      setLeadInfo((prev) => ({
        ...prev,
        welcomeMessage: defaultMsg,
      }));
      questions[4].prompt = defaultMsg;

      setIsSpeechBlocked(false);
      setIsBackendAudioPlaying(false);
      setLastSpokenStep(-1);

      console.log("Error in API, moving to welcome message with default text");
      setStep(4);

      setTimeout(() => {
        console.log("Moving to quest flow after error");
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

  const handleTranscript = async (text, isFinal = false) => {
    if (!speechInputReady) return;

    setIsListening(true);
    setCurrentTranscript(text);

    if (isFinal && text.trim()) {
      setIsListening(false);
      showDemoTech("speech_processing");

      setInputValue(text);
      let finalValue = text.trim();

      // Run name-extraction ONLY for the "name" question
      if (personalizedQuestion?.key === "name") {
        try {
          const { data } = await axios.post(`${API_BASE_URL}/extract-names`, {
            text: finalValue,
          });
          if (data?.name) finalValue = data.name;
        } catch (err) {
          console.error("Name extraction API error:", err);
        }
      }

      setSpeechInputReady(false);

      if (personalizedQuestion) {
        const key = personalizedQuestion.key;
        setLeadInfo((prev) => {
          const newState = { ...prev, [key]: finalValue };

          const thinkingMsg = getUniqueThinkingMessage(key, finalValue);
          setThinkingText("");
          setIsThinking(true);
          setWaitingForSpeechToEnd(false);
          simulateThinkingTyping(thinkingMsg);

          setTimeout(() => {
            setStep(step + 1);
            setCurrentTranscript("");
          }, 100);

          return newState;
        });
      }
    }
  };

  if (showQuestFlow && !questCompleted) {
    return (
      <RAGQuestScreen leadInfo={leadInfo} onComplete={handleQuestComplete} />
    );
  }

  const showTypewriter =
    personalizedQuestion && !isThinking && (!isSpeechMode || voiceStarted);

  if (questCompleted) {
    return (
      <Box
        sx={{
          padding: "2rem",
          margin: "40px auto",
          maxWidth: "100%",
          minHeight: "100vh",
          position: "relative",
        }}
      >
        <Box
          className="lead-capture-layout"
          sx={{
            display: "flex",
            flexDirection: isTablet ? "column" : "row",
          }}
        >
          <div className="orb-column">
            <Orb hoverIntensity={0.5} rotateOnHover={true} hue={0} />
          </div>

          <div className="text-column">
            <Typography
              className="byte-heading"
              sx={{
                fontSize: isMobile ? "1.5rem" : "2rem",
                textAlign: "center",
              }}
            >
              Hi, I'm Byte. Let's play a quick game!
            </Typography>

            <div className="quest-completed-message">
              <Typography
                className="byte-heading"
                sx={{
                  fontSize: isMobile ? "1.5rem" : "2rem",
                }}
              >
                🎉 Quest Completed!
              </Typography>
              <Typography
                className="byte-heading"
                sx={{
                  fontSize: isMobile ? "1.3rem" : "1.8rem",
                }}
              >
                Great job exploring the BytesizedAI Model Experience,{" "}
                {leadInfo.name}! Log in to https://bytesized.com.au/beta to
                enroll in our beta program.
              </Typography>
            </div>

            {photoTaken && photoData && (
              <Box
                className="captured-photo-container"
                sx={{
                  width: isMobile ? "250px" : "300px",
                  height: isMobile ? "250px" : "300px",
                  display: "flex",
                  justifyContent: "center",
                  margin: "auto",
                }}
              >
                <img
                  src={photoData}
                  alt="Captured"
                  className="captured-photo-thumbnail"
                />
              </Box>
            )}
          </div>
        </Box>
        <div className="start-over-container">
          <button
            className="start-over-button"
            onClick={handleReset}
            title="Start over from the beginning"
          >
            <Typography
              sx={{
                fontSize: isMobile ? "1.2rem" : "1.8rem",
                fontWeight: isMobile ? 400 : 500,
              }}
            >
              ↺ Start Over
            </Typography>
          </button>
        </div>
        <DemonstratingNER />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        borderRadius: "20px",
        borderStyle: "solid",
        borderWidth: "0px",
        maxWidth: "100%",
        borderColor: "#353434d7",
        margin: "auto",
        marginY: "2rem",
        paddingY: "2rem",
        position: "relative",
      }}
    >
      <Box
        // className="lead-capture-layout"
        sx={{
          background: "#000",
          color: "#f2f2f2",
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "center",
          gap: "3rem",
          padding: "2rem",
          minHeight: "50vh",
          height: "100%",
          margin: "40px auto",
          "@media (max-width: 800px)": {
            flexDirection: "column",
            gap: "2rem",
            padding: "1rem",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: isTablet ? "column" : "row",
            justifyContent: "center",
            gap: "2rem",
            minWidth: isTablet ? "" : "960px",
            alignItems: isMobile ? "center" : "start",
            width: "100%",
          }}
        >
          <Box
            className="orb-column"
            sx={{
              display: "flex",
              justifyContent: "center",
              width: isTablet ? "100%" : "auto",
              paddingBottom: "20px",
              paddingTop: "50px",
            }}
          >
            <Orb
              hoverIntensity={0.5}
              rotateOnHover={true}
              hue={0}
              forceHoverState={isTyping || isThinking}
            />
          </Box>

          <div className="text-column">
            {/* Demo Message Display */}
            {showDemoMessage && (
              <div className="demo-message-container">
                <div className="demo-message">
                  <Typography
                    sx={{
                      fontSize: isTablet ? "0.8rem" : "1.2rem",
                      textAlign: "center",
                    }}
                  >
                    {demoMessage}
                  </Typography>
                </div>
              </div>
            )}
            <Typography
              className="byte-heading"
              sx={{
                fontSize: isMobile ? "1.5rem" : "2rem",
                textAlign: "center",
                paddingTop: "40px",
              }}
            >
              Hi, I'm Byte. Let's play a quick game!
            </Typography>
            {questCompleted && (
              <div className="quest-completed-message">
                <Typography
                  className="byte-heading"
                  sx={{
                    fontSize: isMobile ? "1.3rem" : "1.8rem",
                  }}
                >
                  🎉 Quest Completed!
                </Typography>
                <Typography
                  className="byte-heading"
                  sx={{
                    fontSize: isMobile ? "1.3rem" : "1.8rem",
                  }}
                >
                  Great job exploring our policies, {leadInfo.name}!
                </Typography>
              </div>
            )}

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
              {showTypewriter ? (
                <Typography
                  className={`byte-question ${isSpeaking ? "speaking" : ""}`}
                  sx={{
                    fontSize: isMobile ? "1.2rem" : "1.8rem",
                  }}
                >
                  <Typewriter
                    key={`tw-${step}`}
                    options={{ delay: 40, cursor: "|", deleteSpeed: 0 }}
                    onInit={(tw) => {
                      setIsTyping(true);
                      tw.typeString(personalizedQuestion.prompt)
                        .callFunction(() => {
                          setIsTyping(false);
                          setTypingComplete(true);
                          setSpeechInputReady(true);
                        })
                        .start();
                    }}
                  />
                </Typography>
              ) : (
                <div className="byte-question-loading">
                  <div className="spinner-container">
                    <div className="spinner" />
                    <Typography
                      sx={{
                        fontSize: isMobile ? "1.2rem" : "1.8rem",
                      }}
                    >
                      Thinking...
                    </Typography>
                    {isThinking && (
                      <Typography
                        sx={{
                          fontSize: isMobile ? "1rem" : "1.5rem",
                          paddingTop: "3rem",
                          minWidth: "100%",
                        }}
                      >
                        {thinkingText}
                      </Typography>
                    )}
                  </div>
                </div>
              )}
            </div>

            {personalizedQuestion && !isThinking && (
              <>
                {personalizedQuestion.type === "choice" && (
                  <Box
                    className="choice-selection"
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {personalizedQuestion.options.map((option, idx) => (
                      <Button
                        key={option}
                        onClick={() => handleChoiceSelect(option)}
                        variant="contained"
                        sx={{
                          padding: "0.5rem 0.75rem",
                          background:
                            idx === 0
                              ? "linear-gradient(45deg, #6E00FF, #3E9EFF)"
                              : "linear-gradient(-45deg, #6E00FF, #3E9EFF)",
                          color: "white",
                          borderRadius: "8px",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          boxShadow:
                            "0 4px 16px 0 rgba(0, 0, 0, 0.1), 0 1.5px 4px 0 rgba(0, 0, 0, 0.06)",
                          minWidth: isMobile ? "110px" : "150px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginRight: "1rem",
                          textTransform: "none",
                          gap: "0.3rem",
                          fontSize: isMobile ? "1.2rem" : "1.8rem",
                          ":hover": {
                            background:
                              idx === 0
                                ? "linear-gradient(135deg, #873CFF, #5AC8FF)"
                                : "linear-gradient(135deg, #5AC8FF, #873CFF)",
                            boxShadow:
                              idx === 0
                                ? "0 0 12px rgba(98, 0, 255, 0.5)"
                                : "0 0 10px rgba(46, 158, 254, 0.6)",
                          },
                        }}
                      >
                        <img
                          src={idx === 0 ? micIcon : penIcon}
                          alt="mic"
                          width={isMobile ? 18 : 24}
                          height={isMobile ? 18 : 24}
                        />
                        <span>{option}</span>
                      </Button>
                    ))}
                  </Box>
                )}

                {!isTyping && (
                  <>
                    {personalizedQuestion.type === "text" && (
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
                            <Typography
                              className="transcript-display"
                              sx={{
                                fontSize: isMobile ? "1.2rem" : "1.8rem",
                              }}
                            >
                              {isListening ? (
                                <p>Listening... {currentTranscript}</p>
                              ) : (
                                <p>
                                  {currentTranscript ||
                                    "Please speak your name..."}
                                </p>
                              )}
                            </Typography>
                          </div>
                        ) : (
                          <>
                            <Input
                              type="text"
                              value={inputValue}
                              onChange={(e) => setInputValue(e.target.value)}
                              placeholder={personalizedQuestion.placeholder}
                              onKeyDown={(e) => {
                                if (
                                  e.key === "Enter" &&
                                  inputValue.trim() !== ""
                                )
                                  handleInputSubmit();
                              }}
                              sx={{
                                fontSize: isMobile ? "1.2rem" : "1.8rem",
                              }}
                            />
                            <button
                              className="next-button"
                              onClick={handleInputSubmit}
                              disabled={!inputValue.trim()}
                            >
                              <Typography
                                sx={{
                                  fontSize: isMobile ? "1.2rem" : "1.8rem",
                                }}
                              >
                                Next →
                              </Typography>
                            </button>
                          </>
                        )}
                      </>
                    )}

                    {personalizedQuestion.type === "email" && (
                      <>
                        <Input
                          type="email"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder={personalizedQuestion.placeholder}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleInputSubmit();
                          }}
                          sx={{
                            fontSize: isMobile ? "1.2rem" : "1.8rem",
                          }}
                        />
                        <Typography
                          className="optional-field-note"
                          sx={{
                            fontSize: isMobile ? "1.2rem" : "1.5rem",
                          }}
                        >
                          {isSpeechMode
                            ? "Totally optional! Drop your email if you’d like updates or support no spam, no nonsense, just the good stuff. Or skip it and hit Next"
                            : "This field is optional. You can leave it blank and click Next."}
                        </Typography>
                        <button
                          className="next-button"
                          onClick={handleInputSubmit}
                        >
                          <Typography
                            sx={{
                              fontSize: isMobile ? "1.2rem" : "1.8rem",
                            }}
                          >
                            Next →
                          </Typography>
                        </button>
                      </>
                    )}

                    {personalizedQuestion.type === "checkbox" && (
                      <div className="consent-options">
                        <Button
                          className={`consent-button ${
                            leadInfo[personalizedQuestion.key]
                              ? "consent-yes-selected"
                              : ""
                          }`}
                          onClick={() =>
                            handleCheckboxChange({ target: { checked: true } })
                          }
                          sx={{
                            padding: "0.5rem 0.75rem",
                            background:
                              "linear-gradient(125deg, #6E00FF, #3E9EFF)",
                            color: "white",
                            borderRadius: "8px",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            boxShadow:
                              "0 4px 16px 0 rgba(0, 0, 0, 0.1), 0 1.5px 4px 0 rgba(0, 0, 0, 0.06)",
                            minWidth: isMobile ? "110px" : "150px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginRight: "1rem",
                            textTransform: "none",
                            gap: "0.3rem",
                            fontSize: isMobile ? "1.2rem" : "1.8rem",
                            ":hover": {
                              background:
                                "linear-gradient(135deg, #873CFF, #5AC8FF)",
                              boxShadow: "0 0 12px rgba(98, 0, 255, 0.5)",
                            },
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: isMobile ? "1.2rem" : "1.8rem",
                            }}
                          >
                            Yes
                          </Typography>
                        </Button>
                        <Button
                          className={`consent-button ${
                            leadInfo[personalizedQuestion.key] === false &&
                            leadInfo[personalizedQuestion.key] !== undefined
                              ? "consent-no-selected"
                              : ""
                          }`}
                          onClick={() =>
                            handleCheckboxChange({ target: { checked: false } })
                          }
                          sx={{
                            padding: "0.5rem 0.75rem",
                            background:
                              "linear-gradient(-95deg, #6E00FF, #3E9EFF)",
                            color: "white",
                            borderRadius: "8px",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            boxShadow:
                              "0 4px 16px 0 rgba(0, 0, 0, 0.1), 0 1.5px 4px 0 rgba(0, 0, 0, 0.06)",
                            minWidth: isMobile ? "110px" : "150px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginRight: "1rem",
                            textTransform: "none",
                            gap: "0.3rem",
                            fontSize: isMobile ? "1.2rem" : "1.8rem",
                            ":hover": {
                              background:
                                "linear-gradient(135deg, #5AC8FF, #873CFF)",
                              boxShadow: "0 0 10px rgba(46, 158, 254, 0.6)",
                            },
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: isMobile ? "1.2rem" : "1.8rem",
                            }}
                          >
                            No
                          </Typography>
                        </Button>
                      </div>
                    )}

                    {personalizedQuestion.type === "tone" && (
                      <div className="tone-selection">
                        {tones.map((tone) => (
                          <button
                            key={tone}
                            className={
                              leadInfo.tone === tone ? "selected-tone" : ""
                            }
                            onClick={() => handleToneSelect(tone)}
                          >
                            {tone}
                          </button>
                        ))}
                      </div>
                    )}

                    {personalizedQuestion.type === "message" && (
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
                        <Typography
                          sx={{
                            fontSize: isMobile ? "1.2rem" : "1.8rem",
                          }}
                        >
                          Next →
                        </Typography>
                      </button>
                    )}
                  </>
                )}

                {personalizedQuestion.key === "consentToPhoto" &&
                  leadInfo.consentToPhoto &&
                  !photoTaken && (
                    <div className="camera-container">
                      <Typography
                        className="camera-status"
                        sx={{
                          fontSize: isMobile ? "1.2rem" : "1.8rem",
                        }}
                      >
                        {isModelLoading
                          ? "Loading face detection..."
                          : smileDetected
                          ? "Great smile! Capturing photo..."
                          : "Please smile for the camera!"}
                      </Typography>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="camera-video"
                      />
                      {cameraError && (
                        <div className="camera-error">{cameraError}</div>
                      )}
                    </div>
                  )}

                <canvas ref={canvasRef} style={{ display: "none" }} />

                {isProcessingImage && (
                  <div className="processing-indicator">
                    <div className="spinner"></div>
                    <div>Analyzing your photo...</div>
                  </div>
                )}

                {apiError && <div className="api-error">{apiError}</div>}
              </>
            )}
          </div>
        </Box>

        <audio
          ref={audioRef}
          style={{ display: "none" }}
          onError={(e) => console.error("Audio playback error:", e)}
        />

        <div className="start-over-container">
          <button
            className="start-over-button"
            onClick={handleReset}
            title="Start over from the beginning"
          >
            <Typography
              sx={{
                fontSize: isMobile ? "1.2rem" : "1.8rem",
                fontWeight: isMobile ? 400 : 500,
              }}
            >
              ↺ Start Over
            </Typography>
          </button>
        </div>

        {/* {isThinking && (
          <Box
            className={`thinking-box ${
              isSpeechMode && isSpeaking ? "speaking" : ""
            }`}
            sx={{
              fontSize: isMobile ? "1.2rem" : "1.8rem",
            }}
          >
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
          </Box>
        )} */}
      </Box>
      <DemonstratingNER />
    </Box>
  );
};

export default LeadCaptureScreen;
