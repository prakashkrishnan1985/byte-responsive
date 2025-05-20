import React, { useState, useEffect, useRef } from 'react';
import './styles/SpeechBasedFlow.css';
import Orb from './OrbBackground';
import axios from 'axios';
import * as faceapi from '@vladmandic/face-api';

// Constants
const MODEL_URL = "/models";
const API_BASE_URL = "https://model-api-dev.bytesized.com.au";
const THINKING_MIN_DURATION = 3000;

// Flow questions - skipping the inputMethod question since it's already been answered
const questions = [
  { 
    key: 'name', 
    prompt: "Hello there! I'm Byte. To get started, could you tell me your name?", 
    type: 'speech'
  },
  { 
    key: 'email', 
    promptTemplate: "Thanks {name}! If you'd like a follow-up later, feel free to share your email. If not, just say 'skip'.",
    prompt: "If you'd like a follow-up later, feel free to share your email. If not, just say 'skip'.",
    type: 'speech' 
  },
  { 
    key: 'consentToPhoto', 
    promptTemplate: "Quick one, {name}: if you smile, can I take your photo? Just say yes or no.", 
    prompt: "Quick one: if you smile, can I take your photo? Just say yes or no.",
    type: 'speech'
  },
  {
    key: 'welcomeMessage',
    prompt: "",
    type: 'message'
  },
  { 
    key: 'tone', 
    promptTemplate: "Lastly, {name}, how should I sound? Say a number: 1 for Joker, 2 for David Attenborough, 3 for Corporate Assistant, or 4 for GPT Mode.", 
    prompt: "Lastly, how should I sound? Say a number: 1 for Joker, 2 for David Attenborough, 3 for Corporate Assistant, or 4 for GPT Mode.",
    type: 'speech' 
  }
];

const tones = [
  'Joker (Dark Knight)',
  'David Attenborough',
  'Corporate Assistant',
  'GPT Mode',
];

const thinkingMessages = {
  name: (value) => {
    return `Great! The user's name is ${value || '...'} Now I should ask for their email to follow up later. This is optional, so I'll make sure they know that.`;
  },
  email: (value) => {
    if (!value || value.trim() === '' || value.toLowerCase() === 'skip') {
      return 'They chose not to share their email. Next, I should ask if they\'re comfortable with me taking a photo. It\'s important to get explicit consent for this.';
    }
    return `I have their email now (${value}). Next, I should ask if they're comfortable with me taking a photo. It's important to get explicit consent for this.`;
  },
  consentToPhoto: (value) => {
    return value && (value.toLowerCase().includes('yes') || value.toLowerCase().includes('sure') || value.toLowerCase().includes('okay'))
      ? "They've given consent for a photo. I'll process this image to create a personalized welcome message based on what I see."
      : "They preferred not to take a photo, which is perfectly fine. Let's move on to selecting a voice tone.";
  },
  welcomeMessage: () => {
    return "Now that we've exchanged pleasantries, I should ask which voice tone they'd prefer me to use. This will help personalize our interaction further.";
  },
  tone: (value) => {
    let toneIndex = -1;
    if (value && value.trim() !== '') {
      // Try to extract a number from the response
      const match = value.match(/\d+/);
      if (match) {
        toneIndex = parseInt(match[0], 10) - 1;
      } else if (value.toLowerCase().includes('joker')) {
        toneIndex = 0;
      } else if (value.toLowerCase().includes('david') || value.toLowerCase().includes('attenborough')) {
        toneIndex = 1;
      } else if (value.toLowerCase().includes('corporate') || value.toLowerCase().includes('assistant')) {
        toneIndex = 2;
      } else if (value.toLowerCase().includes('gpt')) {
        toneIndex = 3;
      }
    }
    
    const selectedTone = toneIndex >= 0 && toneIndex < tones.length ? tones[toneIndex] : "default tone";
    return `The user selected ${selectedTone} as their preferred tone. I'll now complete the onboarding process.`;
  },
  default: () => {
    return "Let me think about what information I need next to provide the best experience...";
  }
};

