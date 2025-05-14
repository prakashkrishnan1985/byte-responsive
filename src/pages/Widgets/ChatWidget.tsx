import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  TextField,
  Grid,
  Box,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import "./index.scss";
import { useWidget } from "../../providers/WidgetsProvider";
import {
  updateWidget,
  PayloadUpdateWidget,
  postImage,
} from "../../services/widgetsService";
import { toast, ToastContainer } from "react-toastify";
import { baseURL } from "../../services/axiosConfig";
import { minify } from "terser";

const ChatWidget: React.FC = () => {
  const [title, setTitle] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [linkedTo, setLinkedTo] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [generatedScript, setGeneratedScript] = useState(
    "Sample script will be generated here."
  );
  const [chatScript, setChatScript] = useState(".");
  const [color, setColor] = useState("#227ebb");
  const [domainName, setDomainName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const { widgetId, imgConfigPayload, uploadImgUrl } = useWidget();

  const handleGenerateScript = async () => {
    const payload: PayloadUpdateWidget = {
      description,
      header_title: title,
      widget_type: "chat_box",
      ai_type: linkedTo,
      intial_message: welcomeMessage,
      color_code: color,
      website_domain: domainName,
      script: chatScript,
      image_url: "imageUrl",
      widget_id: widgetId,
    };

    const loadingToast = toast.loading("Saving your data...");

    try {
      const response = await updateWidget(payload);
      toast.dismiss(loadingToast);
      if (response) {
        toast.success("Widget updated successfully!");
      }
    } catch (error) {
      toast.error("Failed to update widget");
      console.error("Error during widget update:", error);
    }

    setDialogOpen(true);
  };

  const handleLogoChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files ? event.target.files[0] : null;
    const updatedImgConfigPayload = { ...(imgConfigPayload as any), file };
    try {
      await postImage(uploadImgUrl, updatedImgConfigPayload);
    } catch (error) {
      console.log("Error in uploading image:", error);
    }
    setLogo(file);
  };

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setColor(event.target.value);
  };

  const handleDomainNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDomainName(event.target.value);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const { name, description, selectedOption } = useWidget();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        height: "auto",
        padding: 4,
        overflowY: "visible",
      }}
    >
      {/* Left Panel (Form) */}
      <Grid
        container
        spacing={2}
        direction="column"
        xs={6}
        sx={{
          width: "50%",
          background: "white",
          padding: 3,
          boxSizing: "border-box",
          borderRadius: "8px",
          boxShadow: 2,
        }}
      >
        <Grid item>
          <h1>{name || "Title"}</h1>
          <p>{description || "Description goes here"}</p>
        </Grid>

        <Grid item>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12}>
              <InputLabel htmlFor="title">Header Title</InputLabel>
            </Grid>
            <Grid item xs={12}>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  padding: "8px",
                }}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12}>
              <InputLabel htmlFor="welcome-message">Welcome Message</InputLabel>
            </Grid>
            <Grid item xs={12}>
              <Input
                id="welcome-message"
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
                fullWidth
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  padding: "8px",
                }}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12}>
              <InputLabel htmlFor="domain-name">Domain Name</InputLabel>
            </Grid>
            <Grid item xs={12}>
              <Input
                id="domain-name"
                value={domainName}
                onChange={handleDomainNameChange}
                fullWidth
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  padding: "8px",
                }}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <FormControl fullWidth>
            <InputLabel>Linked To</InputLabel>
            <Select
              value={linkedTo}
              onChange={(e) => setLinkedTo(e.target.value)}
              fullWidth
              sx={{
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "8px",
              }}
            >
              <MenuItem value="rag">rag</MenuItem>
              <MenuItem value="llm">llm</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12}>
              <InputLabel htmlFor="color">Color</InputLabel>
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="color"
                type="color"
                value={color}
                onChange={handleColorChange}
                fullWidth
                sx={{
                  borderRadius: "4px",
                  padding: "0px",
                  height: "3rem",
                }}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12}>
              <InputLabel htmlFor="upload-logo">Upload Logo</InputLabel>
            </Grid>
            <Grid item xs={12}>
              <Input
                id="upload-logo"
                type="file"
                onChange={handleLogoChange}
                fullWidth
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Button
            variant="contained"
            color="success"
            sx={{
              color: "white",
              "&:hover": {
                backgroundColor: "#7bff0033",
                opacity: 0.9,
              },
            }}
            onClick={handleGenerateScript}
          >
            Generate Script
          </Button>
        </Grid>
      </Grid>

      <LivePreview
        welcomeMessage={welcomeMessage}
        linkedTo={linkedTo}
        logo={logo}
        color={color}
        title={title}
        selectedOption={selectedOption}
        setGeneratedScript={setGeneratedScript}
        setChatScript={setChatScript}
      />

      <GeneratedScriptDialog
        open={dialogOpen}
        generatedScript={generatedScript}
        onClose={handleCloseDialog}
      />
    </Box>
  );
};

