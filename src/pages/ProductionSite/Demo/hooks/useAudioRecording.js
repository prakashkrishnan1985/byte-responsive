// useAudioRecording.js

import { useState, useRef } from 'react';
import { processAudio } from '../utils/apiUtils';

export const useAudioRecording = ({
  customerId = 'default',
  namespace = 'default',
  onTranscript = () => {},
  minBlobSize = 1000
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  const startRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const errorMsg = 'Media recording is not supported in this browser';
      console.error(errorMsg);
      setError(errorMsg);
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      audioChunksRef.current = [];
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = async () => {
        await processRecording();
      };

      mediaRecorderRef.current.onerror = (event) => {
        console.error('MediaRecorder error:', event.error);
        setError(`Recording error: ${event.error}`);
        setIsRecording(false);
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setError('');
      return true;
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setError('Could not access microphone. Please check permissions.');
      return false;
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const processRecording = async () => {
    if (audioChunksRef.current.length === 0) {
      console.log('No audio chunks to process');
      return;
    }

    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    
    if (audioBlob.size < minBlobSize) {
      console.log('Audio blob too small, skipping processing');
      return;
    }

    try {
      setIsProcessing(true);
      const result = await processAudio(audioBlob);
      
      if (result && result.transcript) {
        onTranscript(result.transcript, true);
      }
    } catch (error) {
      console.error('Error processing audio:', error);
      setError(`Error processing audio: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetError = () => {
    setError('');
  };

  const cleanup = () => {
    stopRecording();
    audioChunksRef.current = [];
  };

  return {
    isRecording,
    isProcessing,
    error,
    startRecording,
    stopRecording,
    resetError,
    cleanup
  };
};