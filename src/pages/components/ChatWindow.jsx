import React from 'react';
import './App.css';

const ChatWindow = ({ messages, typingMessage, isLoading }) => {
  return (
    <div className="card">
      <h2 className="section-title">Conversation</h2>
      
      <div className="bg-white rounded-lg p-4 min-h-[300px] max-h-[400px] overflow-auto">
        {messages.length === 0 ? (
          <div className="text-gray-400 italic text-center mt-12">
            Start speaking to begin a conversation
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`px-4 py-3 rounded-lg max-w-[80%] ${
                    msg.role === 'user'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  
                  {msg.audioPath && (
                    <div className="mt-2">
                      <audio 
                        controls 
                        src={`http://localhost:8000${msg.audioPath}`}
                        className="w-full h-8"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {typingMessage && (
              <div className="flex justify-start">
                <div className="px-4 py-3 rounded-lg max-w-[80%] bg-gray-100 text-gray-800">
                  <p className="whitespace-pre-wrap">{typingMessage}</p>
                </div>
              </div>
            )}
            
            {isLoading && !typingMessage && (
              <div className="flex justify-start">
                <div className="px-4 py-3 rounded-lg bg-gray-100">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;