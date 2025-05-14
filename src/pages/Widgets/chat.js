let chatHTML = `<button class="chatbot__button">
    <span class="material-symbols-outlined">face_retouching_natural</span>
    <span class="material-symbols-outlined">close</span>
  </button>
  <div class="chatbot">
    <div class="chatbot__header">
      <p class="chatbox__title">Chat with us!</p>
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
  </div>`
let userMessage;

let style = document.createElement('style');
style.textContent = `
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
  background: #227ebb;
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
  background-color: #227ebb;
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
  /* max-width: 90%; */
  font-size: 0.95rem;
  white-space: pre-wrap;
  color: #227ebb; /* #202020; */
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
  background: #227ebb;
  border-radius: 10px 10px 10px 0;
}
.incoming span {
  width: 32px;
  height: 32px;
  line-height: 32px;
  color: #f3f7f8;
  background-color: #227ebb;
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
  border-top: 1px solid #227ebb;
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

.chatbot__suggestions-container {
  display: flex;
  flex-direction: column;
  gap: 12px; /* Space between items */
  margin-top: 10px;
  width: 90%;
}

.chatbot__suggestion {
  background-color: #fff; 
  border-radius: 20px; 
  padding: 10px 20px; 
  font-size: 15px; 
  color: #227ebbc9; 
  cursor: pointer; 
  transition: all 0.3s ease; 
  display: inline-block; 
  border: 1px solid transparent; 
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); 
}

.chatbot__suggestion:hover {
  background-color: #f1f1f1; 
  color: #0056b3; 
  border-color: #e0e0e0; 
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2); 
}

.chatbot__suggestion:active {
  background-color: #e0e0e0;
  color: #003d7a; 
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); 
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
}
`;
document.head.appendChild(style);

const createChatLi = (message, className) => {
  const chatLi = document.createElement('li');
  chatLi.classList.add('chatbot__chat', className);
  let chatContent =
    className === 'outgoing'
      ? `<p></p>`
      : `<span class="material-symbols-outlined">face_retouching_natural</span> <div class="chatbot__chat-content"><p></p></div>`;
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


    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'chatbot__suggestions-container';

  } catch (error) {
    clearInterval(loadingInterval);
    messageElement.textContent = 'Sorry, I couldn’t fetch a response at the moment. Please try again.';
  }
};


const handleChatSuggestion = (suggestion) => {
  const chatInput = document.querySelector('.chatbot__textarea');
  chatInput.value = suggestion;
  // Clear suggestions container
  const suggestionsContainer = document.querySelector('.chatbot__suggestions-container');
  if (suggestionsContainer) {
    suggestionsContainer.innerHTML = '';
  }

  handleChat(chatInput, chatInput.scrollHeight, document.querySelector('.chatbot__box'), false);
};


const handleChat = (chatInput, inputInitHeight, chatBox, isFirstTime) => {
  const suggestionsContainer = document.querySelector('.chatbot__suggestions-container');
  if (suggestionsContainer) suggestionsContainer.innerHTML = '';

  userMessage = chatInput?.value?.trim();
  if (!userMessage && !isFirstTime) return;
  chatInput.value = '';
  chatInput.style.height = `${inputInitHeight}px`;

  if (isFirstTime) {
    // Show welcome message and suggestions
    const welcomeMessage = "Hey there! I'm Byte, the one and only child of ByteSizeAI, and I thrive on your attention. I’d love for you to give me some! Why not begin with one of the suggestions below, and I'll happily jump in to respond?";
    const welcomeLi = createChatLi(welcomeMessage, 'incoming');
    chatBox.appendChild(welcomeLi);

    const suggestions = ["What does Booxhi Technologies do?", "What is ByteSizedAI", "Tell me about yourself"];
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'chatbot__suggestions-container';

    suggestions.forEach(suggestion => {
      const suggestionBtn = document.createElement('button');
      suggestionBtn.textContent = suggestion;
      suggestionBtn.className = 'chatbot__suggestion';
      suggestionBtn.onclick = () => {
        handleChatSuggestion(suggestion);
        suggestionsContainer.innerHTML = '';  // Clear suggestions once clicked
      };
      suggestionsContainer.appendChild(suggestionBtn);
    });

    const messageElementDiv = welcomeLi.querySelector("div") || welcomeLi.appendChild(document.createElement('div'));
    messageElementDiv.appendChild(suggestionsContainer);
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
  let stylesheets = `<link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0"
    />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@48,400,1,0"
    />`

  document.head.insertAdjacentHTML('beforebegin', stylesheets);
  document.body.insertAdjacentHTML('beforeend', chatHTML);
  const chatbotToggle = document.querySelector('.chatbot__button');
  const sendChatBtn = document.querySelector('.chatbot__input-box span');
  const chatInput = document.querySelector('.chatbot__textarea');
  const chatBox = document.querySelector('.chatbot__box');
  const chatbotCloseBtn = document.querySelector('.chatbot__header span');
  const inputInitHeight = chatInput?.scrollHeight;
  chatInput?.addEventListener('input', () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
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
  setInterval(changePhrase, 3000);
});
