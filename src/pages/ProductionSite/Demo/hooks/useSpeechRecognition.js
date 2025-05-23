// useSpeechRecognition.js

import { useState, useEffect, useRef } from 'react';

export const useSpeechRecognition = ({ 
  onTranscript, 
  isAutoStart = false,
  onListeningStateChange = () => {},
  language = 'en-US'
}) => {
  const [isListening, setIsListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  
  const recognitionRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setErrorMessage('Speech recognition is not supported in your browser.');
      setIsSupported(false);
      return;
    }

    setIsSupported(true);
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = language;

    recognitionRef.current.onstart = () => {
      console.log('Speech recognition started');
      setIsListening(true);
      setErrorMessage('');
    };

    recognitionRef.current.onend = () => {
      console.log('Speech recognition ended');
      setIsListening(false);
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setErrorMessage(`Error: ${event.error}`);
      setIsListening(false);
    };

    recognitionRef.current.onresult = (event) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');

      const isFinal = event.results[event.results.length - 1].isFinal;

      if (onTranscript) {
        onTranscript(transcript, isFinal);
      }

      if (isFinal) {
        timeoutRef.current = setTimeout(() => {
          stopListening();
        }, 2000);
      }
    };

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.error('Error stopping recognition on cleanup:', e);
        }
      }
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [language, onTranscript]);

  useEffect(() => {
    onListeningStateChange(isListening);
  }, [isListening, onListeningStateChange]);

  useEffect(() => {
    if (isAutoStart && !isListening && recognitionRef.current && isSupported) {
      startListening();
    }
  }, [isAutoStart, isListening, isSupported]);

  const startListening = () => {
    if (!isSupported) {
      setErrorMessage('Speech recognition is not supported in your browser.');
      return;
    }

    setErrorMessage('');
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error('Error starting speech recognition:', e);
        if (e.name === 'NotAllowedError') {
          setErrorMessage('Microphone access denied. Please allow microphone access.');
        } else {
          try {
            recognitionRef.current.stop();
            setTimeout(() => {
              recognitionRef.current.start();
            }, 200);
          } catch (stopError) {
            setErrorMessage('Failed to start speech recognition. Please try again.');
          }
        }
      }
    } else {
      setErrorMessage('Speech recognition is not initialized.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error('Error stopping speech recognition:', e);
      }
    }
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const resetError = () => {
    setErrorMessage('');
  };

  return {
    isListening,
    errorMessage,
    isSupported,
    startListening,
    stopListening,
    resetError
  };
};