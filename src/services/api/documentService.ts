import axios from 'axios';

const API_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Define document interface
export interface Document {
  _id: string;
  userId: string;
  originalFilename: string;
  fileUrl: string;
  fileType: string;
  status: 'processing' | 'ready' | 'failed';
  summary: string | null;
  generatedQuestions: Array<{ question: string; answer: string }> | null;
  generatedQuiz: Array<{
    question: string;
    options: string[];
    correctAnswer: string;
  }> | null;
  uploadedAt: string;
  updatedAt: string;
}

// Add better error handling and response type checking

export const documentService = {
  // Get all documents for the current user
  getUserDocuments: async (): Promise<Document[]> => {
    try {
      const response = await axios.get(`${API_URL}/documents`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching user documents:', error);
      if (error.response?.status === 401) {
        // Handle unauthorized access - might need to redirect to login
        localStorage.removeItem('user'); // Clear invalid session
      }
      throw error;
    }
  },
  
  // Get a specific document by ID
  getDocumentById: async (id: string): Promise<Document> => {
    const response = await axios.get(`${API_URL}/documents/${id}`);
    return response.data;
  },
  
  // Upload a new document
  uploadDocument: async (formData: FormData): Promise<Document> => {
    const response = await axios.post(`${API_URL}/documents/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  // Delete a document
  deleteDocument: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/documents/${id}`);
  },
  
  // Request document summary generation
  requestSummary: async (documentId: string): Promise<Document> => {
    const response = await axios.post(`${API_URL}/documents/${documentId}/process/summary`);
    return response.data;
  },
  
  // Request document Q&A generation
  requestQa: async (documentId: string): Promise<Document> => {
    const response = await axios.post(`${API_URL}/documents/${documentId}/process/qa`);
    return response.data;
  },
  
  // Request document quiz generation
  requestQuiz: async (documentId: string): Promise<Document> => {
    const response = await axios.post(`${API_URL}/documents/${documentId}/process/quiz`);
    return response.data;
  },
  
  // Search documents
  searchDocuments: async (query: string): Promise<Document[]> => {
    const response = await axios.get(`${API_URL}/documents/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },
};