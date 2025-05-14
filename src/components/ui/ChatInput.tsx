import React, { useState } from "react";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { withChat } from "../../services/conceptService";
import { toast } from "react-toastify";
import { useMyContext } from "../../providers/MyContext";

interface ChatInputProps {
  width: string;
  inputText: string;
  setInputText: any;
  setMessages: any;
}

const ChatInput: React.FC<ChatInputProps> = ({
  width,
  inputText,
  setInputText,
  setMessages,
}) => {
  const navigate = useNavigate();
  const handleSend = () => {
    if (inputText.trim()) {
      handleChatBtnClick(inputText);
      setInputText("");
      navigate("/IdealiseChat");
    }
  };

  const { setPreviewData } = useMyContext();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  const handleChatBtnClick = async (input: string) => {
    try {
      // Step 1: Send the user's input immediately
      setMessages((prevMessages: any) => [
        ...prevMessages,
        { text: input, sender: "user" },
      ]);

      setMessages((prevMessages: any) => [
        ...prevMessages,
        {
          text: "Generating your app template, please wait....",
          sender: "system",
        },
      ]);

      const responseSocket: any = await withChat(input);

      if (responseSocket?.error) {
        setMessages((prevMessages: any) => [
          ...prevMessages,
          {
            text: responseSocket?.error,
            sender: "system",
          },
        ]);
      } else if (responseSocket?.usherResponse) {
        setPreviewData(responseSocket?.usherResponse);

        setMessages((prevMessages: any) => [
          ...prevMessages,
          {
            text: "App template generated successfully!",
            sender: "system",
          },
        ]);
      } else {
        setMessages((prevMessages: any) => [
          ...prevMessages,
          {
            text: "App template generated successfully!",
            sender: responseSocket,
          },
        ]);
      }
    } catch (error) {
      // Handle errors and display an error message
      toast.error(`Error in websocket call: ${error}`);
      console.error("Error in websocket call:", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "0px 10px",
        width: width,
      }}
    >
      <TextField
        placeholder="Generate better copywriting for products for more compelling and tailored descriptions."
        variant="standard"
        sx={{
          flexGrow: 1,
          color: "white",
          borderRadius: "8px",
          marginRight: 2,
        }}
        fullWidth
        value={inputText}
        onChange={handleChange}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSend();
          }
        }}
        multiline
        maxRows={4}
        InputProps={{
          disableUnderline: true,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={handleSend}
                edge="end"
                style={{
                  backgroundColor: "#E5E5E5",
                  borderRadius: "50%",
                  padding: "6px",
                }}
              >
                <FaArrowRight size={20} />
              </IconButton>
            </InputAdornment>
          ),
          style: { color: "white", textDecoration: "none" },
        }}
      />
    </div>
  );
};

export default ChatInput;
