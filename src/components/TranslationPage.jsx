import React, { useState, useEffect, useRef } from 'react';
import './TranslationPage.css';

const LANGUAGES = [
  "English",
  "Egyptian Arabic",
  "Qatari Arabic",
  "European Portuguese",
  "German",
  "European French",
  "European Spanish",
  "Hindi",
  "Japanese",
  "Spanish",
  "French",
  "Italian"
];

const TranslationPage = () => {
  const [sourceLang, setSourceLang] = useState("");
  const [targetLang, setTargetLang] = useState("");
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [events, setEvents] = useState([]);
  const [inputText, setInputText] = useState("");
  const [translationResults, setTranslationResults] = useState([]);
  const [serverUrl, setServerUrl] = useState("http://localhost:8000");
  
  const peerConnection = useRef(null);
  const dataChannel = useRef(null);
  const audioElement = useRef(new Audio());
  const callId = useRef(`call-${Date.now()}`);

  async function createSession() {
    try {
      const response = await fetch(`${serverUrl}/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          call_id: callId.current,
          src: sourceLang,
          dst: targetLang
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create session: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  }

  async function getToken() {
    try {
      const response = await fetch(`${serverUrl}/token`);
      if (!response.ok) {
        throw new Error(`Failed to get token: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting token:', error);
      throw error;
    }
  }

  async function directOpenAIConnection() {
    try {
      const tokenData = await getToken();
      const EPHEMERAL_KEY = tokenData.client_secret.value;
      
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' }
        ]
      });
      
      peerConnection.current = pc;
      
      audioElement.current.autoplay = true;
      pc.ontrack = (e) => {
        console.log("Received audio track");
        audioElement.current.srcObject = e.streams[0];
      };
      
      pc.oniceconnectionstatechange = () => {
        console.log("ICE connection state:", pc.iceConnectionState);
        appendEvent({
          type: "connection",
          content: `ICE state: ${pc.iceConnectionState}`
        });
      };
      
      pc.onsignalingstatechange = () => {
        console.log("Signaling state:", pc.signalingState);
      };
      
      try {
        const localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
      } catch (micError) {
        console.error('Error accessing microphone:', micError);
        throw new Error('Failed to access microphone. Please check permissions and try again.');
      }
      
      const dc = pc.createDataChannel("oai-events");
      dataChannel.current = dc;
      
      setupDataChannel(dc);
      
      const offer = await pc.createOffer();
      console.log("Original offer SDP:", offer.sdp.substring(0, 100) + "...");
      
      await pc.setLocalDescription(offer);
      
      const sdpData = pc.localDescription.sdp;
      
      const response = await fetch("https://api.openai.com/v1/realtime", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${EPHEMERAL_KEY}`,
          "Content-Type": "application/sdp"
        },
        body: sdpData
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
      }
      
      const sdpAnswer = await response.text();
      console.log("OpenAI SDP answer:", sdpAnswer.substring(0, 100) + "...");
      
      const remoteDesc = new RTCSessionDescription({
        type: 'answer',
        sdp: sdpAnswer
      });
      
      await pc.setRemoteDescription(remoteDesc);
      console.log("Remote description set successfully");
      
      appendEvent({
        type: "system",
        content: "Successfully connected to OpenAI"
      });
      
      return true;
    } catch (error) {
      console.error("Error connecting to OpenAI:", error);
      throw error;
    }
  }

  async function startSession() {
    if (!sourceLang || !targetLang) {
      alert("Please select both source and target languages first.");
      return;
    }

    setConnecting(true);
    setEvents([]);
    
    try {
      await createSession();
      
      await directOpenAIConnection();
      
    } catch (error) {
      console.error("Failed to start session:", error);
      alert(`Connection error: ${error.message}`);
      stopSession();
    }
  }

  function setupDataChannel(dc) {
    dc.onopen = () => {
      setIsSessionActive(true);
      setConnecting(false);
      
      sendClientEvent({
        type: "session.update",
        session: {
          instructions: `
            You are a live translation assistant. Your task is to translate all input from one language to another accurately and fluently. Follow these instructions carefully:
            Translate all spoken and written input from ${sourceLang} into spoken ${targetLang}. Treat all input as content to be translated.
            Respond ONLY with the translation in ${targetLang}. Do not provide any additional commentary, explanations, or engage in conversation.
            You must also provide the translation in text format.
            Do not ask for clarification or provide any information beyond the translation.
            If you encounter any words or phrases you cannot translate, include them in their original form in the translation.
            Provide your translation following the instructions above.
          `,
          modalities: ["audio", "text"],
          input_audio_transcription: { model: "whisper-1" },
          voice: "echo",
          turn_detection: { type: "server_vad" },
        }
      });
      
      appendEvent({
        type: "system",
        content: "Connection established. You can now send messages for translation."
      });
    };
    
    dc.onmessage = (e) => {
      try {
        const event = JSON.parse(e.data);
        appendEvent(event);
        
        if (event.type === "conversation.message" && event.role === "assistant") {
          const content = event.content;
          if (content && content.length > 0) {
            const textContent = content.find(item => item.type === "text");
            if (textContent) {
              setTranslationResults(prev => [...prev, textContent.text]);
            }
          }
        }
      } catch (err) {
        console.error("Error processing message:", err, e.data);
      }
    };
    
    dc.onerror = (error) => {
      console.error("Data channel error:", error);
      appendEvent({
        type: "error",
        content: "Connection error: " + error.message
      });
    };
    
    dc.onclose = () => {
      appendEvent({
        type: "system",
        content: "Connection closed"
      });
      setIsSessionActive(false);
    };
  }

  function stopSession() {
    if (dataChannel.current) {
      dataChannel.current.close();
      dataChannel.current = null;
    }
    
    if (peerConnection.current) {
      peerConnection.current.getSenders().forEach((sender) => {
        if (sender.track) sender.track.stop();
      });
      peerConnection.current.close();
      peerConnection.current = null;
    }
    
    if (audioElement.current.srcObject) {
      audioElement.current.srcObject.getTracks().forEach(track => track.stop());
      audioElement.current.srcObject = null;
    }
    
    setIsSessionActive(false);
    setConnecting(false);
    
    appendEvent({
      type: "system",
      content: "Session stopped"
    });
  }

  function appendEvent(evt) {
    evt.clientTimestamp = Date.now();
    setEvents(prev => [...prev, evt]);
  }

  function sendClientEvent(msg) {
    if (!dataChannel.current || dataChannel.current.readyState !== "open") {
      console.warn("Data channel not ready", dataChannel.current);
      return;
    }
    
    msg.event_id = msg.event_id || crypto.randomUUID();
    const msgString = JSON.stringify(msg);
    
    dataChannel.current.send(msgString);
    appendEvent({ ...msg, direction: "outgoing" });
  }

  function sendTextMessage() {
    if (!inputText.trim()) return;
    
    const text = inputText.trim();
    
    sendClientEvent({
      type: "conversation.item.create",
      item: {
        type: "message",
        role: "user",
        content: [{ type: "input_text", text }],
      },
    });
    
    sendClientEvent({ type: "response.create" });
    
    setInputText("");
  }

  useEffect(() => {
    return () => {
      if (isSessionActive) {
        stopSession();
      }
    };
  }, []);

  return (
    <div className="translation-container">
      <h1>Real-time Translation</h1>
      
      <div className="server-settings">
        <label>
          Server URL:
          <input
            type="text"
            value={serverUrl}
            onChange={(e) => setServerUrl(e.target.value)}
            disabled={isSessionActive || connecting}
          />
        </label>
      </div>
      
      <div className="language-selector">
        <div>
          <label htmlFor="sourceLang">Translate from:</label>
          <select
            id="sourceLang"
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            disabled={isSessionActive || connecting}
          >
            <option value="">Select source language</option>
            {LANGUAGES.map(lang => (
              <option key={`src-${lang}`} value={lang}>{lang}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="targetLang">Translate to:</label>
          <select
            id="targetLang"
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            disabled={isSessionActive || connecting}
          >
            <option value="">Select target language</option>
            {LANGUAGES.map(lang => (
              <option key={`tgt-${lang}`} value={lang}>{lang}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="debug-controls">
        <button 
          onClick={() => {
            appendEvent({
              type: "debug",
              content: `Call ID: ${callId.current}, Server URL: ${serverUrl}`
            });
          }}
        >
          Debug Info
        </button>
      </div>
      
      <div className="control-buttons">
        {!isSessionActive ? (
          <button
            onClick={startSession}
            disabled={connecting || !sourceLang || !targetLang}
            className={connecting ? "connecting" : ""}
          >
            {connecting ? "Connecting..." : "Start Translation"}
          </button>
        ) : (
          <button onClick={stopSession} className="stop-button">
            Stop Translation
          </button>
        )}
      </div>
      
      {isSessionActive && (
        <div className="translation-input">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Type in ${sourceLang} and press Translate`}
            rows={4}
          />
          <button onClick={sendTextMessage} disabled={!inputText.trim()}>
            Translate
          </button>
        </div>
      )}
      
      {translationResults.length > 0 && (
        <div className="translation-results">
          <h2>Translations</h2>
          <ul>
            {translationResults.map((result, index) => (
              <li key={index}>
                <div className="translation-result">{result}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="event-log">
        <h3>Event Log</h3>
        <div className="events-container">
          {events.map((event, index) => (
            <div key={index} className={`event ${event.type}`}>
              <div className="event-type">{event.type}</div>
              {event.content && <div className="event-content">{event.content}</div>}
              {event.direction && <div className="event-direction">{event.direction}</div>}
              <div className="event-time">
                {new Date(event.clientTimestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TranslationPage;