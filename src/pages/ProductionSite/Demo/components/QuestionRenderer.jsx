import React from 'react';
import Typewriter from 'typewriter-effect';
import SpeechInput from './SpeechInput';
import "../styles/QuestionRenderer.css"

const QuestionRenderer = ({
  question,
  leadInfo,
  inputValue,
  onInputChange,
  onSubmit,
  isSpeechMode,
  currentTranscript,
  isListening,
  onTranscript,
  onListeningStateChange,
  isSpeaking,
  isTyping,
  typingComplete,
  onTypingComplete,
  step,
  tones
}) => {
  if (!question) return null;

  const handleSubmit = (value, type = question.type) => {
    onSubmit(value, type);
  };

  const handleKeyDown = (e, submitValue = inputValue.trim()) => {
    if (e.key === 'Enter' && submitValue !== '') {
      handleSubmit(submitValue);
    }
  };

  return (
    <div className="question-container">
      <div className={`byte-question ${isSpeaking ? 'speaking' : ''}`}>
        <Typewriter
          key={`typewriter-${step}-${question.prompt.substring(0, 10)}`}
          options={{
            delay: 40,
            cursor: '|',
            deleteSpeed: 0,
          }}
          onInit={(typewriter) => {
            let typingDelay = step === 4 && question.key === 'welcomeMessage' ? 2000 : 200;

            setTimeout(() => {
              typewriter
                .typeString(question.prompt)
                .callFunction(() => {
                  onTypingComplete(true);
                })
                .start();
            }, typingDelay);
          }}
        />
      </div>

      {!isTyping && typingComplete && (
        <div className="input-container">
          {question.type === 'choice' && (
            <div className="choice-selection">
              {question.options.map(option => (
                <button
                  key={option}
                  onClick={() => handleSubmit(option, 'choice')}
                  className="choice-button"
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {question.type === 'text' && (
            <>
              {isSpeechMode ? (
                <SpeechInput
                  onTranscript={onTranscript}
                  isListening={isListening}
                  currentTranscript={currentTranscript}
                  onListeningStateChange={onListeningStateChange}
                  isAutoStart={true}
                  placeholder="Please speak your name..."
                />
              ) : (
                <>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={e => onInputChange(e.target.value)}
                    placeholder={question.placeholder}
                    onKeyDown={handleKeyDown}
                  />
                  <button
                    className="next-button"
                    onClick={() => handleSubmit(inputValue)}
                    disabled={!inputValue.trim()}
                  >
                    Next →
                  </button>
                </>
              )}
            </>
          )}

          {question.type === 'email' && (
            <>
              <input
                type="email"
                value={inputValue}
                onChange={e => onInputChange(e.target.value)}
                placeholder={question.placeholder}
                onKeyDown={e => handleKeyDown(e, inputValue)}
              />
              <div className="optional-field-note">
                {isSpeechMode 
                  ? "For better accuracy, please type your email. This field is optional."
                  : "This field is optional. You can leave it blank and click Next."
                }
              </div>
              <button
                className="next-button"
                onClick={() => handleSubmit(inputValue)}
              >
                Next →
              </button>
            </>
          )}

          {question.type === 'checkbox' && (
            <div className="consent-options">
              <button
                className={`consent-button ${leadInfo[question.key] ? 'consent-yes-selected' : ''}`}
                onClick={() => handleSubmit(true, 'checkbox')}
              >
                Yes
              </button>
              <button
                className={`consent-button ${leadInfo[question.key] === false ? 'consent-no-selected' : ''}`}
                onClick={() => handleSubmit(false, 'checkbox')}
              >
                No
              </button>
            </div>
          )}

          {question.type === 'tone' && (
            <div className="tone-selection">
              {tones.map(tone => (
                <button
                  key={tone}
                  className={leadInfo.tone === tone ? 'selected-tone' : ''}
                  onClick={() => handleSubmit(tone, 'tone')}
                >
                  {tone}
                </button>
              ))}
            </div>
          )}

          {question.type === 'message' && (
            <button
              className="next-button"
              onClick={() => handleSubmit('', 'message')}
            >
              Next →
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionRenderer;