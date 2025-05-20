import React, { useState, useEffect, useRef } from 'react';
import './styles/DemoMicListener.css';
import { processAudio } from './api';

const DemoMicListener = ({ onTranscript, customerId = 'default', namespace = 'default' }) => {
  const [isListening, setIsListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef(null);
  const timeoutRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Initialize speech recognition
  useEffect(() => {
    // Check if browser supports the Web Speech API
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setErrorMessage('Speech recognition is not supported in your browser.');
      return;
    }

    // Use the appropriate constructor
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => {
      console.log('Speech recognition started');
      setIsListening(true);
      // Start recording audio for processing
      startAudioRecording();
    };

    recognitionRef.current.onend = () => {
      console.log('Speech recognition ended');
      setIsListening(false);
      // Stop recording audio
      stopAudioRecording();
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setErrorMessage(`Error: ${event.error}`);
      setIsListening(false);
      stopAudioRecording();
    };

    recognitionRef.current.onresult = (event) => {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Get the transcript from the latest result
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');

      // Determine if this is a final result
      const isFinal = event.results[event.results.length - 1].isFinal;

      // Pass the transcript to the parent component
      onTranscript(transcript, isFinal);

      // If the result is final, set a timeout to automatically stop listening after a pause
      if (isFinal) {
        timeoutRef.current = setTimeout(() => {
          stopListening();
        }, 2000); // Stop after 2 seconds of silence
      }
    };

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore errors when stopping
        }
      }
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      stopAudioRecording();
    };
  }, [onTranscript]);

  const startAudioRecording = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('Media recording is not supported in this browser');
      return;
    }

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        audioChunksRef.current = [];
        mediaRecorderRef.current = new MediaRecorder(stream);
        
        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };
        
        mediaRecorderRef.current.start();
      })
      .catch(error => {
        console.error('Error accessing microphone:', error);
        setErrorMessage('Could not access microphone. Please check permissions.');
      });
  };

  const stopAudioRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      
      mediaRecorderRef.current.onstop = async () => {
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          
          // Only process if we have meaningful audio data
          if (audioBlob.size > 1000) {
            try {
              setIsProcessing(true);
              const result = await processAudio(audioBlob);
              
              // If the API returns a more accurate transcript, use it
              if (result && result.transcript) {
                onTranscript(result.transcript, true);
              }
            } catch (error) {
              console.error('Error processing audio:', error);
              // Continue with the Web Speech API result if there's an error
            } finally {
              setIsProcessing(false);
            }
          }
        }
        
        // Clean up the stream tracks
        if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
          mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
      };
    }
  };

  const startListening = () => {
    setErrorMessage('');
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error('Error starting speech recognition:', e);
        // If already started, stop and restart
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
  };

  return (
    <div className="mic-listener">
      <button 
        className={`mic-button ${isListening ? 'mic-active' : ''} ${isProcessing ? 'mic-processing' : ''}`}
        onClick={isListening ? stopListening : startListening}
        disabled={isProcessing}
      >
        <div className="mic-icon">
          {isListening ? (
            // Animated microphone icon when active
            <div className="mic-pulse"></div>
          ) : isProcessing ? (
            // Processing indicator
            <div className="mic-processing-indicator"></div>
          ) : (
            // Static microphone icon when inactive
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
            </svg>
          )}
        </div>
        <span>
          {isListening ? 'Listening...' : 
           isProcessing ? 'Processing...' : 'Speak'}
        </span>
      </button>
      
      {errorMessage && (
        <div className="mic-error">{errorMessage}</div>
      )}
    </div>
  );
};

export default DemoMicListener;