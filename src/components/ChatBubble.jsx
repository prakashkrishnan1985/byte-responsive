export default function ChatBubble({ role, content, audioPath }) {
    const playAudio = () => {
      if (audioPath) {
        new Audio(`http://localhost:8000/${audioPath}`).play();
      }
    };
  
    return (
      <div className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}>
        <div className={`p-3 rounded-xl max-w-xs ${role === "user" ? "bg-blue-400 text-white" : "bg-gray-300 text-black"}`}>
          {content}
          {role === "assistant" && audioPath && (
            <button onClick={playAudio} className="ml-2 text-sm underline">🔊 Replay</button>
          )}
        </div>
      </div>
    );
  }
  