export const initSpeechSynthesis = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const synth = window.speechSynthesis;
  
      return new Promise((resolve) => {
        const loadVoices = () => {
          const voices = synth.getVoices();
          if (voices.length > 0) {
            resolve(buildSynthAPI(synth, voices));
          } else {
            synth.onvoiceschanged = () => {
              const updatedVoices = synth.getVoices();
              resolve(buildSynthAPI(synth, updatedVoices));
            };
          }
        };
  
        loadVoices();
      });
    }
  
    return Promise.resolve(createFallbackAPI());
  };
  
  const buildSynthAPI = (synth, voices) => {
    const getThinkingVoice = () =>
      voices.find(v => v.name.includes('Google UK English Male')) ||
      voices.find(v => v.name.includes('Male')) ||
      voices.find(v => v.lang.includes('en')) ||
      voices[0];
  
    const getTalkingVoice = () =>
      voices.find(v => v.name.includes('Google UK English Female')) ||
      voices.find(v => v.name.includes('Female')) ||
      voices.find(v => v.lang.includes('en')) ||
      voices[0];
  
    const speakThinking = (text, onEnd = () => {}) => {
      if (!text) return;
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = getThinkingVoice();
      utterance.rate = 1.0;
      utterance.pitch = 1.1;
      utterance.volume = 1.0;
      utterance.onend = onEnd;
      synth.speak(utterance);
    };
  
    const speakTalking = (text, onEnd = () => {}) => {
      if (!text) return;
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = getTalkingVoice();
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      utterance.onend = onEnd;
      synth.speak(utterance);
    };
  
    const stopSpeaking = () => {
      synth.cancel();
    };
  
    return {
      speakThinking,
      speakTalking,
      stopSpeaking,
      getVoices: () => voices
    };
  };
  
  const createFallbackAPI = () => ({
    speakThinking: (text, onEnd) => {
      console.log('[TTS fallback] Thinking:', text);
      if (onEnd) onEnd();
    },
    speakTalking: (text, onEnd) => {
      console.log('[TTS fallback] Talking:', text);
      if (onEnd) onEnd();
    },
    stopSpeaking: () => {},
    getVoices: () => []
  });
  
  export const testSpeechSynthesis = (synthAPI) => {
    if (synthAPI && typeof synthAPI.speakTalking === 'function') {
      synthAPI.speakTalking('', () => {
        console.log('Speech synthesis test complete');
      });
    }
  };
  
  export const enableSpeechOnUserInteraction = (synthAPI) => {
    const enableSpeech = () => {
      testSpeechSynthesis(synthAPI);
      document.removeEventListener('click', enableSpeech);
      document.removeEventListener('touchstart', enableSpeech);
    };
  
    document.addEventListener('click', enableSpeech);
    document.addEventListener('touchstart', enableSpeech);
  };