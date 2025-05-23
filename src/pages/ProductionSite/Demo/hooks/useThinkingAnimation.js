// useThinkingAnimation.js

import { useState, useRef } from 'react';

const THINKING_MIN_DURATION = 3000;
const THINKING_TYPING_DURATION = 40;

export const useThinkingAnimation = ({ isSpeechMode, speakWithAction }) => {
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingText, setThinkingText] = useState('');
  const [thinkingProgress, setThinkingProgress] = useState(0);
  const [thinkingComplete, setThinkingComplete] = useState(false);
  const [isTyping, setIsTyping] = useState(true);
  const [typingComplete, setTypingComplete] = useState(false);
  const [waitingForSpeechToEnd, setWaitingForSpeechToEnd] = useState(false);
  
  const thinkingTimerRef = useRef(null);

  const simulateThinkingTyping = (text) => {
    console.log('Simulating thinking typing with text:', text);
    let i = 0;
    const length = text.length;

    setThinkingProgress(0);
    setThinkingComplete(false);

    if (thinkingTimerRef.current) {
      clearInterval(thinkingTimerRef.current);
    }

    if (speakWithAction && isSpeechMode) {
      setWaitingForSpeechToEnd(true);

      speakWithAction(text, () => {
        setWaitingForSpeechToEnd(false);
        setThinkingComplete(true);
      });
    }

    const typeNextChar = () => {
      if (i <= length) {
        setThinkingText(text.substring(0, i));
        setThinkingProgress(i / length);
        i++;
      } else {
        clearInterval(thinkingTimerRef.current);
        if (!isSpeechMode) {
          const elapsedTime = length * THINKING_TYPING_DURATION;
          const remainingTime = Math.max(0, THINKING_MIN_DURATION - elapsedTime);

          setTimeout(() => {
            setThinkingComplete(true);
          }, remainingTime);
        }
      }
    };

    thinkingTimerRef.current = setInterval(typeNextChar, THINKING_TYPING_DURATION);
  };

  const startThinking = (text) => {
    setThinkingText('');
    setIsThinking(true);
    setWaitingForSpeechToEnd(false);
    setThinkingComplete(false);
    simulateThinkingTyping(text);
  };

  const stopThinking = () => {
    if (thinkingTimerRef.current) {
      clearInterval(thinkingTimerRef.current);
    }
    
    setIsThinking(false);
    setThinkingComplete(false);
    setThinkingProgress(0);
    setThinkingText('');
    setWaitingForSpeechToEnd(false);
  };

  const resetThinking = () => {
    stopThinking();
    setIsTyping(true);
    setTypingComplete(false);
  };

  const canProceedToNextStep = () => {
    return thinkingComplete && !waitingForSpeechToEnd;
  };

  const completeThinkingPhase = (visibilityDelay = 1000) => {
    setTimeout(() => {
      setIsThinking(false);
      setThinkingComplete(false);
      setThinkingProgress(0);
      setIsTyping(true);
      setTypingComplete(false);
    }, visibilityDelay);
  };

  return {
    isThinking,
    thinkingText,
    thinkingProgress,
    thinkingComplete,
    isTyping,
    typingComplete,
    waitingForSpeechToEnd,
    setTypingComplete,
    setIsTyping,
    startThinking,
    stopThinking,
    resetThinking,
    canProceedToNextStep,
    completeThinkingPhase
  };
};