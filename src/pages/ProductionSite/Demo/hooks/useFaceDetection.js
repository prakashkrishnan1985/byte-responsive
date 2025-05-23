// useFaceDetection.js

import { useState, useRef } from 'react';
import { createFaceDetectionInterval } from '../utils/cameraUtils';

export const useFaceDetection = ({ 
  videoRef, 
  capturePhoto, 
  onSmileDetected = () => {},
  smileThreshold = 0.7,
  detectionInterval = 500,
  detectionTimeout = 20000
}) => {
  const [smileDetected, setSmileDetected] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionError, setDetectionError] = useState('');
  
  const detectionCleanupRef = useRef(null);

  const startFaceDetection = () => {
    if (!videoRef.current) {
      console.error('Video reference not available for face detection');
      setDetectionError('Video element not available');
      return;
    }

    console.log('Starting face detection...');
    setIsDetecting(true);
    setDetectionError('');
    setSmileDetected(false);

    const handleSmileDetected = () => {
      console.log('Smile confirmed! Capturing photo...');
      setSmileDetected(true);
      setIsDetecting(false);
      onSmileDetected();
      
      if (capturePhoto) {
        capturePhoto();
      }
    };

    const handleDetectionError = (error) => {
      console.error('Face detection error:', error);
      setDetectionError(error.message);
      setIsDetecting(false);
    };

    detectionCleanupRef.current = createFaceDetectionInterval(
      videoRef.current,
      handleSmileDetected,
      handleDetectionError,
      detectionInterval,
      detectionTimeout
    );
  };

  const stopFaceDetection = () => {
    if (detectionCleanupRef.current) {
      console.log('Stopping face detection...');
      detectionCleanupRef.current();
      detectionCleanupRef.current = null;
    }
    setIsDetecting(false);
  };

  const resetDetection = () => {
    stopFaceDetection();
    setSmileDetected(false);
    setDetectionError('');
  };

  return {
    smileDetected,
    isDetecting,
    detectionError,
    startFaceDetection,
    stopFaceDetection,
    resetDetection
  };
};