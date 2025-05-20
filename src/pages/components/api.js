// import axios from 'axios';

// const API_BASE = 'http://localhost:8000';  

// export const sendQuery = async (query, customerId = 'acme_ltd', namespace = 'ProductReviews') => {
//   const response = await axios.post(`${API_BASE}/query`, {
//     customer_id: customerId,
//     namespace: namespace,
//     query_text: query,
//     top_k: 5
//   });
//   return response.data;
// };

import axios from 'axios';

const API_BASE_URL = "https://model-api-dev.bytesized.com.au";

export const sendQuery = async (query, customerId, namespace) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/query`, {
      text: query,
      customer_id: customerId,
      namespace: namespace
    });
    
    return response.data;
  } catch (error) {
    console.error('Error sending query:', error);
    throw error;
  }
};

export const processAudio = async (audioBlob) => {
  try {
    const formData = new FormData();
    formData.append('audio', audioBlob);
    
    const response = await axios.post(`${API_BASE_URL}/process-audio`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error processing audio:', error);
    throw error;
  }
};

export default {
  sendQuery,
  processAudio
};