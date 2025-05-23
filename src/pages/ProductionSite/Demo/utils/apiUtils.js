// apiUtils.js

import axios from 'axios';

const API_BASE_URL = "https://model-api-dev.bytesized.com.au";

export const processImageWithAPI = async (base64Image) => {
  try {
    console.log('Sending API request...');
    const response = await axios.post(`${API_BASE_URL}/process-image-base64`, {
      model: "gpt-4o",
      prompt: `You're shown an image of a visitor's outfit — including visible clothing, accessories, and possibly their posture or expression. Create a friendly, welcoming message that mentions safe visual details like color, style, or accessories. Avoid referring to faces or personal characteristics. Keep the tone warm and professional.`,
      base64_image: base64Image
    });

    console.log('API response received:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error processing image with API:', error);
    throw new Error(`Error processing image: ${error.message}`);
  }
};

export const sendQuery = async (query, customerId = 'default', namespace = 'default') => {
  try {
    const response = await axios.post(`${API_BASE_URL}/query`, {
      query,
      customer_id: customerId,
      namespace: namespace
    });
    return response.data;
  } catch (error) {
    console.error('Error sending query:', error);
    throw new Error(`Error sending query: ${error.message}`);
  }
};

export const processAudio = async (audioBlob) => {
  try {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');

    const response = await axios.post(`${API_BASE_URL}/transcribe`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error processing audio:', error);
    throw new Error(`Error processing audio: ${error.message}`);
  }
};

export const getAudioUrl = (audioPath) => {
  if (!audioPath) return null;
  return `${API_BASE_URL}${audioPath}?t=${Date.now()}`;
};

export const createWelcomeMessage = (welcomeMsg) => {
  return welcomeMsg || "Welcome! Nice to meet you.";
};