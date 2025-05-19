// src/components/TranscriptionComponent.jsx
import { useState, useEffect } from 'react';

const TranscriptionComponent = ({ responseData }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // When responseData changes, update the component
    if (responseData) {
      setIsLoading(false);
    }
  }, [responseData]);
  
  return (
    <div className="transcription-container">
      <div className="transcription-header">
        <h2>Transcription</h2>
      </div>
      
      <div className="transcription-content">
        {isLoading ? (
          <p>Processing your query...</p>
        ) : responseData ? (
          <div>
            <p className="query-text">Your spoken query: {responseData.query}</p>
            <div className="final-answer">
              {responseData.final_answer}
            </div>
          </div>
        ) : (
          <p>Your spoken query will appear here</p>
        )}
      </div>
    </div>
  );
};

export default TranscriptionComponent;