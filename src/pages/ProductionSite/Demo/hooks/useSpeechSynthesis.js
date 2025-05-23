// useSpeechSynthesis.js

import { useState, useEffect, useRef } from 'react';
import { initSpeechSynthesis, testSpeechSynthesis, enableSpeechOnUserInteraction } from '../utils/speechUtils';

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState('');
  
  const speechSynthRef = useRef(null);
  const pendingActionRef = useRef(null);
  const audioRef = useRef(new Audio());
  const [isBackendAudioPlaying, setIsBackendAudioPlaying] = useState(false);
  const [isSpeechBlocked, setIsSpeechBlocked] = useState(false);

  useEffect(() => {
    const handleAudioEnded = () => {
      console.log('Backend audio playback ended');
      setIsBackendAudioPlaying(false);
      setIsSpeechBlocked(false);
    };

    const handleCanPlayThrough = () => {
      console.log('Backend audio ready to play');
      setIsBackendAudioPlaying(true);
    };

    const currentAudio = audioRef.current;
    currentAudio.addEventListener('ended', handleAudioEnded);
    currentAudio.addEventListener('canplaythrough', handleCanPlayThrough);

    return () => {
      currentAudio.removeEventListener('ended', handleAudioEnded);
      currentAudio.removeEventListener('canplaythrough', handleCanPlayThrough);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    const initSpeech = async () => {
      try {
        const synthAPI = await initSpeechSynthesis();
        
        if (!isMounted) return;
        
        if (synthAPI) {
          console.log("Speech synthesis initialized successfully");
          speechSynthRef.current = synthAPI;
          setIsInitialized(true);
          
          testSpeechSynthesis(synthAPI);
          enableSpeechOnUserInteraction(synthAPI);
        } else {
          console.error("Failed to initialize speech synthesis");
          setError("Speech synthesis not available");
        }
      } catch (err) {
        console.error("Error initializing speech:", err);
        setError(err.message);
      }
    };

    initSpeech();

    return () => {
      isMounted = false;
    };
  }, []);

  const executePendingAction = () => {
    if (pendingActionRef.current) {
      const action = pendingActionRef.current;
      pendingActionRef.current = null;
      action();
    }
  };

  const speakThinking = (text, onEnd) => {
    if (!speechSynthRef.current || !text || isBackendAudioPlaying || isSpeechBlocked) {
      if (onEnd) onEnd();
      return;
    }

    setIsSpeaking(true);
    speechSynthRef.current.speakThinking(text, () => {
      setIsSpeaking(false);
      if (onEnd) onEnd();
    });
  };

  const speakTalking = (text, onEnd) => {
    if (!speechSynthRef.current || !text || isBackendAudioPlaying || isSpeechBlocked) {
      if (onEnd) onEnd();
      return;
    }

    setIsSpeaking(true);
    speechSynthRef.current.speakTalking(text, () => {
      setIsSpeaking(false);
      if (onEnd) onEnd();
    });
  };

  const speakWithAction = (text, action) => {
    console.log("Attempting to speak:", text);
    console.log("Speech conditions:", {
      isBackendAudioPlaying,
      isSpeechBlocked,
      hasSpeechRef: !!speechSynthRef.current
    });

    if (isBackendAudioPlaying || isSpeechBlocked || !speechSynthRef.current) {
      console.log("Cannot speak due to conditions, executing action anyway");
      if (action) action();
      return;
    }

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsBackendAudioPlaying(false);

    console.log("Speaking:", text);
    setIsSpeaking(true);

    if (action) {
      pendingActionRef.current = action;
    }

    speechSynthRef.current.speakTalking(text, () => {
      console.log("Speech completed for:", text);
      setIsSpeaking(false);
      executePendingAction();
    });
  };

  const stopSpeaking = () => {
    if (speechSynthRef.current) {
      speechSynthRef.current.stopSpeaking();
      setIsSpeaking(false);
    }
    pendingActionRef.current = null;
  };

  const playBackendAudio = (audioUrl, onEnd) => {
    if (!audioUrl) {
      if (onEnd) onEnd();
      return;
    }

    setIsSpeechBlocked(true);
    audioRef.current.src = audioUrl;
    setIsBackendAudioPlaying(true);

    const handleAudioComplete = () => {
      console.log("Backend audio completed");
      setIsBackendAudioPlaying(false);
      setIsSpeechBlocked(false);
      if (onEnd) onEnd();
      audioRef.current.removeEventListener('ended', handleAudioComplete);
    };

    audioRef.current.addEventListener('ended', handleAudioComplete);

    setTimeout(() => {
      audioRef.current.play().catch(err => {
        console.error('Error playing audio:', err);
        setIsBackendAudioPlaying(false);
        setIsSpeechBlocked(false);
        if (onEnd) onEnd();
      });
    }, 300);

    setTimeout(() => {
      if (isBackendAudioPlaying) {
        console.log("Audio taking too long, forcing continuation");
        setIsBackendAudioPlaying(false);
        setIsSpeechBlocked(false);
        if (onEnd) onEnd();
      }
    }, 15000);
  };

  const getVoices = () => {
    return speechSynthRef.current ? speechSynthRef.current.getVoices() : [];
  };

  return {
    isSpeaking,
    isInitialized,
    error,
    isBackendAudioPlaying,
    isSpeechBlocked,
    speakThinking,
    speakTalking,
    speakWithAction,
    stopSpeaking,
    playBackendAudio,
    getVoices
  };
};