// import { useState, useRef, useEffect } from 'react';
// import axios from 'axios';
// import * as faceapi from '@vladmandic/face-api';
// import '../App.css';

// const AutoFaceCapture = () => {
//   const [isInitializing, setIsInitializing] = useState(true);
//   const [isModelLoading, setIsModelLoading] = useState(true);
//   const [processing, setProcessing] = useState(false);
//   const [welcomeMessage, setWelcomeMessage] = useState('');
//   const [error, setError] = useState('');
//   const [smileDetected, setSmileDetected] = useState(false);
  
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const streamRef = useRef(null);
//   const detectionRef = useRef(null);

//   const loadModels = async () => {
//     try {
//       setIsModelLoading(true);
      
//       const MODEL_URL = '/models';
      
//       console.log('Loading face detection models from:', MODEL_URL);
      
//       console.log('Loading TinyFaceDetector model...');
//       await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
//       console.log('TinyFaceDetector model loaded successfully');
      
//       console.log('Loading FaceExpressionNet model...');
//       await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
//       console.log('FaceExpressionNet model loaded successfully');
      
//       console.log('All face detection models loaded successfully');
//       setIsModelLoading(false);
//     } catch (err) {
//       console.error('Error loading face detection models:', err);
//       setError(`Could not load face detection models: ${err.message}`);
//       setIsModelLoading(false);
//     }
//   };

//   // Initialize webcam
//   const startCamera = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: {
//           width: { ideal: 640 },
//           height: { ideal: 480 },
//           facingMode: 'user'
//         },
//         audio: false
//       });
      
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//         streamRef.current = stream;
//       }
      
//       setError('');
//       setIsInitializing(false);
//     } catch (err) {
//       console.error('Error accessing camera:', err);
//       setError('Could not access camera. Please ensure camera permissions are granted.');
//       setIsInitializing(false);
//     }
//   };

//   // Start face detection process
//   const startFaceDetection = () => {
//     if (!videoRef.current || isModelLoading) return;
    
//     console.log('Starting face detection...');
    
//     detectionRef.current = setInterval(async () => {
//       if (!videoRef.current || videoRef.current.readyState !== 4) return;
      
//       try {
//         // First try to detect faces
//         const options = new faceapi.TinyFaceDetectorOptions({ 
//           inputSize: 224,  // Try a different input size
//           scoreThreshold: 0.5
//         });
        
//         const detections = await faceapi.detectAllFaces(
//           videoRef.current, 
//           options
//         );
        
//         // If faces were detected, try to get expressions
//         if (detections && detections.length > 0) {
//           console.log('Face detected!');
          
//           // Try to get expressions in a separate step
//           const withExpressions = await faceapi.detectAllFaces(
//             videoRef.current, 
//             options
//           ).withFaceExpressions();
          
//           if (withExpressions && withExpressions.length > 0) {
//             const detection = withExpressions[0]; // Use the first face
//             console.log('Expressions detected:', detection.expressions);
            
//             // Check for smile (happy expression with high confidence)
//             const isSmiling = detection.expressions.happy > 0.7; // Adjust threshold as needed
            
//             if (isSmiling && !smileDetected) {
//               console.log('Smile detected!');
//               setSmileDetected(true);
//               // Capture image when smile is detected
//               captureAndProcess();
//               // Clear detection interval after capturing
//               if (detectionRef.current) {
//                 clearInterval(detectionRef.current);
//                 detectionRef.current = null;
//               }
//             }
//           } else {
//             console.log('Face detected but could not get expressions');
//           }
//         }
//       } catch (err) {
//         console.error('Error in face detection:', err);
//         // Don't stop the interval on error, just log it and continue
//       }
//     }, 500); // Reduced from 100ms to 500ms to decrease CPU load
//   };

//   // Process image with base64
//   const captureAndProcess = async () => {
//     if (!videoRef.current || !canvasRef.current) return;
    
//     const video = videoRef.current;
//     const canvas = canvasRef.current;
    
//     // Set canvas dimensions to match video
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;AutCapP
    
//     // Draw video frame to canvas
//     const context = canvas.getContext('2d');
//     context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
//     // Get base64 image data
//     const base64Image = canvas.toDataURL('image/jpeg').split(',')[1];
    
//     // Process image with API
//     await processImageBase64(base64Image);
//   };

//   // Call the API with base64 image
//   const processImageBase64 = async (base64Image) => {
//     setProcessing(true);
//     setError('');
    
//     try {
//       const response = await axios.post('http://localhost:8000/process-image-base64', {
//         model: "llava:7b-v1.6-mistral-q4_1",
//         prompt: "Please give a friendly welcome message to the person in this image. Mention something about what they are wearing or their appearance, so that they know you can see them.",
//         base64_image: base64Image
//       });
      
//       // Extract message from Ollama response
//       const welcomeMsg = response.data.message?.content || "Welcome!";
//       setWelcomeMessage(welcomeMsg);
//     } catch (err) {
//       console.error('Error processing image with base64:', err);
//       setError(`Error processing image: ${err.message}`);
//     } finally {
//       setProcessing(false);
//     }
//   };

//   // Clean up on component unmount
//   const cleanup = () => {
//     if (streamRef.current) {
//       const tracks = streamRef.current.getTracks();
//       tracks.forEach(track => track.stop());
//     }
    
//     if (detectionRef.current) {
//       clearInterval(detectionRef.current);
//       detectionRef.current = null;
//     }
//   };

//   // Initialize on component mount
//   useEffect(() => {
//     // Load face detection models
//     loadModels();
    
//     // Start camera
//     startCamera();
    
//     // Cleanup on unmount
//     return cleanup;
//   }, []);

//   // Start face detection once video and models are ready
//   useEffect(() => {
//     if (!isInitializing && !isModelLoading && videoRef.current && !detectionRef.current) {
//       startFaceDetection();
//     }
//   }, [isInitializing, isModelLoading]);

//   return (
//     <div className="container">
//       <h1 className="heading">AI Face Recognition</h1>
      
//       <div className="card">
//         <div className="section-title">Live Camera</div>
        
//         <div style={{ position: 'relative', width: '100%', marginBottom: '1rem' }}>
//           <video 
//             ref={videoRef}
//             autoPlay
//             playsInline
//             style={{ width: '100%', borderRadius: '8px' }}
//           />
//           <canvas 
//             ref={canvasRef} 
//             style={{ display: 'none' }}
//           />
//         </div>
        
//         <div className="status-text">
//           {isInitializing ? 'Initializing camera...' : 
//             isModelLoading ? 'Loading facial recognition models...' :
//             processing ? 'Processing image...' :
//             smileDetected ? 'Smile detected! Processing image...' :
//             'Waiting for smile... Please smile at the camera!'}
//         </div>
        
//         {error && (
//           <div style={{ color: 'red', marginTop: '1rem', padding: '1rem', backgroundColor: '#fff0f0', borderRadius: '8px' }}>
//             <div><strong>Error:</strong></div>
//             <div>{error}</div>
//             <div style={{ marginTop: '0.5rem' }}>
//               <button onClick={() => window.location.reload()}>
//                 Reload Page
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
      
//       {welcomeMessage && (
//         <div className="card">
//           <div className="section-title">AI Welcome Message</div>
//           <div className="transcription-box">
//             {welcomeMessage}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AutoFaceCapture;