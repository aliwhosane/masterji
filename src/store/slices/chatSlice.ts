import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { chatService } from '../../services/api/chatService';

interface ChatState {
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  loading: false,
  error: null
};

export const sendChatMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ message, documentId }: { message: string; documentId: string }, { rejectWithValue }) => {
    try {
      return await chatService.postChatMessage(message, documentId);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    clearChatError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendChatMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendChatMessage.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to send message';
      });
  }
});

export const { clearChatError } = chatSlice.actions;
export default chatSlice.reducer;