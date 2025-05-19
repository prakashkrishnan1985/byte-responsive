import axios from 'axios';

const API_BASE = 'http://localhost:8000';  

export const sendQuery = async (query, customerId = 'acme_ltd', namespace = 'ProductReviews') => {
  const response = await axios.post(`${API_BASE}/query`, {
    customer_id: customerId,
    namespace: namespace,
    query_text: query,
    top_k: 5
  });
  return response.data;
};