import React, { useState, useEffect, useRef } from 'react';
import './styles/LeadCaptureScreen.css';
import Orb from './OrbBackground';
import Typewriter from 'typewriter-effect';
import axios from 'axios';
import * as faceapi from '@vladmandic/face-api';

// Constants
const MODEL_URL = "/models";
const API_BASE_URL = "https://model-api-dev.bytesized.com.au";

const questions = [
  { 
    key: 'inputMethod', 
    prompt: "Hello there! Before we begin, would you prefer to chat by talking or typing?", 
    type: 'choice', 
    options: ['Talk', 'Type'] 
  },
  { 
    key: 'name', 
    prompt: "Great! And just so I don't call you 'hey you' the whole time... what should I call you?", 
    type: 'text', 
    placeholder: 'Your name' 
  },
  { 
    key: 'email', 
    promptTemplate: "Thanks {name}! Mind sharing your email? Totally optional...just in case you'd like a follow-up later.",
    prompt: "Mind sharing your email? Totally optional...just in case you'd like a follow-up later.",
    type: 'email', 
    placeholder: 'you@example.com' 
  },
  { 
    key: 'consentToPhoto', 
    promptTemplate: "Quick one, {name}: if you smile, can I snap a picture? Only if you're cool with it.", 
    prompt: "Quick one: if you smile, can I snap a picture? Only if you're cool with it.",
    type: 'checkbox'
  },
  {
    key: 'welcomeMessage',
    prompt: "", // Will be dynamically set from API response
    type: 'message'
  },
  { 
    key: 'tone', 
    promptTemplate: "Lastly, {name}, how should I sound? Pick a tone that matches your vibe.", 
    prompt: "Lastly, how should I sound? Pick a tone that matches your vibe.",
    type: 'tone' 
  }
];

const tones = [
  'Joker (Dark Knight)',
  'David Attenborough',
  'Corporate Assistant',
  'GPT Mode',
];

