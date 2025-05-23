// questions.js

export const questions = [
    { 
      key: 'inputMethod', 
      prompt: "Hello there! Before we begin, would you prefer to chat by talking or typing?", 
      type: 'choice', 
      options: ['Talk', 'Type'] 
    },
    { 
      key: 'name', 
      prompt: "Great! And just so I don't call you 'hey you' the whole time... what should I call you?", 
      promptTemplate: "Great! And just so I don't call you 'hey you' the whole time... what should I call you?",
      type: 'text', 
      placeholder: 'Your name' 
    },
    { 
      key: 'email', 
      promptTemplate: "Thanks {name}! Mind sharing your email? Totally optional...just in case you'd like a follow-up later.", 
      prompt: "Mind sharing your email? Totally optional...just in case you'd like a follow-up later.", 
      type: 'email', 
      placeholder: 'you@example.com' 
    },
    { 
      key: 'consentToPhoto', 
      promptTemplate: "Quick one, {name}: if you smile, can I snap a picture? Only if you're cool with it.", 
      prompt: "Quick one: if you smile, can I snap a picture? Only if you're cool with it.", 
      type: 'checkbox' 
    },
    { 
      key: 'welcomeMessage', 
      prompt: "", 
      type: 'message' 
    },
    { 
      key: 'tone', 
      promptTemplate: "Lastly, {name}, how should I sound? Pick a tone that matches your vibe.", 
      prompt: "Lastly, how should I sound? Pick a tone that matches your vibe.", 
      type: 'tone' 
    }
  ];
  
  export const tones = [
    'Joker (Dark Knight)', 
    'David Attenborough', 
    'Corporate Assistant', 
    'GPT Mode'
  ];