const SpeechBasedFlow = ({ onNext, initialData = {} }) => {
  const [step, setStep] = useState(0);
  const [leadInfo, setLeadInfo] = useState({
    name: initialData.name || '',
    email: initialData.email || '',
    consentToPhoto: initialData.consentToPhoto || false,
    tone: initialData.tone || '',
    welcomeMessage: initialData.welcomeMessage || '',
    inputMethod: 'Talk' // Default to 'Talk' since this is the speech flow
  });
  
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingText, setThinkingText] = useState('');
  const [thinkingProgress, setThinkingProgress] = useState(0);
  const [thinkingComplete, setThinkingComplete] = useState(false);
  
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [smileDetected, setSmileDetected] = useState(false);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [photoData, setPhotoData] = useState(null);
  
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [apiError, setApiError] = useState('');
  const [apiOperationComplete, setApiOperationComplete] = useState(true);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const detectionRef = useRef(null);
  const audioRef = useRef(new Audio());
  const recognitionRef = useRef(null);
  const thinkingTimerRef = useRef(null);
  
  const currentQuestion = step < questions.length ? questions[step] : null;
  
  // Create personalized question with name replacement
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

  // Initialize speech recognition
  const initSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error('Speech recognition not supported');
      setApiError('Speech recognition is not supported in this browser.');
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    recognition.onstart = () => {
      console.log('Speech recognition started');
      setIsListening(true);
      setTranscript('');
      setFinalTranscript('');
    };
    
    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      
      setTranscript(interimTranscript);
      
      if (finalTranscript) {
        setFinalTranscript(finalTranscript);
        
        if (currentQuestion && currentQuestion.type === 'speech') {
          stopListening();
          processUserResponse(finalTranscript);
        }
      }
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
      setApiError(`Speech recognition error: ${event.error}`);
    };
    
    recognition.onend = () => {
      console.log('Speech recognition ended');
      setIsListening(false);
    };
    
    recognitionRef.current = recognition;
  };
  
  const startListening = () => {
    if (!recognitionRef.current) {
      initSpeechRecognition();
    }
    
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error('Error starting speech recognition:', err);
      }
    }
  };
  
  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error('Error stopping speech recognition:', err);
      }
    }
  };
  
  // Process the spoken response from the user
  const processUserResponse = (response) => {
    if (!personalizedQuestion) return;
    
    const key = personalizedQuestion.key;
    let value = response.trim();
    
    console.log(`Processing speech response for ${key}: ${value}`);
    
    setLeadInfo(prev => {
      let updatedValue = value;
      
      // Process specific responses based on question type
      if (key === 'email' && (value.toLowerCase().includes('skip') || value.toLowerCase().includes('no'))) {
        updatedValue = '';
      } else if (key === 'consentToPhoto') {
        const isConsenting = 
          value.toLowerCase().includes('yes') || 
          value.toLowerCase().includes('sure') || 
          value.toLowerCase().includes('okay') || 
          value.toLowerCase().includes('fine');
        
        updatedValue = isConsenting;
        
        if (isConsenting) {
          setTimeout(() => {
            setApiOperationComplete(false);
            initializeCamera();
          }, 500);
        }
      } else if (key === 'tone') {
        // Extract tone selection from verbal response
        let toneIndex = -1;
        
        // Try to extract a number from the response
        const match = value.match(/\d+/);
        if (match) {
          toneIndex = parseInt(match[0], 10) - 1;
        } else if (value.toLowerCase().includes('joker')) {
          toneIndex = 0;
        } else if (value.toLowerCase().includes('david') || value.toLowerCase().includes('attenborough')) {
          toneIndex = 1;
        } else if (value.toLowerCase().includes('corporate') || value.toLowerCase().includes('assistant')) {
          toneIndex = 2;
        } else if (value.toLowerCase().includes('gpt')) {
          toneIndex = 3;
        }
        
        if (toneIndex >= 0 && toneIndex < tones.length) {
          updatedValue = tones[toneIndex];
        } else {
          updatedValue = tones[0]; // Default to first tone
        }
      }
      
      const newState = {
        ...prev,
        [key]: updatedValue
      };
      
      console.log('Updated leadInfo:', newState);
      
      const thinkingFn = thinkingMessages[key] || thinkingMessages.default;
      const thinkingMsg = thinkingFn(updatedValue);
      
      console.log('Starting thinking with message:', thinkingMsg);
      setThinkingText('');
      setIsThinking(true);
      simulateThinkingTyping(thinkingMsg);
      
      if (key === 'tone') {
        // If this is the last step, call onNext with the complete info
        if (typeof onNext === 'function') {
          setTimeout(() => {
            onNext(newState);
          }, 3000);
        }
      } else {
        // Move to next step after thinking is complete
        setTimeout(() => {
          setStep(step + 1);
        }, 100);
      }
      
      return newState;
    });
  };
  
  // Speak the current prompt using text-to-speech
  const speakPrompt = async (text) => {
    if (!text) return;
    
    setIsSpeaking(true);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/text-to-speech`, {
        text: text,
        voice: "en-US-Neural2-F" // Default voice
      });
      
      if (response.data.audio_path) {
        const audioUrl = `${API_BASE_URL}${response.data.audio_path}?t=${Date.now()}`;
        audioRef.current.src = audioUrl;
        
        audioRef.current.onplay = () => {
          console.log('Audio started playing');
        };
        
        audioRef.current.onended = () => {
          console.log('Audio finished playing');
          setIsSpeaking(false);
          
          // Start listening for user response after prompt finishes
          if (currentQuestion && currentQuestion.type === 'speech') {
            setTimeout(() => {
              startListening();
            }, 500);
          }
        };
        
        audioRef.current.onerror = (err) => {
          console.error('Error playing audio:', err);
          setIsSpeaking(false);
        };
        
        audioRef.current.play().catch(err => {
          console.error('Error playing audio:', err);
          setIsSpeaking(false);
        });
      } else {
        console.error('No audio path in response');
        setIsSpeaking(false);
      }
    } catch (err) {
      console.error('Error in text-to-speech:', err);
      setIsSpeaking(false);
    }
  };
  
  const simulateThinkingTyping = (text) => {
    const typingDuration = Math.min(2000, text.length * 30);
    let progress = 0;
    const interval = 50;
    const steps = typingDuration / interval;
    let currentStep = 0;
    
    setThinkingProgress(0);
    setThinkingComplete(false);
    
    if (thinkingTimerRef.current) {
      clearInterval(thinkingTimerRef.current);
    }
    
    thinkingTimerRef.current = setInterval(() => {
      currentStep++;
      progress = currentStep / steps;
      
      setThinkingText(text.substring(0, Math.floor(text.length * progress)));
      setThinkingProgress(progress);
      
      if (progress >= 1) {
        clearInterval(thinkingTimerRef.current);
        
        // Ensure minimum thinking time
        const remainingTime = Math.max(0, THINKING_MIN_DURATION - typingDuration);
        
        setTimeout(() => {
          setThinkingComplete(true);
        }, remainingTime);
      }
    }, interval);
  };
  
  // Camera and face detection functionality
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
      goToNextStep();
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
      
      goToNextStep();
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
      
      questions[3].prompt = welcomeMsg;
      
      if (response.data.audio_path) {
        const audioUrl = `${API_BASE_URL}${response.data.audio_path}?t=${Date.now()}`;
        audioRef.current.src = audioUrl;
        audioRef.current.play().catch(err => console.error('Error playing audio:', err));
      }
      
      console.log('API processing complete. Starting thinking phase');
      goToNextStep();
      
    } catch (err) {
      console.error('Error processing image with API:', err);
      setApiError(`Error processing image: ${err.message}`);
      
      const defaultMsg = "Thanks for the photo! Great to meet you.";
      setLeadInfo(prev => ({
        ...prev,
        welcomeMessage: defaultMsg
      }));
      questions[3].prompt = defaultMsg;
      
      console.log('Error occurred, but still starting thinking phase');
      goToNextStep();
    } finally {
      setIsProcessingImage(false);
      setApiOperationComplete(true);
    }
  };
  
  const goToNextStep = () => {
    if (step + 1 < questions.length) {
      console.log(`Moving to step ${step + 1}`);
      
      if (currentQuestion) {
        const key = currentQuestion.key;
        const value = leadInfo[key];
        
        console.log(`Current step: ${key}, Value:`, value);
        
        let thinking;
        if (key === 'consentToPhoto' && leadInfo.consentToPhoto && photoTaken) {
          thinking = "Thanks for that great smile! Now I'll process your photo and create a personalized welcome message.";
        } else {
          const thinkingFn = thinkingMessages[key] || thinkingMessages.default;
          thinking = thinkingFn(value);
        }
        
        setThinkingText('');
        setIsThinking(true);
        simulateThinkingTyping(thinking);
      }
      
      setTimeout(() => {
        setStep(prev => prev + 1);
      }, 100);
    } else {
      console.log("Reached the end of questions");
      
      if (typeof onNext === 'function') {
        onNext(leadInfo);
      }
    }
  };
  
  const handleReset = () => {
    // Stop audio if playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    // Stop speech recognition
    stopListening();
    
    // Stop camera if active
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    // Clear intervals
    if (detectionRef.current) {
      clearInterval(detectionRef.current);
      detectionRef.current = null;
    }
    
    if (thinkingTimerRef.current) {
      clearInterval(thinkingTimerRef.current);
    }
    
    // Reset all state
    setLeadInfo({
      name: '',
      email: '',
      consentToPhoto: false,
      tone: '',
      welcomeMessage: ''
    });
    setStep(0);
    setTranscript('');
    setFinalTranscript('');
    setIsListening(false);
    setIsSpeaking(false);
    setIsThinking(false);
    setThinkingComplete(false);
    setThinkingProgress(0);
    setSmileDetected(false);
    setPhotoTaken(false);
    setPhotoData(null);
    setCameraError('');
    setApiError('');
    setApiOperationComplete(true);
  };
  
  // Effect to speak the current prompt when the step changes
  useEffect(() => {
    if (personalizedQuestion && !isThinking && !isSpeaking) {
      console.log('Speaking prompt:', personalizedQuestion.prompt);
      speakPrompt(personalizedQuestion.prompt);
    }
  }, [step, isThinking]);
  
  // Effect to start listening after thinking is complete
  useEffect(() => {
    if (thinkingComplete && apiOperationComplete && !isSpeaking) {
      console.log('Thinking complete, proceeding to next step');
      
      setIsThinking(false);
      setThinkingComplete(false);
      setThinkingProgress(0);
      
      if (currentQuestion && currentQuestion.type === 'speech') {
        speakPrompt(personalizedQuestion.prompt);
      }
    }
  }, [thinkingComplete, apiOperationComplete, isSpeaking]);
  
  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      stopListening();
      
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (detectionRef.current) {
        clearInterval(detectionRef.current);
      }
      
      if (thinkingTimerRef.current) {
        clearInterval(thinkingTimerRef.current);
      }
    };
  }, []);
  
  return (
    <div className="speech-based-flow">
      <div className="orb-column">
        <Orb
          hoverIntensity={0.5}
          rotateOnHover={true}
          hue={0}
          forceHoverState={isSpeaking || isThinking || isListening}
        />
      </div>

      <div className="content-column">
        <h1 className="byte-heading">Hi, I'm Byte. Let's have a conversation!</h1>
        
        {photoTaken && photoData && (
          <div className="captured-photo-container">
            <img 
              src={photoData}
              alt="Captured" 
              className="captured-photo-thumbnail"
            />
          </div>
        )}

        <div className="conversation-area">
          {isThinking ? (
            <div className="thinking-box">
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
          ) : (
            <>
              {personalizedQuestion && (
                <div className="byte-prompt">
                  <div className="byte-speaking-indicator">
                    {isSpeaking ? (
                      <div className="speaking-animation">
                        <div className="bar"></div>
                        <div className="bar"></div>
                        <div className="bar"></div>
                        <div className="bar"></div>
                        <div className="bar"></div>
                      </div>
                    ) : null}
                  </div>
                  <p>{personalizedQuestion.prompt}</p>
                </div>
              )}
              
              {isListening && (
                <div className="user-response">
                  <div className="listening-indicator">
                    <div className="listening-animation">
                      <div className="circle"></div>
                      <div className="circle"></div>
                      <div className="circle"></div>
                    </div>
                    <span>Listening...</span>
                  </div>
                  <p className="transcript">{transcript || finalTranscript}</p>
                </div>
              )}
              
              {!isListening && finalTranscript && (
                <div className="user-response">
                  <p className="transcript final">{finalTranscript}</p>
                </div>
              )}
              
              {personalizedQuestion && personalizedQuestion.key === 'consentToPhoto' && leadInfo.consentToPhoto && !photoTaken && (
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
        
        <audio ref={audioRef} />
        
        <div className="control-panel">
          {!isListening && !isSpeaking && !isThinking && (
            <button 
              className="listen-button" 
              onClick={startListening}
              disabled={isSpeaking || step >= questions.length}
            >
              <i className="mic-icon">🎤</i> Speak
            </button>
          )}
          
          {isListening && (
            <button 
              className="stop-button" 
              onClick={stopListening}
            >
              <i className="stop-icon">⏹️</i> Stop
            </button>
          )}
          
          <button 
            className="reset-button" 
            onClick={handleReset}
            title="Start over from the beginning"
          >
            <i className="reset-icon">↺</i> Restart
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpeechBasedFlow;