// MicListener.jsx – speech capture only (no API call)
import { useState, useRef, useEffect } from "react";

const browserLocale = navigator.language || "en-US";
const LANGS = [
  browserLocale,
  "en-US", "en-GB",
  "es-ES", "es",
  "fr-FR", "fr",
  "de-DE", "de",
  "zh-CN",
  "ja-JP"
].filter((v, i, arr) => arr.indexOf(v) === i);

export default function MicListener({ onTranscript }) {
  const [lang, setLang]       = useState(browserLocale);
  const [isListening, setOn]  = useState(false);
  const [error, setError]     = useState(null);
  const recogRef              = useRef(null);

  useEffect(() => {
    return () => {
      console.log("[Mic] cleanup");
      recogRef.current?.stop();
    };
  }, []);

  const buildRecognizer = (code) => {
    console.log("[Mic] build", code || "<auto>");
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) throw new Error("Web Speech API unavailable in this browser.");

    const r = new SR();
    if (code) r.lang = code;
    r.continuous = false;
    r.interimResults = true;
    r.maxAlternatives = 1;

    r.onresult = (event) => {
      const result = event.results[event.resultIndex];
      const transcript = result[0].transcript;
      const isFinal = result.isFinal;

      console.log("[Mic] result:", transcript, "final:", isFinal);
      onTranscript?.(transcript, isFinal);

      if (isFinal) {
        r.stop();
        setOn(false);
      }
    };

    r.onerror = (e) => {
      console.error("[Mic] error:", e.error, "lang:", code || "<auto>");
      r.stop();
      setOn(false);

      if (e.error === "language-not-supported" && code) {
        try { buildRecognizer("").start(); }
        catch (f) { setError(f.message); }
      } else {
        setError(e.error);
      }
    };

    r.onend = () => setOn(false);
    return r;
  };

  const toggleMic = () => {
    setError(null);

    if (isListening && recogRef.current) {
      recogRef.current.stop();
      return;
    }

    try {
      const recog = buildRecognizer(lang);
      recogRef.current = recog;
      recog.start();
      setOn(true);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="p-4">
      <label>Language:</label>
      <select
        className="border rounded mr-2"
        style={{ width: '100%', height: '2.5rem', padding: '0.5rem' }}
        value={lang}
        onChange={e => setLang(e.target.value)}
      >
        {LANGS.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
        <option value="">Auto-detect</option>
      </select>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={toggleMic}
          className={`p-4 rounded-full text-white ${
            isListening ? "bg-red-500" : "bg-blue-500"
          }`}
        >
          {isListening ? "Listening…" : "🎤 Speak"}
        </button>
      </div>

      {error && (
        <p className="mt-3 p-2 bg-red-50 text-red-600 rounded">{error}</p>
      )}
    </div>
  );
}
