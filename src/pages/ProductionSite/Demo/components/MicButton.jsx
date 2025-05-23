import React from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useAudioRecording } from '../hooks/useAudioRecording';
import "../styles/MicButton.css"

const MicButton = ({
  onTranscript,
  customerId = 'default',
  namespace = 'default',
  isAutoStart = false,
  onListeningStateChange = () => {}
}) => {
  const {
    isListening,
    errorMessage,
    startListening,
    stopListening
  } = useSpeechRecognition({
    onTranscript,
    isAutoStart,
    onListeningStateChange
  });

  const {
    isProcessing
  } = useAudioRecording({
    customerId,
    namespace,
    onTranscript
  });

  const handleClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const getButtonText = () => {
    if (isListening) return 'Listening...';
    if (isProcessing) return 'Processing...';
    return 'Speak';
  };

  const getMicIcon = () => {
    if (isListening) {
      return <div className="mic-pulse"></div>;
    }
    
    if (isProcessing) {
      return <div className="mic-processing-indicator"></div>;
    }
    
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
        <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
      </svg>
    );
  };

  return (
    <div className="mic-listener">
      <button 
        className={`mic-button ${isListening ? 'mic-active' : ''} ${isProcessing ? 'mic-processing' : ''}`}
        onClick={handleClick}
        disabled={isProcessing}
      >
        <div className="mic-icon">
          {getMicIcon()}
        </div>
        <span>
          {getButtonText()}
        </span>
      </button>
      
      {errorMessage && (
        <div className="mic-error">{errorMessage}</div>
      )}
    </div>
  );
};

export default MicButton;