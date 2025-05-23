import React from 'react';
import "../styles/ThinkingBox.css"

const ThinkingBox = ({
  thinkingText,
  thinkingProgress,
  isSpeechMode,
  isSpeaking
}) => {
  return (
    <div className={`thinking-box ${isSpeechMode && isSpeaking ? 'speaking' : ''}`}>
      <div className="thinking-header">This is what I'm thinking...</div>
      <div className="thinking-indicator">
        <span className="thinking-dot"></span>
        <span className="thinking-dot"></span>
        <span className="thinking-dot"></span>
      </div>
      <div className="thinking-text">{thinkingText}</div>
      <div className="thinking-progress-container">
        <div
          className="thinking-progress-bar"
          style={{ width: `${thinkingProgress * 100}%` }}
        />
      </div>
    </div>
  );
};

export default ThinkingBox;