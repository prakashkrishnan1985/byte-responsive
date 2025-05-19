import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import * as faceapi from '@vladmandic/face-api';
import './App.css';
import MicListener from './MicListener';
import ChatWindow from './ChatWindow';
import { sendQuery } from './api';

// ==== CONFIGURABLE URLS ====
// const API_BASE_URL = "http://localhost:8000";
const API_BASE_URL = "https://model-api-dev.bytesized.com.au"
const MODEL_URL = "/models";
// ============================

const AutoFaceCapture = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [error, setError] = useState('');
  const [smileDetected, setSmileDetected] = useState(false);

  const [conversationStarted, setConversationStarted] = useState(false);
  const [customerId, setCustomerId] = useState("acme_ltd");
  const [namespace, setNamespace] = useState("ProductReviews");
  const [voice, setVoice] = useState("Default Voice");
  const [messages, setMessages] = useState([]);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [finalAnswer, setFinalAnswer] = useState("");
  const [typingMessage, setTypingMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const detectionRef = useRef(null);
  const welcomeMessageRef = useRef(null);
  const conversationRef = useRef(null);
  const loadingIntervalRef = useRef(null);

  const quirkyMessages = [
    "Consulting the wisdom of GPUs...",
    "Drinking a shot of JSON...",
    "Waking up the LLM...",
    "Googling the answer harder...",
    "Thinking in tokens and tensors...",
    "Taming a wild dataset...",
    "Extracting insights with lasers...",
    "Polishing the final answer...",
    "Feeding thoughts to a robot..."
  ];

  const loadModels = async () => {
    try {
      setIsModelLoading(true);
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
      setIsModelLoading(false);
    } catch (err) {
      console.error('Error loading face detection models:', err);
      setError(`Could not load face detection models: ${err.message}`);
      setIsModelLoading(false);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }

      setError('');
      setIsInitializing(false);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Could not access camera. Please ensure camera permissions are granted.');
      setIsInitializing(false);
    }
  };

  const startFaceDetection = () => {
    if (!videoRef.current || isModelLoading) return;

    detectionRef.current = setInterval(async () => {
      if (!videoRef.current || videoRef.current.readyState !== 4) return;

      try {
        const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 });
        const detections = await faceapi.detectAllFaces(videoRef.current, options);

        if (detections && detections.length > 0) {
          const withExpressions = await faceapi.detectAllFaces(videoRef.current, options).withFaceExpressions();
          if (withExpressions && withExpressions.length > 0) {
            const detection = withExpressions[0];
            const isSmiling = detection.expressions.happy > 0.7;

            if (isSmiling && !smileDetected) {
              setSmileDetected(true);
              captureAndProcess();
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

  const captureAndProcess = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const base64Image = canvas.toDataURL('image/jpeg').split(',')[1];
    await processImageBase64(base64Image);
  };

  const processImageBase64 = async (base64Image) => {
    setProcessing(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/process-image-base64`, {
        model: "gpt-4o",
        prompt: `You're shown an image of a visitor’s outfit — including visible clothing, accessories, and possibly their posture or expression. Create a friendly, welcoming message that mentions safe visual details like color, style, or accessories. Avoid referring to faces or personal characteristics. Keep the tone warm and professional.`,
        base64_image: base64Image
      });

      const welcomeMsg = response.data.message?.content || "Welcome!";
      setWelcomeMessage(welcomeMsg);
      setMessages([{ role: "assistant", content: welcomeMsg, audioPath: response.data.audio_path }]);

      if (response.data.audio_path) {
        const audioUrl = `${API_BASE_URL}${response.data.audio_path}?t=${Date.now()}`;
        new Audio(audioUrl).play();
      }

      setConversationStarted(true);
      setTimeout(() => {
        welcomeMessageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 500);
    } catch (err) {
      console.error('Error processing image with base64:', err);
      setError(`Error processing image: ${err.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const startLoadingMessages = () => {
    let i = 0;
    setLoadingMessage(quirkyMessages[0]);
    loadingIntervalRef.current = setInterval(() => {
      i = (i + 1) % quirkyMessages.length;
      setLoadingMessage(quirkyMessages[i]);
    }, 2000);
  };

  const stopLoadingMessages = () => {
    clearInterval(loadingIntervalRef.current);
    loadingIntervalRef.current = null;
    setLoadingMessage("");
  };

  const handleTranscript = async (text, isFinal = false) => {
    if (!text) return;
    setCurrentTranscript(text);

    if (isFinal) {
      const newMessages = [...messages, { role: "user", content: text }];
      setMessages(newMessages);
      setIsLoading(true);
      startLoadingMessages();

      try {
        const response = await sendQuery(text, customerId, namespace);
        const fullText = response.final_answer;
        setFinalAnswer(fullText);

        if (response.audio_path) {
          const audioUrl = `${API_BASE_URL}${response.audio_path}?t=${Date.now()}`;
          new Audio(audioUrl).play();
        }

        let current = '';
        let index = 0;
        const typingInterval = setInterval(() => {
          if (index < fullText.length) {
            current += fullText[index];
            setTypingMessage(current);
            index++;
          } else {
            clearInterval(typingInterval);
            setMessages([...newMessages, { role: "assistant", content: fullText, audioPath: response.audio_path }]);
            setTypingMessage('');
            setIsLoading(false);
            stopLoadingMessages();
            setTimeout(() => {
              conversationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
          }
        }, 30);

        setCurrentTranscript('');
      } catch (err) {
        console.error("Error in sendQuery:", err);
        setIsLoading(false);
        stopLoadingMessages();
      }
    }
  };

  const cleanup = () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    if (detectionRef.current) clearInterval(detectionRef.current);
    if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current);
  };

  useEffect(() => {
    loadModels();
    startCamera();
    return cleanup;
  }, []);

  useEffect(() => {
    if (!isInitializing && !isModelLoading && videoRef.current && !detectionRef.current) {
      startFaceDetection();
    }
  }, [isInitializing, isModelLoading]);

  return (
    <div className="container">
      <h1 className="heading">AI Face Recognition</h1>
      <div className="card">
        <div className="section-title">Live Camera</div>
        {!conversationStarted && (
          <div style={{ position: 'relative', width: '100%', marginBottom: '1rem' }}>
            <video ref={videoRef} autoPlay playsInline style={{ width: '100%', borderRadius: '8px' }} />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>
        )}
        <div className="status-text">
          {isInitializing ? 'Initializing camera...' :
            isModelLoading ? 'Loading facial recognition models...' :
              processing ? 'Processing image...' :
                smileDetected && !welcomeMessage ? 'Smile detected! Processing image...' :
                  conversationStarted ? 'Conversation started' :
                    'Waiting for smile... Please smile at the camera!'}
        </div>
        {error && (
          <div style={{ color: 'red', marginTop: '1rem', padding: '1rem', backgroundColor: '#fff0f0', borderRadius: '8px' }}>
            <div><strong>Error:</strong></div>
            <div>{error}</div>
            <button onClick={() => window.location.reload()}>Reload Page</button>
          </div>
        )}
      </div>
      {welcomeMessage && (
        <div className="card" ref={welcomeMessageRef}>
          <div className="section-title">AI Welcome Message</div>
          <div className="transcription-box">
            {welcomeMessage}
            {messages[0]?.audioPath && (
              <div className="mt-2">
                <button
                  onClick={() => new Audio(`${API_BASE_URL}${messages[0].audioPath}?t=${Date.now()}`).play()}
                  className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-md flex items-center"
                >
                  <span className="mr-1">🔊</span> Play welcome message again
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {conversationStarted && (
        <>
          <div className="card" ref={conversationRef}>
            <h2 className="section-title">Voice Query</h2>
            <div className="form-group">
              <label>Use Case Details</label>
              <input type="text" value={customerId} onChange={e => setCustomerId(e.target.value)} className="input-field" />
            </div>
            <div className="form-group">
              <label>Use Case:</label>
              <select value={voice} onChange={e => setNamespace(e.target.value)} className="input-field">
                <option>Default Voice</option>
                <option>Voice A</option>
                <option>Voice B</option>
              </select>
            </div>
            <MicListener onTranscript={handleTranscript} />
            <p className="status-text">{currentTranscript ? `Listening... ${currentTranscript}` : "Ready to record"}</p>
            {isLoading && loadingMessage && (
              <div className="mt-4 flex items-center space-x-3 text-blue-600 animate-pulse">
                <span className="inline-block w-4 h-4 border-2 border-t-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></span>
                <span>{loadingMessage}</span>
              </div>
            )}
          </div>
          <div className="card">
            <h2 className="section-title">Transcription</h2>
            <div className="transcription-box whitespace-pre-wrap">
              {finalAnswer || currentTranscript || "Your spoken query will appear here"}
            </div>
          </div>
          <ChatWindow messages={messages} typingMessage={typingMessage} isLoading={isLoading} />
        </>
      )}
    </div>
  );
};

export default AutoFaceCapture;
