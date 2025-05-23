import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Typewriter from 'typewriter-effect';
import MicListener from './DemoMicListener';
import './styles/RAGQuestScreen.css';

const QUEST_API_BASE_URL = "http://localhost:8000";

// Single state to track exactly what phase we're in
const PHASES = {
    LOADING: 'loading',
    TYPING: 'typing',
    SPEAKING: 'speaking', 
    READY_TO_LISTEN: 'ready_to_listen',
    LISTENING: 'listening',
    PROCESSING: 'processing'
};

const RAGQuestScreen = ({ leadInfo, onComplete }) => {
    const messageCounterRef   = useRef(0);  
    const [sessionId, setSessionId] = useState(null);
    const [currentStep, setCurrentStep] = useState(null);
    const [error, setError] = useState('');
    const [userInput, setUserInput] = useState('');
    const [currentTranscript, setCurrentTranscript] = useState('');
    const [questHistory, setQuestHistory] = useState([]);
    const manualListeningRef = useRef(false);

    
    // Single phase state instead of multiple booleans
    const [currentPhase, setCurrentPhase] = useState(PHASES.LOADING);
    
    // Derived boolean states for compatibility with MicListener
    const isSpeaking = currentPhase === PHASES.SPEAKING;
    const isTyping = currentPhase === PHASES.TYPING;
    const isProcessing = currentPhase === PHASES.PROCESSING;
    
    // Manual listening control
    const [isManualListening, setIsManualListening] = useState(false);
    const listeningTimeoutRef = useRef(null);
    
    const audioRef = useRef(new Audio());
    const isSpeechMode = leadInfo?.inputMethod === 'Talk';
    const hasStartedRef = useRef(false);
    const lastProcessedResponseRef = useRef(null);
    const micListenerKeyRef = useRef(0);
    const typingTimeoutRef = useRef(null);

    const setManualListeningSafe = (val) => {
        manualListeningRef.current = val;   
        setIsManualListening(val);        
      };

      const changePhase = (newPhase, reason = '') => {
        console.log(`🔄 ${currentPhase} → ${newPhase} ${reason}`);
      
        // clear any previous typing timeout
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      
        setCurrentPhase(newPhase);
      
        // bump MicListener on every LISTENING entry
        if (newPhase === PHASES.LISTENING) micListenerKeyRef.current += 1;
      
        // leaving READY/ LISTENING → stop manual listen & timers
        if (newPhase === PHASES.PROCESSING || newPhase === PHASES.TYPING) {
          setManualListeningSafe(false);
          if (listeningTimeoutRef.current) clearTimeout(listeningTimeoutRef.current);
        }
      
        // (re)start a 3-s “typing took too long” failsafe
        if (newPhase === PHASES.TYPING) {
          typingTimeoutRef.current = setTimeout(() => {
            setCurrentPhase(p => (p === PHASES.TYPING ? PHASES.READY_TO_LISTEN : p));
          }, 3000);
        }
      };


    useEffect(() => {
        if (!hasStartedRef.current) {
            hasStartedRef.current = true;
            startQuest();
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            if (listeningTimeoutRef.current) {
                clearTimeout(listeningTimeoutRef.current);
            }
        };
    }, []);

    // Audio event handlers
    useEffect(() => {
        const handleAudioEnded = () => {
            // console.log('🎵 Audio ended');
            // if (currentPhase === PHASES.SPEAKING) {
            //     changePhase(PHASES.READY_TO_LISTEN, 'audio ended');
            //     // Smooth hand-off to LISTENING with small delay to avoid picking up audio tail
            //     if (isSpeechMode && currentStep?.cta?.voice_allowed) {
            //         setTimeout(() => {
            //             // Only transition if we're still in ready state (user hasn't interacted)
            //             if (currentPhase === PHASES.READY_TO_LISTEN) {
            //                 changePhase(PHASES.LISTENING, 'auto start listen after delay');
            //             }
            //         }, 150);
            //     }

             if (currentPhase === PHASES.SPEAKING)
             {
                changePhase(PHASES.READY_TO_LISTEN, 'audio ended  waiting for push-to-talk');
             }
            //}
        };

        const handleAudioError = () => {
            console.log('🎵 Audio error');
            if (currentPhase === PHASES.SPEAKING) {
                changePhase(PHASES.READY_TO_LISTEN, 'audio error');
            }
        };

        const currentAudio = audioRef.current;
        
        // Add null check before adding event listeners
        if (currentAudio) {
            currentAudio.addEventListener('ended', handleAudioEnded);
            currentAudio.addEventListener('error', handleAudioError);
        }

        return () => {
            // Add null check before removing event listeners
            if (currentAudio) {
                currentAudio.removeEventListener('ended', handleAudioEnded);
                currentAudio.removeEventListener('error', handleAudioError);
            }
        };
    }, [currentPhase, isSpeechMode, currentStep]);

    const startQuest = async () => {
        try {
            changePhase(PHASES.LOADING, 'starting quest');
            setError('');
            
            const response = await axios.post(`${QUEST_API_BASE_URL}/quest/start`, {
                quest_id: "reimbursement_riddle"
            });
            
            if (response.data.session_id) {
                setSessionId(response.data.session_id);
                await getCurrentStep(response.data.session_id);
            } else {
                setError('Failed to start quest: No session ID received');
            }
        } catch (err) {
            console.error('Error starting quest:', err);
            setError(`Failed to start quest: ${err.message}`);
        }
    };

    const getCurrentStep = async (sid = sessionId) => {
        if (!sid) return;
        
        try {
            const response = await axios.get(`${QUEST_API_BASE_URL}/quest/${sid}/step`);
            setCurrentStep(response.data);
            messageCounterRef.current += 1; 
            changePhase(PHASES.TYPING, 'new step loaded');
        } catch (err) {
            console.error('Error getting current step:', err);
            setError(`Failed to get step: ${err.message}`);
        }
    };

    const submitResponse = async (input) => {
        const trimmedInput = input?.trim();
        
        if (!sessionId || !trimmedInput || currentPhase === PHASES.PROCESSING) {
            console.log('❌ Submission blocked:', { 
                sessionId: !!sessionId, 
                input: trimmedInput, 
                currentPhase 
            });
            return;
        }
        
        try {
            // micListenerKeyRef.current += 1; 
            changePhase(PHASES.PROCESSING, 'submitting response');
            setError('');
            setUserInput('');
            setCurrentTranscript('');
            
            // Add user input to history
            setQuestHistory(prev => [...prev, {
                type: 'user',
                content: trimmedInput,
                timestamp: new Date()
            }]);

            const response = await axios.post(`${QUEST_API_BASE_URL}/quest/${sessionId}/respond`, {
                user_input: trimmedInput
            });

            if (response.data) {
                // Check for duplicates
                const responseKey = `${trimmedInput}-${Date.now()}`;   // guaranteed unique
                lastProcessedResponseRef.current = responseKey;
                // if (lastProcessedResponseRef.current === responseKey) {
                //     console.log('⚠️ Duplicate response detected');
                //     changePhase(PHASES.READY_TO_LISTEN, 'duplicate response');
                //     return;
                // }
                // lastProcessedResponseRef.current = responseKey;

                // Add system response to history
                setQuestHistory(prev => [...prev, {
                    type: 'system',
                    content: response.data,
                    timestamp: new Date()
                }]);

                setCurrentStep(response.data);
                messageCounterRef.current += 1; 
                changePhase(PHASES.TYPING, 'response received');

                // Start audio IMMEDIATELY if available (don't wait for typing)
                if (response.data.audio_path && isSpeechMode) {
                    console.log('🎵 Starting audio immediately');
                    setTimeout(() => {
                        playAudio(response.data.audio_path);
                    }, 200); // Very short delay just to let typing start
                }
            }
        } catch (err) {
            console.error('❌ Error submitting response:', err);
            setError(`Failed to submit response: ${err.message}`);
            changePhase(PHASES.READY_TO_LISTEN, 'submission error');
        }
    };

    const playAudio = (audioPath) => {
        try {
            // Bail out early if no audio path
            if (!audioPath) {
                console.log('🎵 No audio path provided, skipping playback');
                return;
            }
            
            const audioUrl = `${QUEST_API_BASE_URL}${audioPath}`;
            console.log('🎵 Starting audio playback:', audioUrl);
            
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current.src = audioUrl;
            
            changePhase(PHASES.SPEAKING, 'audio started');
            
            // Failsafe timeout
            const audioTimeout = setTimeout(() => {
                console.log('⏰ Audio timeout');
                if (currentPhase === PHASES.SPEAKING) {
                    changePhase(PHASES.READY_TO_LISTEN, 'audio timeout');
                }
            }, 30000);
            
            audioRef.current.addEventListener('ended', () => clearTimeout(audioTimeout), { once: true });
            audioRef.current.addEventListener('error', () => clearTimeout(audioTimeout), { once: true });
            
            audioRef.current.play()
                .then(() => console.log('🎵 Audio playing'))
                .catch(err => {
                    console.error('❌ Audio failed:', err);
                    changePhase(PHASES.READY_TO_LISTEN, 'audio play failed');
                    clearTimeout(audioTimeout);
                });
            
        } catch (err) {
            console.error('❌ Audio setup error:', err);
            changePhase(PHASES.READY_TO_LISTEN, 'audio setup error');
        }
    };

    const handleChoiceSelect = (choice) => {
        if (currentPhase !== PHASES.READY_TO_LISTEN && currentPhase !== PHASES.LISTENING) return;
        submitResponse(choice);
    };

    const handleTextSubmit = () => {
        if (!userInput.trim() || (currentPhase !== PHASES.READY_TO_LISTEN && currentPhase !== PHASES.LISTENING)) return;
        submitResponse(userInput.trim());
    };

    const handleTranscript = (text, isFinal = false) => {
        // if (currentPhase !== PHASES.LISTENING) return;
        console.log(`🎤 Transcript received: "${text}", isFinal: ${isFinal}, isManualListening: ${isManualListening}`);
        
        // Only process transcripts when manually listening
        if (!manualListeningRef.current) {
            console.log('🎤 Transcript ignored - not manually listening');
            return;
        }
        
        setCurrentTranscript(text);

        if (isFinal && text.trim()) {
            console.log('🎤 Final transcript received:', text.trim());
            // Clear timeout and stop listening
            if (listeningTimeoutRef.current) {
                clearTimeout(listeningTimeoutRef.current);
                listeningTimeoutRef.current = null;
            }
            setManualListeningSafe(false);
            submitResponse(text.trim());
        }
    };

    const handleStartListening = () => {
        if (isSpeaking || isProcessing || isTyping) {
            console.log('Cannot start listening - system busy');
            return;
        }
        console.log('Starting manual listening');
        setManualListeningSafe(true);
        micListenerKeyRef.current += 1; 
        setCurrentTranscript('');
    
        listeningTimeoutRef.current = setTimeout(() => {
            console.log('Auto-stopping listening due to timeout');
            micListenerKeyRef.current += 1;
            setManualListeningSafe(false);
        }, 10000);
    };

    const handleStopListening = () => {
        console.log('🎤 Stopping manual listening');
        setManualListeningSafe(false);
    };

    const handleSuggestionClick = (suggestion) => {
        if (currentPhase !== PHASES.READY_TO_LISTEN && currentPhase !== PHASES.LISTENING) return;
        submitResponse(suggestion);
    };

    const handleComplete = () => {
        if (typeof onComplete === 'function') {
            onComplete({
                ...leadInfo,
                questCompleted: true,
                questHistory: questHistory
            });
        }
    };


    if (currentPhase === PHASES.LOADING || !currentStep) {
        return (
            <div className="rag-quest-layout">
                <div className="quest-loading">
                    <div className="spinner"></div>
                    <p>Initializing your quest...</p>
                    <button 
                        onClick={handleComplete}
                        style={{
                            background: '#6b7280',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '6px',
                            marginTop: '1rem',
                            cursor: 'pointer'
                        }}
                    >
                        Skip Quest
                    </button>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rag-quest-layout">
                <div className="quest-error">
                    <h2>Quest Error</h2>
                    <p>{error}</p>
                    <button onClick={startQuest} className="retry-button">Retry</button>
                    <button onClick={handleComplete} className="retry-button" style={{ marginLeft: '1rem', background: '#6b7280' }}>
                        Skip Quest
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="rag-quest-layout">
            {/* Processing Overlay */}
            {isProcessing && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    color: 'white'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            border: '4px solid rgba(255, 255, 255, 0.3)',
                            borderTop: '4px solid white',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto 20px auto'
                        }}></div>
                        <p style={{ fontSize: '18px', fontWeight: '500' }}>Processing your request...</p>
                    </div>
                    <style>{`
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `}</style>
                </div>
            )}

            <div className="quest-header">
                <h1>Quest: Reimbursement Riddle Powered by BytesizedAI RAG</h1>
                <p>Welcome {leadInfo?.name || 'Adventurer'}! Let's explore the policies together.</p>
            </div>

            <div className="quest-content">
                {/* Quest History */}
                {questHistory.length > 0 && (
                    <div className="quest-history">
                        {questHistory.slice(-3).map((entry, index) => (
                            <div key={index} className={`history-entry ${entry.type}`}>
                                {entry.type === 'user' ? (
                                    <div className="user-message">
                                        <strong>You:</strong> {entry.content}
                                    </div>
                                ) : (
                                    <div className="system-message">
                                        <strong>Quest Guide:</strong> {entry.content.text}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Current Step */}
                <div className="current-step">
                    <div className={`quest-text ${isSpeaking ? 'speaking' : ''}`}>
                        {isTyping ? (
                            <Typewriter
                                // key={`quest-${currentStep.step_id || Date.now()}`}
                                key={`bot-${messageCounterRef.current}`}
                                options={{
                                    delay: 50,
                                    cursor: '|',
                                    deleteSpeed: 0,
                                }}
                                onInit={(typewriter) => {
                                    typewriter
                                        .typeString(currentStep.text || 'Loading...')
                                        .callFunction(() => {
                                            console.log('✍️ Typing completed');
                                            
                                            // Always transition out of typing phase
                                            if (currentPhase === PHASES.TYPING) {
                                                // Only move to READY_TO_LISTEN if no audio clip is present
                                                if (!currentStep.audio_path) {
                                                    // No TTS clip – we can listen immediately
                                                    if (isSpeechMode && currentStep?.cta?.voice_allowed) {
                                                        changePhase(PHASES.READY_TO_LISTEN, 'typing done, no audio, speech mode');
                                                    } else {
                                                        changePhase(PHASES.READY_TO_LISTEN, 'typing done, no audio, text mode');
                                                    }
                                                }
                                                // 🚫 Do NOT change the phase when audio_path exists.
                                                // playAudio() already put us in SPEAKING, and handleAudioEnded()
                                                // will flip us to READY_TO_LISTEN at the right time.
                                            }
                                        })
                                        .start();
                                }}
                            />
                        ) : (
                            <div className="static-text">{currentStep.text}</div>
                        )}
                    </div>

                    {/* Demonstrating badges */}
                    {currentStep.demonstrating && (
                        <div className="demo-badges">
                            <span className="demo-label">Demonstrating:</span>
                            {currentStep.demonstrating.map(tech => (
                                <span key={tech} className="demo-badge">{tech}</span>
                            ))}
                        </div>
                    )}

                    {/* Input Controls - only show when ready */}
                    {(currentPhase === PHASES.READY_TO_LISTEN || currentPhase === PHASES.LISTENING) && !isSpeaking && !isProcessing && currentStep.cta && (
                        <div className="quest-input-section">
                            {currentStep.cta.type === 'choice' && (
                                <div className="choice-buttons">
                                    {currentStep.cta.options.map(option => (
                                        <button
                                            key={option}
                                            onClick={() => handleChoiceSelect(option)}
                                            className="quest-choice-button"
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {currentStep.cta.type === 'free-text' && (
                                <div className="free-text-input">
                                    {isSpeechMode && currentStep.cta.voice_allowed ? (
                                        <div className="speech-input-container">
                                            {/* Only render MicListener when manually listening */}
                                            {isManualListening && (
                                                <MicListener
                                                    key={`mic-${micListenerKeyRef.current}`}
                                                    onTranscript={handleTranscript}
                                                    customerId="quest_input"
                                                    namespace="QuestRAG"
                                                    isAutoStart={true}
                                                    onListeningStateChange={(listening) => {
                                                        console.log(`🎤 MicListener reports: ${listening}`);
                                                    }}
                                                />
                                            )}
                                            
                                            {/* Push to Talk Button */}
                                            <div className="push-to-talk-section">
                                                {!isManualListening ? (
                                                    <button
                                                        onClick={handleStartListening}
                                                        disabled={isSpeaking || isProcessing || isTyping}
                                                        className="talk-button"
                                                        style={{
                                                            background: (isSpeaking || isProcessing || isTyping) ? '#6b7280' : '#10b981',
                                                            color: 'white',
                                                            border: 'none',
                                                            padding: '12px 24px',
                                                            borderRadius: '25px',
                                                            fontSize: '16px',
                                                            fontWeight: '600',
                                                            cursor: (isSpeaking || isProcessing || isTyping) ? 'not-allowed' : 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '8px',
                                                            margin: '0 auto',
                                                            transition: 'all 0.2s ease'
                                                        }}
                                                    >
                                                        🎤 Click to Talk
                                                    </button>
                                                ) : (
                                                    <div
                                                        className="talk-button listening"
                                                        style={{
                                                            background: '#ef4444',
                                                            color: 'white',
                                                            border: 'none',
                                                            padding: '12px 24px',
                                                            borderRadius: '25px',
                                                            fontSize: '16px',
                                                            fontWeight: '600',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '8px',
                                                            margin: '0 auto',
                                                            animation: 'pulse 2s infinite',
                                                            transition: 'all 0.2s ease'
                                                        }}
                                                    >
                                                        🔴 Listening... (Speak now)
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div className="transcript-display">
                                                {isSpeaking ? (
                                                    <p>🔊 Speaking... Please wait.</p>
                                                ) : isProcessing ? (
                                                    <p>⚙️ Processing... Please wait.</p>
                                                ) : isManualListening ? (
                                                    <p>🎤 Listening... {currentTranscript}</p>
                                                ) : (
                                                    <p>{currentTranscript || "Click the button above to speak"}</p>
                                                )}
                                            </div>
                                            
                                            <style>{`
                                                @keyframes pulse {
                                                    0% { transform: scale(1); }
                                                    50% { transform: scale(1.05); }
                                                    100% { transform: scale(1); }
                                                }
                                                
                                                .push-to-talk-section {
                                                    text-align: center;
                                                    margin: 16px 0;
                                                }
                                            `}</style>
                                        </div>
                                    ) : (
                                        <div className="text-input-container">
                                            <input
                                                type="text"
                                                value={userInput}
                                                onChange={e => setUserInput(e.target.value)}
                                                placeholder={currentStep.cta.placeholder}
                                                onKeyDown={e => {
                                                    if (e.key === 'Enter' && userInput.trim()) {
                                                        handleTextSubmit();
                                                    }
                                                }}
                                            />
                                            <button
                                                onClick={handleTextSubmit}
                                                disabled={!userInput.trim()}
                                                className="submit-button"
                                            >
                                                Send
                                            </button>
                                        </div>
                                    )}

                                    {/* Suggestions */}
                                    {currentStep.cta.suggestions && (
                                        <div className="suggestions">
                                            <p className="suggestions-label">Quick suggestions:</p>
                                            <div className="suggestion-buttons">
                                                {currentStep.cta.suggestions.map(suggestion => (
                                                    <button
                                                        key={suggestion}
                                                        onClick={() => handleSuggestionClick(suggestion)}
                                                        className="suggestion-button"
                                                    >
                                                        {suggestion}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Manual complete button */}
                    <div style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                        <button 
                            onClick={handleComplete} 
                            className="complete-button"
                            style={{
                                background: 'linear-gradient(45deg, #10b981, #059669)',
                                color: 'white',
                                border: 'none',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '8px',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            Complete Quest
                        </button>
                    </div>
                </div>
            </div>

            {/* Debug info */}
            {process.env.NODE_ENV === 'development' && (
                <div style={{ position: 'fixed', bottom: '10px', left: '10px', background: 'rgba(0,0,0,0.8)', color: 'white', padding: '10px', fontSize: '12px', borderRadius: '5px' }}>
                    <div><strong>PHASE:</strong> {currentPhase}</div>
                    <div>MicListener Key: {micListenerKeyRef.current}</div>
                    <div>Has Audio: {String(!!currentStep?.audio_path)}</div>
                    <div>Speech Mode: {String(isSpeechMode)}</div>
                    <div>Voice Allowed: {String(currentStep?.cta?.voice_allowed)}</div>
                    <div>Manual Listening: {String(isManualListening)}</div>
                    
                    {/* Debug buttons */}
                    <div style={{ marginTop: '8px', display: 'flex', gap: '4px' }}>
                        <button 
                            onClick={() => changePhase(PHASES.READY_TO_LISTEN, 'manual debug')}
                            style={{ fontSize: '10px', padding: '2px 6px', background: '#f59e0b', border: 'none', borderRadius: '3px' }}
                        >
                            Force Ready
                        </button>
                        <button 
                            onClick={() => changePhase(PHASES.LISTENING, 'manual debug')}
                            style={{ fontSize: '10px', padding: '2px 6px', background: '#10b981', border: 'none', borderRadius: '3px' }}
                        >
                            Force Listen
                        </button>
                    </div>
                </div>
            )}

            <audio ref={audioRef} style={{ display: 'none' }} />
        </div>
    );
};

export default RAGQuestScreen;