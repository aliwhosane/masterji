import axios from 'axios';
import { Note } from '../../store/slices/noteSlice';

const API_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const noteService = {
  getNotes: async (documentId: string): Promise<Note[]> => {
    const response = await axios.get(`${API_URL}/notes/${documentId}`);
    return response.data;
  },

  addNote: async (documentId: string, content: string): Promise<Note> => {
    const response = await axios.post(`${API_URL}/notes`, { documentId, content });
    return response.data;
  },

  editNote: async (noteId: string, content: string): Promise<Note> => {
    const response = await axios.put(`${API_URL}/notes/${noteId}`, { content });
    return response.data;
  },

  deleteNote: async (noteId: string): Promise<void> => {
    await axios.delete(`${API_URL}/notes/${noteId}`);
  },
};