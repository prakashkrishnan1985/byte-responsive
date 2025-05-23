import React from 'react';
import MicButton from './MicButton';
import "../styles/SpeechInput.css"

const SpeechInput = ({
  onTranscript,
  isListening,
  currentTranscript,
  onListeningStateChange,
  isAutoStart = false,
  placeholder = "Please speak...",
  customerId = "default",
  namespace = "default"
}) => {
  return (
    <div className="speech-input-container">
      <MicButton
        onTranscript={onTranscript}
        customerId={customerId}
        namespace={namespace}
        isAutoStart={isAutoStart}
        onListeningStateChange={onListeningStateChange}
      />
      
      <div className="transcript-display">
        {isListening ? (
          <p>Listening... {currentTranscript}</p>
        ) : (
          <p>{currentTranscript || placeholder}</p>
        )}
      </div>
    </div>
  );
};

export default SpeechInput;