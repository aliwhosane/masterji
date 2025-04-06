import axios from 'axios';

const API_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const chatService = {
  postChatMessage: async (message: string, documentId: string): Promise<string> => {
    try {
      // Get the token directly from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const response = await axios.post(`${API_URL}/chat`, 
        {
          message,
          documentId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Check if response.data exists and has the expected structure
      if (response.data && response.data.response) {
        return response.data.response;
      } else {
        console.error('Unexpected response format:', response.data);
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Chat service error:', error);
      if (axios.isAxiosError(error) && error.response) {
        // Handle specific HTTP error responses
        const status = error.response.status;
        if (status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        } else if (status === 400) {
          throw new Error('Invalid request. Please check your input.');
        } else {
          throw new Error(`Server error (${status}): ${error.response.data.message || 'Unknown error'}`);
        }
      }
      // Re-throw other errors
      throw error;
    }
  }
};