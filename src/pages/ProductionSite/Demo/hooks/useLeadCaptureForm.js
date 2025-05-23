// useLeadCaptureForm.js

import { useState } from 'react';
import { getUniqueThinkingMessage, resetThinkingMessages } from '../utils/thinkingMessages';

export const useLeadCaptureForm = ({ onNext, questions, tones }) => {
  const [step, setStep] = useState(0);
  const [leadInfo, setLeadInfo] = useState({
    name: '',
    email: '',
    consentToPhoto: false,
    tone: '',
    inputMethod: '',
    welcomeMessage: ''
  });
  const [inputValue, setInputValue] = useState('');
  const [isSpeechMode, setIsSpeechMode] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);

  const updateLeadInfo = (key, value, callback) => {
    setLeadInfo(prev => {
      const newState = { ...prev, [key]: value };
      if (callback) callback(newState);
      return newState;
    });
  };

  const goToNextStep = () => {
    if (step + 1 < questions.length) {
      setStep(prev => prev + 1);
    }
  };

  const goToStep = (stepNumber) => {
    if (stepNumber >= 0 && stepNumber < questions.length) {
      setStep(stepNumber);
    }
  };

  const processStepTransition = (key, value, targetStep = null) => {
    const thinkingMsg = getUniqueThinkingMessage(key, value);
    
    updateLeadInfo(key, value);
    
    const nextStep = targetStep !== null ? targetStep : step + 1;
    
    setTimeout(() => {
      if (nextStep < questions.length) {
        setStep(nextStep);
      }
    }, 100);

    return thinkingMsg;
  };

  const handleInputSubmit = (value = inputValue.trim()) => {
    if (!questions[step]) return;
    
    const key = questions[step].key;
    setInputValue('');
    
    const thinkingMsg = processStepTransition(key, value);
    return { thinkingMsg, key, value };
  };

  const handleChoiceSelect = (value) => {
    if (!questions[step]) return;
    
    const key = questions[step].key;
    
    if (key === 'inputMethod' && value === 'Talk') {
      setIsSpeechMode(true);
    } else if (key === 'inputMethod') {
      setIsSpeechMode(false);
    }

    const thinkingMsg = processStepTransition(key, value);
    return { thinkingMsg, key, value };
  };

  const handleCheckboxChange = (isChecked) => {
    if (!questions[step]) return;
    
    const key = questions[step].key;
    
    if (key === 'consentToPhoto') {
      updateLeadInfo(key, isChecked);
      
      if (isChecked) {
        return { needsCamera: true, key, value: isChecked };
      } else {
        const defaultMsg = "Thanks for letting me know! Let's continue.";
        updateLeadInfo('welcomeMessage', defaultMsg);
        
        if (questions[4]) {
          questions[4].prompt = defaultMsg;
        }
        
        const thinkingMsg = getUniqueThinkingMessage(key, isChecked);
        
        setTimeout(() => {
          setStep(4);
          setTimeout(() => {
            setStep(5);
          }, 3000);
        }, 1500);
        
        return { thinkingMsg, key, value: isChecked };
      }
    } else {
      const thinkingMsg = processStepTransition(key, isChecked);
      return { thinkingMsg, key, value: isChecked };
    }
  };

  const handleToneSelect = (tone) => {
    const updatedInfo = {
      ...leadInfo,
      tone
    };

    setLeadInfo(updatedInfo);

    if (typeof onNext === 'function') {
      console.log('Calling onNext with leadInfo:', updatedInfo);
      onNext(updatedInfo);
    } else {
      console.log('onNext is not a function, cannot proceed. Final data:', updatedInfo);
      goToNextStep();
    }
  };

  const handleWelcomeComplete = () => {
    setTimeout(() => {
      console.log("Moving to tone selection after welcome");
      setStep(5);
    }, 1000);
  };

  const handlePhotoProcessed = (welcomeMessage, audioPath = null) => {
    updateLeadInfo('welcomeMessage', welcomeMessage);
    
    if (questions[4]) {
      questions[4].prompt = welcomeMessage;
    }

    setStep(4);

    if (!audioPath) {
      setTimeout(() => {
        console.log("Moving to tone selection with no audio");
        setStep(5);
      }, 3000);
    }

    return audioPath;
  };

  const handleReset = () => {
    resetThinkingMessages();
    
    setLeadInfo({
      name: '',
      email: '',
      consentToPhoto: false,
      tone: '',
      inputMethod: '',
      welcomeMessage: ''
    });
    setStep(0);
    setInputValue('');
    setIsSpeechMode(false);
    setCurrentTranscript('');
    setIsListening(false);
  };

  return {
    step,
    leadInfo,
    inputValue,
    setInputValue,
    isSpeechMode,
    currentTranscript,
    setCurrentTranscript,
    isListening,
    setIsListening,
    goToNextStep,
    goToStep,
    handleInputSubmit,
    handleChoiceSelect,
    handleCheckboxChange,
    handleToneSelect,
    handleWelcomeComplete,
    handlePhotoProcessed,
    handleReset,
    updateLeadInfo
  };
};