const LivePreview: React.FC<{
  welcomeMessage: string;
  linkedTo: string;
  logo: File | null;
  color: string;
  title: string;
  selectedOption: string;
  setGeneratedScript: any;
  setChatScript: any;
}> = ({
  welcomeMessage,
  linkedTo,
  logo,
  color,
  title,
  selectedOption,
  setGeneratedScript,
  setChatScript,
}) => {
  const logoUrl = logo ? URL.createObjectURL(logo) : "";

  const { widgetId } = useWidget();


  const setScript=async (chatBotScript:any)=>{
    try {
      const result = await minify(chatBotScript);
      if ((result as any).error) {
        console.error("Minification error:", (result as any).error);
      } else {
        setGeneratedScript((result as any).code);
      }
    } catch (error) {
      console.error("Error during minification:", error);
    }
  }

  useEffect(() => {
    // Inject HTML, CSS, and JS inside the div with class 'chat-bot-ejected'
    const scriptContent = `
    <button class='chatbot__button'>
        <img src=${logoUrl} alt="icon" class="chatbot__button-icon" />
    </button>
      <div class='chatbot'>
        <div class='chatbot__header'>
          <p class='chatbox__title'>${title || "Chat with us!"}</p>
          <span class='material-symbols-outlined'>close</span>
        </div>
       <ul class="chatbot__box">
        <li class="chatbot__chat incoming">
        <span class="material-symbols-outlined">face_retouching_natural</span> 
            <div class="chatbot__chat-content"><p>${
              welcomeMessage ||
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"
            }</p>
            </div>
             </div>
        </li>
        </ul>
        <div class='chatbot__input-box'>
          <textarea
            class='chatbot__textarea'
            placeholder='Enter a message...'
            required
          ></textarea>
          <span id='send-btn' class='material-symbols-outlined'>send</span>
        </div>
      </div>
    `;

    // Inject the HTML content into the 'chat-bot-ejected' div
    const divElement = document.querySelector(".chat-bot-ejected");
    if (divElement) {
      divElement.innerHTML = scriptContent;
    }

    // Inject the CSS styles dynamically (if needed)
    const style = document.createElement("style");
    style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
        * {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
        }
        .no-animation {
        animation: none !important;
        }
        .chatbot__button {
        z-index: 100;
        position: relative;
        top:387px;
        left:15px;
        width: 50px;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: ${color};
        color: #f3f7f8;
        border: none;
        border-radius: 50%;
        outline: none;
        cursor: pointer;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
        animation: bounce 2s infinite ease-in-out, pulse 2s infinite ease-in-out;
        }
        .chatbot__button img{
            width: 50px;
            height: 50px;
        }

        @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
            transform: translateY(0); 
        }
        40% {
            transform: translateY(-10px); 
        }
        60% {
            transform: translateY(-5px); 
        }
        }

        @keyframes pulse {
        0%, 100% {
            transform: scale(1); 
        }
        50% {
            transform: scale(1.1); 
        }
        }

        @keyframes bounceAndPulse {
        0%, 20%, 50%, 80%, 100% {
            transform: translateY(0) scale(1); 
        }
        40% {
            transform: translateY(-10px) scale(1.1); 
        }
        60% {
            transform: translateY(-5px) scale(1.05); 
        }
        }

        .chatbot__button {
        animation: bounceAndPulse 2s infinite ease-in-out; 
        }

        .chatbot__button span {
        position: absolute;
        }
        .show-chatbot .chatbot__button span:first-child,
        .chatbot__button span:last-child {
        //   opacity: 0;
        }
        .show-chatbot .chatbot__button span:last-child {
        opacity: 1;
        }
        .chatbot {
        z-index: 100;
        position: relative;
        bottom: 40px;
        left: 180px;
        width: 360px;
        background-color: #f3f7f8;
        border-radius: 15px;
        box-shadow: 0 0 128px 0 rgba(0, 0, 0, 0.1) 0 32px 64px -48px rgba(0, 0, 0, 0.5);
        //   transform: scale(0.5);
        transition: transform 0.3s ease;
        overflow: hidden;
        //   opacity: 0;
        pointer-events: none;
        }
        .show-chatbot .chatbot {
        opacity: 1;
        pointer-events: auto;
        transform: scale(1);
        }
        .chatbot__header {
        position: relative;
        background-color: ${color};
        text-align: center;
        padding: 10px 0;
        }
        .chatbot__header span {
        display: none;
        position: absolute;
        top: 50%;
        right: 20px;
        color: #202020;
        transform: translateY(-50%);
        cursor: pointer;
        }
        .chatbox__title {
        font-size: 1.2rem;
        color: #f3f7f8;
        }
        .chatbot__box {
        background-color: #f3f7f8;
        height: 377px;
        overflow-y: auto;
        padding: 20px 20px 100px;
        }
        .chatbot__chat {
        display: flex;
        }
        .chatbot__chat p {
        /* max-width: 90%; */
        font-size: 0.95rem;
        white-space: pre-wrap;
        color: ${color}; /* #202020; */
        background-color: #fff; /* #019ef9; */
        border-radius: 10px 10px 0 10px;
        padding: 12px 16px;
        margin: 0px !important;
        }
        .chatbot__chat p.error {
        color: #721c24;
        background: #f8d7da;
        }
        .incoming p {
        color: #fff;
        background: ${color};
        border-radius: 10px 10px 10px 0;
        }
        .incoming span {
        width: 32px;
        height: 32px;
        line-height: 32px;
        color: #f3f7f8;
        background-color: ${color};
        border-radius: 4px;
        text-align: center;
        /*align-self: flex-end;*/
        margin: 0 10px 7px 0;
        }
        .outgoing {
        justify-content: flex-end;
        margin: 20px 0;
        }
        .incoming {
        margin: 20px 0;
        }
        .chatbot__input-box {
        background-color: #fff;
        position: absolute;
        bottom: 0;
        width: 100%;
        display: flex;
        gap: 5px;
        align-items: center;
        border-top: 1px solid ${color};
        background: #f3f7f8;
        padding: 5px 20px;
        }
        .chatbot__chat > span {
        flex-shrink: 0; /* Prevent the icon from shrinking */
        }

        .chatbot__chat span.material-symbols-outlined {
        font-size: 24px; /* Adjust the size of the icon as needed */
        margin-right: 8px; /* Space between icon and text */
        vertical-align: middle; /* Ensure icon aligns with middle of text */
        }
        .chatbot__textarea {
        width: 100%;
        min-height: 55px;
        max-height: 180px;
        font-size: 0.95rem;
        padding: 16px 15px 16px 0;
        color: #202020;
        border: none;
        outline: none;
        resize: none;
        background: transparent;
        }

        .chatbot__textarea:hover {
        border: none;
        outline: none;
        }
        .chatbot__textarea:focus {
        border: none;
        outline: none;
        }

        .chatbot__textarea::placeholder {
        font-family: 'Poppins', sans-serif;
        }
        .chatbot__input-box span {
        font-size: 1.75rem;
        color: #202020;
        cursor: pointer;
        visibility: hidden;
        }
        .chatbot__textarea:valid ~ span {
        visibility: visible;
        }

        @media (max-width: 490px) {
        .chatbot {
            right: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
            border-radius: 0;
        }
        .chatbot__box {
            height: 90%;
        }
        .chatbot__header span {
            display: inline;
        }
        }`;

    document.head.appendChild(style);

    // Optionally inject JavaScript for dynamic behavior
    const script = document.createElement("script");
    script.innerHTML = `
      document.getElementById('send-btn')?.addEventListener('click', () => {
        const textarea = document.querySelector('.chatbot__textarea');
        const chatBox = document.querySelector('.chatbot__box');
        if (textarea && chatBox) {
          const message = textarea.value;
          const newMessage = document.createElement('li');
          newMessage.className = 'chatbot__chat outgoing';
          newMessage.innerHTML = '<p>' + message + '</p>';
          chatBox.appendChild(newMessage);
          textarea.value = '';  // Clear the textarea
        }
      });
    `;
    document.body.appendChild(script);
    //Cleanup on component unmount

    //mini script to call main script
    const miniScript = `
      (function() {        
          // url goes here
          var scriptUrl = '${baseURL}/v1/widget/${widgetId}'; 

          var scriptElement = document.createElement('script');

          fetch(scriptUrl)
              .then(function(response) {
                  if (!response.ok) {
                      throw new Error('Failed to fetch the script');
                  }
                  return response.text();
              })
              .then(function(scriptContent) {
                  //set the content to the script element
                  scriptElement.text = scriptContent;
                  
                  //Append the script to the head or body of the page
                  document.head.appendChild(scriptElement); // You can also append to document.body
                  console.log('Seach Script successfully loaded and appended to the page.');
              })
              .catch(function(error) {
                  console.error('Error loading the script:', error);
              });
      })();`;

    //main chat bot script
    const chatBotScript = `let chatHTML = \`<button class="chatbot__button">
<span class="material-symbols-outlined">face_retouching_natural</span>
<span class="material-symbols-outlined">close</span>
</button>
<div class="chatbot">
<div class="chatbot__header">
  <p class="chatbox__title"> ${title || "Chat with us!"}</p>
  <span class="material-symbols-outlined">close</span>
</div>
<ul class="chatbot__box">
 <!--  <li class="chatbot__chat incoming">
    TODO <span class="material-symbols-outlined">support_agent  smart_toy auto_awesome flare</span> 
    <span class="material-symbols-outlined">face_retouching_natural</span>
    <p>Hi there. How can I help you today?</p>
  </li>-->
 <!-- <li class="chatbot__chat outgoing">
    <p>...</p> 
  </li> -->
</ul>
<div class="chatbot__input-box">
  <textarea
    class="chatbot__textarea"
    placeholder="Enter a message..."
    required
  ></textarea>
  <span id="send-btn" class="material-symbols-outlined">send</span>
</div>
</div>\`
let userMessage;

let style = document.createElement('style');
style.textContent = \`
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
* {
padding: 0;
margin: 0;
box-sizing: border-box;
}
.no-animation {
animation: none !important;
}
.chatbot__button {
z-index: 100;
position: fixed;
bottom: 35px;
right: 40px;
width: 50px;
height: 50px;
display: flex;
justify-content: center;
align-items: center;
background: ${color};
color: #f3f7f8;
border: none;
border-radius: 50%;
outline: none;
cursor: pointer;
box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
animation: bounce 2s infinite ease-in-out, pulse 2s infinite ease-in-out;
}

@keyframes bounce {
0%, 20%, 50%, 80%, 100% {
transform: translateY(0); 
}
40% {
transform: translateY(-10px); 
}
60% {
transform: translateY(-5px); 
}
}

@keyframes pulse {
0%, 100% {
transform: scale(1); 
}
50% {
transform: scale(1.1); 
}
}

@keyframes bounceAndPulse {
0%, 20%, 50%, 80%, 100% {
transform: translateY(0) scale(1); 
}
40% {
transform: translateY(-10px) scale(1.1); 
}
60% {
transform: translateY(-5px) scale(1.05); 
}
}

.chatbot__button {
animation: bounceAndPulse 2s infinite ease-in-out; 
}

.chatbot__button span {
position: absolute;
}
.show-chatbot .chatbot__button span:first-child,
.chatbot__button span:last-child {
opacity: 0;
}
.show-chatbot .chatbot__button span:last-child {
opacity: 1;
}
.chatbot {
z-index: 100;
position: fixed;
bottom: 100px;
right: 40px;
width: 420px;
background-color: #f3f7f8;
border-radius: 15px;
box-shadow: 0 0 128px 0 rgba(0, 0, 0, 0.1) 0 32px 64px -48px rgba(0, 0, 0, 0.5);
transform: scale(0.5);
transition: transform 0.3s ease;
overflow: hidden;
opacity: 0;
pointer-events: none;
}
.show-chatbot .chatbot {
opacity: 1;
pointer-events: auto;
transform: scale(1);
}
.chatbot__header {
position: relative;
background-color: ${color};
text-align: center;
padding: 10px 0;
}
.chatbot__header span {
display: none;
position: absolute;
top: 50%;
right: 20px;
color: #202020;
transform: translateY(-50%);
cursor: pointer;
}
.chatbox__title {
font-size: 1.2rem;
color: #f3f7f8;
}
.chatbot__box {
background-color: #f3f7f8;
height: 510px;
overflow-y: auto;
padding: 20px 20px 100px;
}
.chatbot__chat {
display: flex;
}
.chatbot__chat p {
font-size: 0.95rem;
white-space: pre-wrap;
color: ${color};
background-color: #fff;
border-radius: 10px 10px 0 10px;
padding: 12px 16px;
margin: 0px !important;
}
.chatbot__chat p.error {
color: #721c24;
background: #f8d7da;
}
.incoming p {
color: #fff;
background: ${color};
border-radius: 10px 10px 10px 0;
}
.incoming span {
width: 32px;
height: 32px;
line-height: 32px;
color: #f3f7f8;
background-color: ${color};
border-radius: 4px;
text-align: center;
margin: 0 10px 7px 0;
}
.outgoing {
justify-content: flex-end;
margin: 20px 0;
}
.incoming {
margin: 20px 0;
}
.chatbot__input-box {
background-color: #fff;
position: absolute;
bottom: 0;
width: 100%;
display: flex;
gap: 5px;
align-items: center;
border-top: 1px solid ${color};
background: #f3f7f8;
padding: 5px 20px;
}
.chatbot__chat > span {
flex-shrink: 0; 
}

.chatbot__chat span.material-symbols-outlined {
font-size: 24px; 
margin-right: 8px; 
vertical-align: middle; 
}
.chatbot__textarea {
width: 100%;
min-height: 55px;
max-height: 180px;
font-size: 0.95rem;
padding: 16px 15px 16px 0;
color: #202020;
border: none;
outline: none;
resize: none;
background: transparent;
}

.chatbot__textarea:hover {
border: none;
outline: none;
}
.chatbot__textarea:focus {
border: none;
outline: none;
}

.chatbot__textarea::placeholder {
font-family: 'Poppins', sans-serif;
}
.chatbot__input-box span {
font-size: 1.75rem;
color: #202020;
cursor: pointer;
visibility: hidden;
}
.chatbot__textarea:valid ~ span {
visibility: visible;
}
\`;

document.head.appendChild(style);

const createChatLi = (message, className) => {
  const chatLi = document.createElement('li');
  chatLi.classList.add('chatbot__chat', className);
  let chatContent =
    className === 'outgoing'
      ? \`<p></p>\`
      : \`<span class="material-symbols-outlined">face_retouching_natural</span> <div class="chatbot__chat-content"><p>${
        welcomeMessage ||
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"
      }</p></div>\`;
  chatLi.innerHTML = chatContent;
  chatLi.querySelector('p').textContent = message;
  return chatLi;
};

    var ws = new WebSocket("wss://ug0aevn9mi.execute-api.ap-southeast-2.amazonaws.com/development/");
     ws.onopen = () => {
            console.log('connection established...')
     }
    ws.onmessage = (event) => {
            console.log("event: ", event)

     }
    function sendMessage(userMessage, messageElement) {
            console.log("userMessage", userMessage);
            const chatBox = document.getElementById('chat-box');
            const userInput = document.getElementById('user-input');
            const message = userMessage;
            ws.send(JSON.stringify({"action": "chat", "message": message}))
            ws.onmessage = function (event) {
                console.log({event})

                if (event.data) {
                    messageElement.textContent = event.data;
                }

            };
    }


const generateResponse = async (incomingChatLi, userMessage) => {
  // const API_URL = 'https://booxhiqa.com/query?index_name=booxhi';
  const messageElement = incomingChatLi.querySelector('p');

  const loadingMessages = [
    'Firing up the engines...',
    'Turning the cosmic wheels...',
    'Consulting the stars...',
    'Opening the quantum gates...',
    'Channeling the AI wisdom...'
  ];

  // Cycle through loading messages with a delay
  let currentIndex = 0;
  const loadingInterval = setInterval(() => {
    messageElement.textContent = loadingMessages[currentIndex];
    currentIndex = (currentIndex + 1) % loadingMessages.length;
  }, 1000);

  try {
    sendMessage(userMessage, messageElement)
    clearInterval(loadingInterval);

  } catch (error) {
    clearInterval(loadingInterval);
    messageElement.textContent = 'Sorry, I couldn’t fetch a response at the moment. Please try again.';
  }
};


const handleChat = (chatInput, inputInitHeight, chatBox, isFirstTime) => {
  userMessage = chatInput?.value?.trim();
  if (!userMessage && !isFirstTime) return;
  chatInput.value = '';
  chatInput.style.height = inputInitHeight+'px';

  if (isFirstTime) {
    // Show welcome message and suggestions
    const welcomeMessage = "Hey there! I'm Byte, the one and only child of ByteSizeAI, and I thrive on your attention. I’d love for you to give me some! Why not begin with one of the suggestions below, and I'll happily jump in to respond?";
    const welcomeLi = createChatLi(welcomeMessage, 'incoming');
    chatBox.appendChild(welcomeLi);
    chatBox.scrollTo(0, chatBox.scrollHeight);
  } else {
    // Normal chat handling
    chatBox.appendChild(createChatLi(userMessage, 'outgoing'));
    chatBox.scrollTo(0, chatBox.scrollHeight);

    setTimeout(() => {
      const incomingChatLi = createChatLi('...', 'incoming');
      chatBox.appendChild(incomingChatLi);
      chatBox.scrollTo(0, chatBox.scrollHeight);
      generateResponse(incomingChatLi, userMessage);  // Trigger API call for response
    }, 600);
  }
};


document.addEventListener('DOMContentLoaded', () => {
  let stylesheets = \`<link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0"
    />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@48,400,1,0"
    />\`

  document.head.insertAdjacentHTML('beforebegin', stylesheets);
  document.body.insertAdjacentHTML('beforeend', chatHTML);
  const chatbotToggle = document.querySelector('.chatbot__button');
  const sendChatBtn = document.querySelector('.chatbot__input-box span');
  const chatInput = document.querySelector('.chatbot__textarea');
  const chatBox = document.querySelector('.chatbot__box');
  const chatbotCloseBtn = document.querySelector('.chatbot__header span');
  const inputInitHeight = chatInput?.scrollHeight;
  chatInput?.addEventListener('input', () => {
    chatInput.style.height = inputInitHeight+'px';
    chatInput.style.height = chatInput.scrollHeight+'px';
  });
  chatInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && window.innerWidth > 800) {
      e.preventDefault();
      handleChat(chatInput, inputInitHeight, chatBox, false);
    }
  });

chatbotToggle.addEventListener('click', () => {
  document.body.classList.toggle('show-chatbot');

  if (document.body.classList.contains('show-chatbot')) {
    chatbotToggle.classList.add('no-animation');
    const chatInputForFirstTime = document.querySelector('.chatbot__textarea');
    const childListItems = chatBox.querySelectorAll('li');

    // Detect if it's the first time the chatbot opens
    let firstTimeVisitor = childListItems?.length <= 0;
    if (firstTimeVisitor) {
      handleChat(chatInputForFirstTime, inputInitHeight, chatBox, true);  // Show welcome message and suggestions
    }
  } else {
    chatbotToggle.classList.remove('no-animation');
    clearInterval(changePhrase);
    }
  });

  chatbotCloseBtn.addEventListener('click', () => {
    document.body.classList.remove('show-chatbot');
    chatbotToggle.classList.remove('no-animation');
  });

  sendChatBtn?.addEventListener('click', handleChat);

  const phrases = [
    "Let's Chat and Connect",
    "Talk with Us Now",
    "Start Your Conversation Here",
    "We're Here for You",
    "Chat with Us Today",
    "Your Help Starts Here",
    "Join the Chat Now",
    "Let's Solve It Together",
    "Your Support Awaits Here",
    "Say Hello, We're Ready",
    "Ask Away, We’re Here",
    "Chat for Quick Help",
    "Let’s Solve It Together",
    "Ask, Learn, and Explore",
    "We're Here to Help",
    "Lets Engage, Learn, and Grow"
  ];

  const titleElement = document.querySelector('.chatbox__title');
  let currentPhraseIndex = 0;

  const changePhrase = () => {
    if (titleElement) {
      titleElement.textContent = phrases[currentPhraseIndex];
      currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
    }
  };
  //TODO update the interval
  //setInterval(changePhrase, 3000);
});
`;
    setScript(chatBotScript)
    setChatScript(chatBotScript);
    return () => {
      document.head.removeChild(style);
      document.body.removeChild(script);
    };
  }, [color, title, logo, welcomeMessage]);

  return (
    <Grid
      xs={6}
      sx={{
        width: "50%",
        backgroundColor: "#ffffff",
        padding: 3,
        boxSizing: "border-box",
        borderRadius: "8px",
        boxShadow: 2,
        alignItems: "flex-start",
      }}
    >
      <h2>Live Preview</h2>
      {selectedOption === "chatWindow" && (
        <div className="chat-bot-ejected"></div>
      )}
      {selectedOption === "customSearch" && (
        <div id="search-box-container"></div>
      )}
      <div>
        <p>
          <strong>Preview:</strong>
        </p>
        <div
          style={{
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            backgroundColor: "#fff",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h4>{welcomeMessage || "Your Welcome Message"}</h4>
          <p>
            Linked To: <strong>{linkedTo || "Nothing linked"}</strong>
          </p>
          {logo && (
            <img
              src={logoUrl}
              alt="Logo"
              style={{ maxWidth: "80px", marginTop: "10px" }}
            />
          )}
        </div>
      </div>
    </Grid>
  );
};

// Dialog Popup
const GeneratedScriptDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  generatedScript: string;
}> = ({ open, onClose, generatedScript }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Generated Script</DialogTitle>
      <DialogContent>
        <TextField
          value={generatedScript}
          fullWidth
          multiline
          rows={8}
          InputProps={{
            readOnly: true,
          }}
          sx={{
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            navigator.clipboard.writeText(generatedScript);
          }}
          color="primary"
        >
          Copy Code
        </Button>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChatWidget;
