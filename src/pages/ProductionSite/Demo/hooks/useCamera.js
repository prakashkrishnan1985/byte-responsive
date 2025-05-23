// useCamera.js

import { useState, useRef } from 'react';
import { 
  loadFaceDetectionModels, 
  initializeCamera, 
  setupVideoElement, 
  capturePhotoFromVideo,
  getBase64ImageData,
  stopCameraStream 
} from '../utils/cameraUtils';

export const useCamera = () => {
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [photoData, setPhotoData] = useState(null);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const initializeModelsAndCamera = async () => {
    try {
      console.log('Starting camera initialization...');
      setIsModelLoading(true);
      setCameraError('');

      await loadFaceDetectionModels();
      console.log('Face detection models loaded successfully');

      const stream = await initializeCamera();
      streamRef.current = stream;

      if (videoRef.current) {
        await setupVideoElement(videoRef.current, stream);
        console.log('Camera setup complete');
        setIsModelLoading(false);
        return true;
      } else {
        throw new Error('Video element not available');
      }
      
    } catch (error) {
      console.error('Error initializing camera:', error);
      setCameraError(error.message);
      setIsModelLoading(false);
      return false;
    }
  };

  const capturePhoto = () => {
    try {
      console.log('Capturing photo...');
      
      if (!videoRef.current || !canvasRef.current) {
        throw new Error('Video or canvas element not available');
      }

      const base64Image = capturePhotoFromVideo(videoRef.current, canvasRef.current);
      setPhotoData(base64Image);
      setPhotoTaken(true);

      stopCamera();

      return getBase64ImageData(base64Image);
      
    } catch (error) {
      console.error('Error capturing photo:', error);
      setCameraError(error.message);
      return null;
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      stopCameraStream(streamRef.current);
      streamRef.current = null;
    }
  };

  const resetCamera = () => {
    stopCamera();
    setPhotoData(null);
    setPhotoTaken(false);
    setCameraError('');
    setIsModelLoading(false);
    setIsProcessingImage(false);
  };

  const setProcessingState = (isProcessing) => {
    setIsProcessingImage(isProcessing);
  };

  return {
    isModelLoading,
    cameraError,
    photoData,
    photoTaken,
    isProcessingImage,
    videoRef,
    canvasRef,
    initializeCamera: initializeModelsAndCamera,
    capturePhoto,
    stopCamera,
    resetCamera,
    setProcessingState
  };
};