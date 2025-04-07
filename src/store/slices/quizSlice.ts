import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface QuizState {
  quiz: QuizQuestion[] | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: QuizState = {
  quiz: null,
  status: 'idle',
  error: null,
};

export const fetchQuiz = createAsyncThunk('quiz/fetchQuiz', async (documentId: string) => {
  const response = await axios.get(`http://localhost:5000/api/documents/${documentId}/quiz`);
  return response.data;
});

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuiz.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchQuiz.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.quiz = action.payload;
      })
      .addCase(fetchQuiz.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch quiz';
      });
  },
});

export default quizSlice.reducer;