import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { noteService } from '../../services/api';

// Define types
export interface Note {
  _id: string;
  documentId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface NoteState {
  notes: Note[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  addStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  addError: string | null;
  editStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  editError: string | null;
  deleteStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  deleteError: string | null;
}

// Initial state
const initialState: NoteState = {
  notes: [],
  status: 'idle',
  error: null,
  addStatus: 'idle',
  addError: null,
  editStatus: 'idle',
  editError: null,
  deleteStatus: 'idle',
  deleteError: null,
};

// Async thunks
export const fetchDocumentNotes = createAsyncThunk(
  'notes/fetchDocumentNotes',
  async (documentId: string, { rejectWithValue }) => {
    try {
      const data = await noteService.getNotesForDocument(documentId);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch notes'
      );
    }
  }
);

export const addNote = createAsyncThunk(
  'notes/addNote',
  async ({ documentId, content }: { documentId: string; content: string }, { rejectWithValue }) => {
    try {
      const data = await noteService.createNote(documentId, content);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add note'
      );
    }
  }
);

export const editNote = createAsyncThunk(
  'notes/editNote',
  async ({ noteId, content }: { noteId: string; content: string }, { rejectWithValue }) => {
    try {
      const data = await noteService.updateNote(noteId, content);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to edit note'
      );
    }
  }
);

export const removeNote = createAsyncThunk(
  'notes/removeNote',
  async (noteId: string, { rejectWithValue }) => {
    try {
      await noteService.deleteNote(noteId);
      return noteId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete note'
      );
    }
  }
);

// Create the slice
const noteSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    resetNoteStatus: (state) => {
      state.addStatus = 'idle';
      state.addError = null;
      state.editStatus = 'idle';
      state.editError = null;
      state.deleteStatus = 'idle';
      state.deleteError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch notes cases
      .addCase(fetchDocumentNotes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDocumentNotes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.notes = action.payload;
        state.error = null;
      })
      .addCase(fetchDocumentNotes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Add note cases
      .addCase(addNote.pending, (state) => {
        state.addStatus = 'loading';
      })
      .addCase(addNote.fulfilled, (state, action) => {
        state.addStatus = 'succeeded';
        state.notes.push(action.payload);
        state.addError = null;
      })
      .addCase(addNote.rejected, (state, action) => {
        state.addStatus = 'failed';
        state.addError = action.payload as string;
      })
      // Edit note cases
      .addCase(editNote.pending, (state) => {
        state.editStatus = 'loading';
      })
      .addCase(editNote.fulfilled, (state, action) => {
        state.editStatus = 'succeeded';
        const index = state.notes.findIndex(note => note._id === action.payload._id);
        if (index !== -1) {
          state.notes[index] = action.payload;
        }
        state.editError = null;
      })
      .addCase(editNote.rejected, (state, action) => {
        state.editStatus = 'failed';
        state.editError = action.payload as string;
      })
      // Delete note cases
      .addCase(removeNote.pending, (state) => {
        state.deleteStatus = 'loading';
      })
      .addCase(removeNote.fulfilled, (state, action) => {
        state.deleteStatus = 'succeeded';
        state.notes = state.notes.filter(note => note._id !== action.payload);
        state.deleteError = null;
      })
      .addCase(removeNote.rejected, (state, action) => {
        state.deleteStatus = 'failed';
        state.deleteError = action.payload as string;
      });
  },
});

export const { resetNoteStatus } = noteSlice.actions;
export default noteSlice.reducer;