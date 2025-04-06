import axios from 'axios';
import { store } from '../store';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include JWT token in headers
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (for initial page load before Redux is hydrated)
    const tokenFromStorage = localStorage.getItem('token');
    
    // Get token from Redux store (for subsequent requests)
    const tokenFromStore = store.getState().auth.token;
    
    // Use token from store if available, otherwise from storage
    const token = tokenFromStore || tokenFromStorage;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth endpoints
export const authService = {
  register: async (name: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },
  
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
};

// Document endpoints
export const documentService = {
  uploadDocument: async (formData: FormData) => {
    const response = await api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  getUserDocuments: async () => {
    const response = await api.get('/documents');
    return response.data;
  },
  
  getDocumentById: async (id: string) => {
    const response = await api.get(`/documents/${id}`);
    return response.data;
  },
  
  deleteDocument: async (id: string) => {
    const response = await api.delete(`/documents/${id}`);
    return response.data;
  },
  
  requestSummary: async (documentId: string) => {
    const response = await api.post(`/documents/${documentId}/process/summary`);
    return response.data;
  },
  
  requestQa: async (documentId: string) => {
    const response = await api.post(`/documents/${documentId}/process/qa`);
    return response.data;
  },
  
  requestQuiz: async (documentId: string) => {
    const response = await api.post(`/documents/${documentId}/process/quiz`);
    return response.data;
  },
};

// Note endpoints
export const noteService = {
  createNote: async (documentId: string, content: string) => {
    const response = await api.post('/notes', { documentId, content });
    return response.data;
  },
  
  getNotesForDocument: async (documentId: string) => {
    const response = await api.get(`/notes/document/${documentId}`);
    return response.data;
  },
  
  updateNote: async (id: string, content: string) => {
    const response = await api.put(`/notes/${id}`, { content });
    return response.data;
  },
  
  deleteNote: async (id: string) => {
    const response = await api.delete(`/notes/${id}`);
    return response.data;
  },
};

// AI endpoints
export const aiService = {
  postChatMessage: async (message: string, documentId?: string) => {
    const response = await api.post('/ai/chat', { message, documentId });
    return response.data;
  },
};

// Log endpoints
export const logService = {
  logSearchQuery: async (query: string, documentContext?: string) => {
    const response = await api.post('/log/search', { query, documentContext });
    return response.data;
  },
};

// Export all services
export default {
  auth: authService,
  document: documentService,
  note: noteService,
  ai: aiService,
  log: logService,
};