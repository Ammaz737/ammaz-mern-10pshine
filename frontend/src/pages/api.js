import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const generateWithLlm = async (prompt) => {
    const response = await axios.post(`${API_URL}/llm/generate`, { prompt });
    return response.data;
};
