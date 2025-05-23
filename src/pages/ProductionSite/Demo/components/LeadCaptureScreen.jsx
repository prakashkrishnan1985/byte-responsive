import React from 'react';
import Orb from './OrbBackground';
import QuestionRenderer from './QuestionRenderer';
import ThinkingBox from './ThinkingBox';
import CameraCapture from './CameraCapture';
import { useLeadCaptureForm } from '../hooks/useLeadCaptureForm';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { useCamera } from '../hooks/useCamera';
import { useFaceDetection } from '../hooks/useFaceDetection';
import { useThinkingAnimation } from '../hooks/useThinkingAnimation';
import { questions, tones } from '../utils/questions';
import "../styles/LeadCaptureScreen.css"

const LeadCaptureScreen = ({ onNext }) => {
  // Form state management
  const {
    step,
    leadInfo,
    inputValue,
    setInputValue,
    goToNextStep,
    handleInputSubmit,
    handleChoiceSelect,
    handleCheckboxChange,
    handleToneSelect,
    handleReset,
    isSpeechMode,
    currentTranscript,
    setCurrentTranscript,
    isListening,
    setIsListening
  } = useLeadCaptureForm({ onNext, questions, tones });

  // Speech synthesis
  const {
    isSpeaking,
    speakWithAction,
    stopSpeaking
  } = useSpeechSynthesis();

  // Camera and face detection
  const {
    isModelLoading,
    cameraError,
    photoData,
    photoTaken,
    videoRef,
    canvasRef,
    initializeCamera,
    capturePhoto
  } = useCamera();

  const {
    smileDetected,
    startFaceDetection
  } = useFaceDetection({ 
    videoRef, 
    capturePhoto, 
    onSmileDetected: () => {} 
  });

  // Thinking animation
  const {
    isThinking,
    thinkingText,
    thinkingProgress,
    thinkingComplete,
    startThinking,
    isTyping,
    typingComplete,
    setTypingComplete
  } = useThinkingAnimation({ isSpeechMode, speakWithAction });

  // Current question logic
  const currentQuestion = step < questions.length ? questions[step] : null;
  const personalizedQuestion = (() => {
    if (!currentQuestion) return null;

    if (currentQuestion.promptTemplate && leadInfo.name) {
      return {
        ...currentQuestion,
        prompt: currentQuestion.promptTemplate.replace('{name}', leadInfo.name)
      };
    }

    return currentQuestion;
  })();

  // Handle different input types
  const handleFormSubmit = (value, type) => {
    switch (type) {
      case 'text':
      case 'email':
        handleInputSubmit(value);
        break;
      case 'choice':
        handleChoiceSelect(value);
        break;
      case 'checkbox':
        handleCheckboxChange(value);
        break;
      case 'tone':
        handleToneSelect(value);
        break;
      default:
        console.warn('Unknown form type:', type);
    }
  };

  // Handle transcript from speech input
  const handleTranscript = (text, isFinal = false) => {
    setCurrentTranscript(text);

    if (isFinal && text.trim()) {
      setIsListening(false);
      handleFormSubmit(text, 'text');
      setCurrentTranscript('');
    }
  };

  return (
    <div className="lead-capture-layout">
      {/* Orb Column */}
      <div className="orb-column">
        <Orb
          hoverIntensity={0.5}
          rotateOnHover={true}
          hue={0}
          forceHoverState={isTyping || isThinking}
        />
      </div>

      {/* Main Content Column */}
      <div className="text-column">
        <h1 className="byte-heading">Hi, I'm Byte. Let's play a quick game!</h1>

        {/* Photo Preview */}
        {photoTaken && photoData && (
          <div className="captured-photo-container">
            <img
              src={photoData}
              alt="Captured"
              className="captured-photo-thumbnail"
            />
          </div>
        )}

        <div className="lead-form">
          {/* Question Renderer or Thinking Box */}
          {!isThinking ? (
            <QuestionRenderer
              question={personalizedQuestion}
              leadInfo={leadInfo}
              inputValue={inputValue}
              onInputChange={setInputValue}
              onSubmit={handleFormSubmit}
              isSpeechMode={isSpeechMode}
              currentTranscript={currentTranscript}
              isListening={isListening}
              onTranscript={handleTranscript}
              onListeningStateChange={setIsListening}
              isSpeaking={isSpeaking}
              isTyping={isTyping}
              typingComplete={typingComplete}
              onTypingComplete={setTypingComplete}
              step={step}
              tones={tones}
            />
          ) : (
            <div className="byte-question-loading">
              <div className="spinner-container">
                <div className="spinner"></div>
                <p>Thinking...</p>
              </div>
            </div>
          )}

          {/* Camera Component */}
          {personalizedQuestion?.key === 'consentToPhoto' && 
           leadInfo.consentToPhoto && 
           !photoTaken && (
            <CameraCapture
              isModelLoading={isModelLoading}
              smileDetected={smileDetected}
              cameraError={cameraError}
              videoRef={videoRef}
              canvasRef={canvasRef}
              onInitialize={initializeCamera}
              onStartDetection={startFaceDetection}
            />
          )}
        </div>

        {/* Start Over Button */}
        <div className="start-over-container">
          <button
            className="start-over-button"
            onClick={handleReset}
            title="Start over from the beginning"
          >
            ↺ Start Over
          </button>
        </div>

        {/* Thinking Box */}
        {isThinking && (
          <ThinkingBox
            thinkingText={thinkingText}
            thinkingProgress={thinkingProgress}
            isSpeechMode={isSpeechMode}
            isSpeaking={isSpeaking}
          />
        )}
      </div>
    </div>
  );
};

export default LeadCaptureScreen;