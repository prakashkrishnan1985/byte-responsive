import { useState, useRef } from "react";
import MicListener from "./MicListener";  // Fixed import path
import ChatWindow from "./ChatWindow";
import { sendQuery } from "../api";  // Assuming api.js is in the parent directory
import "../App.css";

function VoiceRAGPage() {
  const [customerId, setCustomerId] = useState("acme_ltd");
  const [namespace, setNamespace] = useState("ProductReviews");
  const [voice, setVoice] = useState("Default Voice");

  const [messages, setMessages] = useState([]);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [finalAnswer, setFinalAnswer] = useState("");
  const [typingMessage, setTypingMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const quirkyMessages = [
    "Consulting the wisdom of GPUs...",
    "Drinking a shot of JSON...",
    "Waking up the LLM...",
    "Googling the answer harder...",
    "Thinking in tokens and tensors...",
    "Taming a wild dataset...",
    "Extracting insights with lasers...",
    "Polishing the final answer...",
    "Feeding thoughts to a robot..."
  ];

  const loadingIntervalRef = useRef(null);

  const startLoadingMessages = () => {
    let i = 0;
    setLoadingMessage(quirkyMessages[0]);
    loadingIntervalRef.current = setInterval(() => {
      i = (i + 1) % quirkyMessages.length;
      setLoadingMessage(quirkyMessages[i]);
    }, 2000);
  };

  const stopLoadingMessages = () => {
    clearInterval(loadingIntervalRef.current);
    loadingIntervalRef.current = null;
    setLoadingMessage("");
  };

  const handleTranscript = async (text, isFinal = false) => {
    if (!text) return;

    setCurrentTranscript(text);

    if (isFinal) {
      setMessages(prev => [...prev, { role: "user", content: text }]);
      setIsLoading(true);
      startLoadingMessages();

      try {
        const response = await sendQuery(text);
        const fullText = response.final_answer;

        setFinalAnswer(fullText);

        if (response.audio_path) {
          const audioUrl = `http://localhost:8000${response.audio_path}?t=${Date.now()}`;
          const audio = new Audio(audioUrl);
          audio.play().catch(err => console.error("Audio playback error:", err));
        }

        let current = '';
        let index = 0;

        const typingInterval = setInterval(() => {
          if (index < fullText.length) {
            current += fullText[index];
            setTypingMessage(current);
            index++;
          } else {
            clearInterval(typingInterval);
            setMessages(prev => [
              ...prev,
              { role: "user", content: text },
              { role: "assistant", content: fullText, audioPath: response.audio_path }
            ]);
            setTypingMessage('');
            setIsLoading(false);
            stopLoadingMessages();
          }
        }, 30);

        setCurrentTranscript('');
      } catch (err) {
        console.error("Error in sendQuery:", err);
        setIsLoading(false);
        stopLoadingMessages();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <div className="container">
        <h1 className="heading">Voice RAG System</h1>

        <div className="card">
          <h2 className="section-title">Voice Query</h2>

          <div className="form-group">
            <label>Customer ID:</label>
            <input
              type="text"
              value={customerId}
              onChange={e => setCustomerId(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label>Namespace:</label>
            <input
              type="text"
              value={namespace}
              onChange={e => setNamespace(e.target.value)}
              className="input-field"
            />
          </div>

          {/* <div className="form-group">
            <label>Voice:</label>
            <select
              value={voice}
              onChange={e => setVoice(e.target.value)}
              className="input-field"
            >
              <option>Default Voice</option>
              <option>Voice A</option>
              <option>Voice B</option>
            </select>
          </div> */}

          <MicListener onTranscript={handleTranscript} />

          <p className="status-text">
            {currentTranscript ? `Listening... ${currentTranscript}` : "Ready to record"}
          </p>

          {isLoading && loadingMessage && (
            <div className="mt-4 flex items-center space-x-3 text-blue-600 animate-pulse">
              <span className="inline-block w-4 h-4 border-2 border-t-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></span>
              <span>{loadingMessage}</span>
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="section-title">Transcription</h2>
          <div className="transcription-box whitespace-pre-wrap">
            {finalAnswer || currentTranscript || "Your spoken query will appear here"}
          </div>
        </div>

        <ChatWindow
          messages={messages}
          typingMessage={typingMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

export default VoiceRAGPage;