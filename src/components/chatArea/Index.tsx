import React, { useState } from 'react';
import { TextField, IconButton, InputAdornment, Box, Typography, Paper, Avatar } from '@mui/material';
import { FaArrowRight } from 'react-icons/fa'; 
import { BsFillPersonFill } from 'react-icons/bs'; 
import { MdPerson } from 'react-icons/md';


interface ChatProps {
  width: string;
  messages: { text: string; sender: 'user' | 'system' }[];
  setMessages: any;
}

const Chat: React.FC<ChatProps> = ({ width, messages, setMessages }) => {

  return (
    <Box display="flex" flexDirection="column" alignItems="center" width={width} p={2}>
      <Box
        display="flex"
        flexDirection="column"
        width="100%"
        p={2}
        style={{
          backgroundColor: 'transparent',
          borderRadius: '10px',
          height: 'auto',
          overflowY: 'auto',
        }}
      >
        {messages.map((message, index) => (
          <Box
            key={index}
            display="flex"
            justifyContent={message.sender === 'user' ? 'flex-end' : 'flex-start'}
            mb={2}
            mx={4}
            alignItems="center"
          >
            {message.sender === 'system' && (
              <Box display="flex" alignItems="center" mr={2}>
                <Avatar sx={{ bgcolor: '#7BFF00BF' }}>
                  <BsFillPersonFill />
                </Avatar>
                <Paper
                  elevation={3}
                  sx={{
                    backgroundColor: 'transparent',
                    color:'white',
                    padding: '8px 16px',
                    borderRadius: '15px 15px 0px 15px', 
                    maxWidth: '400px',
                    wordWrap: 'break-word',
                    position: 'relative',
                    left: "10px",
                    border: "1px solid gray"
                  }}
                >
                  <Typography>{message.text}</Typography>
                </Paper>
              </Box>
            )}
            {message.sender === 'user' && (
              <Box display="flex" alignItems="center" mb={2} mx={4}>
                <Paper
                  elevation={3}
                  sx={{
                    backgroundColor: 'transparent',
                    padding: '8px 16px',
                    borderRadius: '15px 15px 15px 0px',
                    maxWidth: '400px',
                    wordWrap: 'break-word',
                    position: 'relative',
                    right: "10px",
                    color:'white',
                    border: "1px solid gray"
                  }}
                >
                  <Typography>{message.text}</Typography>
                </Paper>
                <Avatar sx={{ bgcolor: '#7BFF00BF' }}>
                  <MdPerson />
                </Avatar>
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Chat;
