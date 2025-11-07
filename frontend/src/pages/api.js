import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export const generateWithLlm = async (prompt) => {
  try {
    const response = await api.post('/api/llm/generate', { prompt });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to generate content with AI.');
  }
};