const LeadCaptureScreen = ({ onNext }) => {
  // =========== STATE =============
  // Form state
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
  
  // Camera state
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [smileDetected, setSmileDetected] = useState(false);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [photoData, setPhotoData] = useState(null);
  
  // API state
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [apiError, setApiError] = useState('');
  
  // =========== REFS =============
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const detectionRef = useRef(null);
  const audioRef = useRef(new Audio());
  
  // =========== DERIVED STATE =============
  // Get current question
  const currentQuestion = step < questions.length ? questions[step] : null;
  
  // Get personalized question
  const personalizedQuestion = React.useMemo(() => {
    if (!currentQuestion) return null;
    
    // If this question has a template and we have the user's name, personalize it
    if (currentQuestion.promptTemplate && leadInfo.name) {
      return {
        ...currentQuestion,
        prompt: currentQuestion.promptTemplate.replace('{name}', leadInfo.name)
      };
    }
    
    // Otherwise return the original question
    return currentQuestion;
  }, [currentQuestion, leadInfo.name]);
  
  // Create a key for the Typewriter to ensure it re-renders
  const typewriterKey = `typewriter-${step}`;
  
  // =========== HANDLERS =============
  // Navigate to next step
  const goToNextStep = () => {
    if (step + 1 < questions.length) {
      console.log(`Moving to step ${step + 1}`);
      setStep(step + 1);
      setIsTyping(true);
    } else {
      console.log("Reached the end of questions");
    }
  };
  
  // Handle text/email input submission
  const handleInputSubmit = () => {
    if (!personalizedQuestion) return;
    
    const key = personalizedQuestion.key;
    const value = key === 'email' ? inputValue.trim() : inputValue;
    
    setLeadInfo(prev => ({
      ...prev,
      [key]: value
    }));
    
    setInputValue('');
    goToNextStep();
  };
  
  // Handle checkbox change
  const handleCheckboxChange = async (e) => {
    if (!personalizedQuestion) return;
    
    const key = personalizedQuestion.key;
    const checked = e.target.checked;
    
    console.log(`Checkbox changed for ${key}. New value: ${checked}`);
    
    setLeadInfo(prev => ({
      ...prev,
      [key]: checked
    }));
    
    // Handle photo consent checkbox
    if (key === 'consentToPhoto') {
      if (checked) {
        console.log('User consented to photo. Initializing camera...');
        initializeCamera();
      } else {
        console.log('User did not consent to photo. Moving to next step...');
        goToNextStep();
      }
    } else {
      goToNextStep();
    }
  };
  
  // Handle option selection for first question
  const handleChoiceSelect = (value) => {
    if (!personalizedQuestion) return;
    
    const key = personalizedQuestion.key;
    setLeadInfo(prev => ({
      ...prev,
      [key]: value
    }));
    
    goToNextStep();
  };
  
  // Handle tone selection (final step)
  const handleToneSelect = (tone) => {
    const updatedInfo = {
      ...leadInfo,
      tone
    };
    
    setLeadInfo(updatedInfo);
    
    // Check if onNext exists before calling it
    if (typeof onNext === 'function') {
      console.log('Calling onNext with leadInfo:', updatedInfo);
      onNext(updatedInfo);
    } else {
      console.log('onNext is not a function, cannot proceed. Final data:', updatedInfo);
      // Just go to next step if there is one
      goToNextStep();
    }
  };
  
  // Handle reset/start over
  const handleReset = () => {
    // Clean up camera if active
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (detectionRef.current) {
      clearInterval(detectionRef.current);
      detectionRef.current = null;
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
    setSmileDetected(false);
    setPhotoTaken(false);
    setPhotoData(null);
    setCameraError('');
    setApiError('');
  };
  
  // =========== CAMERA FUNCTIONS =============
  // Initialize camera
  const initializeCamera = async () => {
    try {
      console.log('Starting camera initialization...');
      setIsModelLoading(true);
      
      // Load face detection models
      console.log('Loading face detection models...');
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        console.log('Face detection models loaded successfully');
      } catch (modelErr) {
        console.error('Error loading face detection models:', modelErr);
        setCameraError(`Could not load face detection models: ${modelErr.message}`);
      }
      
      // Request camera access
      console.log('Requesting camera access...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      });
      
      console.log('Camera access granted');
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded');
          videoRef.current.play()
            .then(() => {
              console.log('Video playback started');
              setIsModelLoading(false);
              
              // Start face detection
              startFaceDetection();
            })
            .catch(playErr => {
              console.error('Error starting video playback:', playErr);
              setCameraError(`Error starting video playback: ${playErr.message}`);
              setIsModelLoading(false);
            });
        };
      } else {
        console.error('Video ref is not available');
        setCameraError('Video element not found');
        setIsModelLoading(false);
      }
    } catch (err) {
      console.error('Error initializing camera:', err);
      setCameraError(`Could not initialize camera: ${err.message}`);
      setIsModelLoading(false);
      
      // If camera fails, proceed to next step after delay
      setTimeout(() => goToNextStep(), 3000);
    }
  };
  
  // Start face detection to detect smile
  const startFaceDetection = () => {
    console.log('Starting face detection...');
    if (!videoRef.current) {
      console.error('Video reference not available for face detection');
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
  };
  
  // Capture photo when smile is detected
  const capturePhoto = () => {
    console.log('Capturing photo...');
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas size to match video
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    
    try {
      // Draw the video frame on the canvas
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      console.log('Photo captured successfully');
      
      // Get the base64 image data
      const base64Image = canvas.toDataURL('image/jpeg');
      
      // Store the image data
      setPhotoData(base64Image);
      
      // Update state to show photo was taken
      setPhotoTaken(true);
      
      // Stop the camera stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      // Process the image with the API (on next render)
      setTimeout(() => {
        const base64DataPart = base64Image.split(',')[1];
        console.log('Processing image with API...');
        processImageWithAPI(base64DataPart);
      }, 500);
      
    } catch (err) {
      console.error('Error capturing photo:', err);
      setCameraError(`Error capturing photo: ${err.message}`);
      
      // If photo capture fails, proceed to next step after delay
      setTimeout(() => goToNextStep(), 2000);
    }
  };
  
  // =========== API FUNCTIONS =============
  // Process image with API
  const processImageWithAPI = async (base64Image) => {
    console.log('Processing image with API...');
    setIsProcessingImage(true);
    setApiError('');
    
    try {
      // Make the API request
      console.log('Sending API request...');
      const response = await axios.post(`${API_BASE_URL}/process-image-base64`, {
        model: "gpt-4o",
        prompt: `You're shown an image of a visitor's outfit — including visible clothing, accessories, and possibly their posture or expression. Create a friendly, welcoming message that mentions safe visual details like color, style, or accessories. Avoid referring to faces or personal characteristics. Keep the tone warm and professional.`,
        base64_image: base64Image
      });
      
      console.log('API response received:', response.data);
      
      // Extract welcome message
      const welcomeMsg = response.data.message?.content || "Welcome! Nice to meet you.";
      
      // Update state with welcome message
      setLeadInfo(prev => ({
        ...prev,
        welcomeMessage: welcomeMsg
      }));
      
      // Update the dynamic question
      questions[4].prompt = welcomeMsg;
      
      // Play audio if available
      if (response.data.audio_path) {
        const audioUrl = `${API_BASE_URL}${response.data.audio_path}?t=${Date.now()}`;
        audioRef.current.src = audioUrl;
        audioRef.current.play().catch(err => console.error('Error playing audio:', err));
      }
      
      // Move to welcome message step
      console.log('Moving to welcome message step');
      goToNextStep();
      
    } catch (err) {
      console.error('Error processing image with API:', err);
      setApiError(`Error processing image: ${err.message}`);
      
      // Set a default welcome message
      const defaultMsg = "Thanks for the photo! Great to meet you.";
      setLeadInfo(prev => ({
        ...prev,
        welcomeMessage: defaultMsg
      }));
      questions[4].prompt = defaultMsg;
      
      // Still proceed to next step
      console.log('Error occurred, but still moving to next step');
      goToNextStep();
    } finally {
      setIsProcessingImage(false);
    }
  };
  
  // =========== EFFECTS =============
  // Clean up resources on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (detectionRef.current) {
        clearInterval(detectionRef.current);
      }
    };
  }, []);
  
  // =========== RENDER =============
  return (
    <div className="lead-capture-layout">
      <div className="orb-column">
        <Orb
          hoverIntensity={0.5}
          rotateOnHover={true}
          hue={0}
          forceHoverState={isTyping}
        />
      </div>

      <div className="text-column">
        <h1 className="byte-heading">Hi, I'm Byte. Let's play a quick game!</h1>
        
        {/* Display photo thumbnail at the top if available */}
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
          {/* Question text with typewriter effect */}
          {personalizedQuestion && (
            <div className="byte-question">
              <Typewriter
                key={typewriterKey}
                options={{
                  delay: 30,
                  cursor: '|',
                  deleteSpeed: 0,
                }}
                onInit={(typewriter) => {
                  setIsTyping(true);
                  typewriter
                    .typeString(personalizedQuestion.prompt)
                    .callFunction(() => {
                      setIsTyping(false);
                    })
                    .start();
                }}
              />
            </div>
          )}

          {personalizedQuestion && (
            <>
              {/* Multiple choice options */}
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

              {/* Controls that appear after typing is complete */}
              {!isTyping && (
                <>
                  {/* Text & email inputs */}
                  {(personalizedQuestion.type === 'text' || personalizedQuestion.type === 'email') && (
                    <>
                      <input
                        type={personalizedQuestion.type}
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

                  {/* Checkbox for consent */}
                  {personalizedQuestion.type === 'checkbox' && (
                    <>
                      <label className="consent-checkbox">
                        <input
                          type="checkbox"
                          checked={leadInfo[personalizedQuestion.key]}
                          onChange={handleCheckboxChange}
                        />
                        I consent
                      </label>
                    </>
                  )}

                  {/* Tone selection */}
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
                  
                  {/* Message-only screen with Next button */}
                  {personalizedQuestion.type === 'message' && (
                    <button 
                      className="next-button" 
                      onClick={goToNextStep}
                    >
                      Next →
                    </button>
                  )}
                </>
              )}
              
              {/* Camera view - only show when consent is given AND photo not yet taken */}
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
                    style={{
                      width: '100%',
                      height: '300px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      display: 'block',
                      background: '#000'
                    }}
                  />
                  {cameraError && (
                    <div className="camera-error">
                      {cameraError}
                    </div>
                  )}
                </div>
              )}
              
              {/* Canvas for photo capture - hidden from view */}
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              
              {/* Processing indicator */}
              {isProcessingImage && (
                <div className="processing-indicator">
                  <div className="spinner"></div>
                  <div>Analyzing your photo...</div>
                </div>
              )}
              
              {/* API error */}
              {apiError && (
                <div className="api-error">
                  {apiError}
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Audio element for playing welcome message */}
        <audio ref={audioRef} style={{ display: 'none' }}></audio>
        
        {/* Start Over button */}
        <div className="start-over-container">
          <button 
            className="start-over-button" 
            onClick={handleReset}
            title="Start over from the beginning"
          >
            ↺ Start Over
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadCaptureScreen;