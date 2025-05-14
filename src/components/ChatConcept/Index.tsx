import React, { useEffect, useState, useRef } from 'react';
import { useChat } from '../../Hooks/useChat';
import { Button, TextField, Box, Paper, Typography, IconButton, Avatar } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ReplyIcon from '@mui/icons-material/Reply';
import CloseIcon from '@mui/icons-material/Close'; 

const ChatConcept = ({ conceptId, token, onClose }: { conceptId: string, token: string, onClose: () => void }) => { 
  const { message, error, connectChat, sendMessageToChat, deleteMessageFromChat, disconnect } = useChat(conceptId, token);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null); 

  useEffect(() => {
    connectChat();

    return () => {
      disconnect();
    };
  }, [conceptId, token]);

  useEffect(() => {
    if (message && Array.isArray(message)) {
      setMessages(message);
    } else if (message) {
      setMessages((prevMessages) => [...prevMessages, message]);
    }
  }, [message]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      sendMessageToChat(inputMessage);
      setInputMessage('');
    }
  };

  const handleDeleteMessage = (deleteChatId: string) => {
    deleteMessageFromChat(deleteChatId);
    setMessages((prevMessages) => prevMessages.filter(msg => msg.chat_id !== deleteChatId));
  };

  const handleReplyToMessage = (messageId: string) => {
    setInputMessage(`@${messageId} `);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage(); 
    }
  };

  const getAvatar = (name: string) => {
    const initials = name.split(' ').map(word => word[0]).join('');
    return initials || 'U';
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 600, margin: 'auto', padding: 2 }}>
      {/* Close Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton onClick={onClose} color="default">
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ maxHeight: '400px', overflowY: 'auto', marginBottom: 2 }}>
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              justifyContent: msg.isReply ? 'flex-end' : 'flex-start',
              marginBottom: 1,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ marginRight: 1 }}>{getAvatar(msg.name)}</Avatar>
            </Box>
            <Paper
              sx={{
                padding: 2,
                maxWidth: '70%',
                backgroundColor: msg.isReply ? '#128C7E' : '#E4E6EB', 
                color: msg.isReply ? 'white' : 'black',
                borderRadius: 2,
                boxShadow: 2,
                position: 'relative',
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {msg.name} 
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', marginTop: 0.5 }}>
                {msg.message}
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 1 }}>
                <IconButton onClick={() => handleReplyToMessage(msg.chat_id)} color="primary" size="small">
                  <ReplyIcon fontSize="small" />
                </IconButton>

                <IconButton onClick={() => handleDeleteMessage(msg.chat_id)} color="secondary" size="small">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>

              <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'gray', marginTop: 1 }}>
                {msg.time}
              </Typography>
            </Paper>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextField
          label="Type your message"
          variant="outlined"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          fullWidth
          onKeyDown={handleKeyPress}
          sx={{ marginRight: 1 }}
        />
        <Button
          onClick={handleSendMessage}
          variant="contained"
          color="primary"
          sx={{ height: '100%' }}
        >
          Send
        </Button>
      </Box>

      {/* Error message */}
      {error && <Typography color="error" sx={{ marginTop: 2 }}>Error: {error.message}</Typography>}
    </Box>
  );
};

export default ChatConcept;
