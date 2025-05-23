// cameraUtils.js

import * as faceapi from '@vladmandic/face-api';

const MODEL_URL = "/models";

export const loadFaceDetectionModels = async () => {
  try {
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
    console.log('Face detection models loaded successfully');
    return true;
  } catch (error) {
    console.error('Error loading face detection models:', error);
    throw new Error(`Could not load face detection models: ${error.message}`);
  }
};

export const initializeCamera = async () => {
  try {
    console.log('Requesting camera access...');
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user' },
      audio: false
    });
    console.log('Camera access granted');
    return stream;
  } catch (error) {
    console.error('Error initializing camera:', error);
    throw new Error(`Could not initialize camera: ${error.message}`);
  }
};

export const setupVideoElement = (videoElement, stream) => {
  return new Promise((resolve, reject) => {
    if (!videoElement) {
      reject(new Error('Video element not found'));
      return;
    }

    videoElement.srcObject = stream;

    videoElement.onloadedmetadata = () => {
      console.log('Video metadata loaded');
      videoElement.play()
        .then(() => {
          console.log('Video playback started');
          resolve();
        })
        .catch(error => {
          console.error('Error starting video playback:', error);
          reject(new Error(`Error starting video playback: ${error.message}`));
        });
    };
  });
};

export const detectFaceExpressions = async (videoElement) => {
  if (!videoElement || videoElement.readyState !== 4) {
    return null;
  }

  try {
    const options = new faceapi.TinyFaceDetectorOptions({ 
      inputSize: 224, 
      scoreThreshold: 0.5 
    });
    
    const detections = await faceapi
      .detectAllFaces(videoElement, options)
      .withFaceExpressions();

    return detections;
  } catch (error) {
    console.error('Error in face detection:', error);
    return null;
  }
};

export const isSmiling = (detections, threshold = 0.7) => {
  if (!detections || detections.length === 0) {
    return false;
  }

  const detection = detections[0];
  return detection.expressions.happy > threshold;
};

export const capturePhotoFromVideo = (videoElement, canvasElement) => {
  if (!videoElement || !canvasElement) {
    throw new Error('Video or canvas element not available');
  }

  canvasElement.width = videoElement.videoWidth || 640;
  canvasElement.height = videoElement.videoHeight || 480;

  try {
    const context = canvasElement.getContext('2d');
    context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
    
    const base64Image = canvasElement.toDataURL('image/jpeg');
    console.log('Photo captured successfully');
    return base64Image;
  } catch (error) {
    console.error('Error capturing photo:', error);
    throw new Error(`Error capturing photo: ${error.message}`);
  }
};

export const getBase64ImageData = (base64Image) => {
  if (!base64Image || !base64Image.includes(',')) {
    throw new Error('Invalid base64 image format');
  }
  return base64Image.split(',')[1];
};

export const stopCameraStream = (stream) => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
};

export const createFaceDetectionInterval = (
  videoElement, 
  onSmileDetected, 
  onError,
  intervalMs = 500,
  timeoutMs = 20000
) => {
  let smileDetected = false;
  
  const detectionInterval = setInterval(async () => {
    try {
      const detections = await detectFaceExpressions(videoElement);
      
      if (detections && isSmiling(detections)) {
        console.log('Smile confirmed!');
        smileDetected = true;
        clearInterval(detectionInterval);
        onSmileDetected();
      }
    } catch (error) {
      console.error('Error in face detection interval:', error);
      if (onError) onError(error);
    }
  }, intervalMs);

  const timeout = setTimeout(() => {
    if (!smileDetected) {
      console.log('Smile detection timeout reached');
      clearInterval(detectionInterval);
      if (onError) onError(new Error('Could not detect a smile. Moving on...'));
    }
  }, timeoutMs);

  return () => {
    clearInterval(detectionInterval);
    clearTimeout(timeout);
  };
};