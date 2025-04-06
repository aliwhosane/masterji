import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { documentService } from '../../services/api';

// Define types
export interface Document {
    _id: string;
    originalFilename: string;
    fileType: string;
    uploadedAt: string;
    status: string;
    user: string;
    summary?: string;
    generatedQuestions?: Array<{
        question: string;
        answer: string;
    }>;
    generatedQuiz?: Array<{
        question: string;
        options: string[];
        correctAnswer: string;
    }>;
}

interface DocumentState {
    documents: Document[];
    currentDocument: Document | null;
    currentDocumentStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    currentDocumentError: string | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    uploadStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    uploadError: string | null;
}

// Initial state
const initialState: DocumentState = {
    documents: [],
    currentDocument: null,
    currentDocumentStatus: 'idle',
    currentDocumentError: null,
    status: 'idle',
    error: null,
    uploadStatus: 'idle',
    uploadError: null,
};

// Async thunks
export const fetchUserDocuments = createAsyncThunk(
    'documents/fetchUserDocuments',
    async (_, { rejectWithValue }) => {
        try {
            const data = await documentService.getUserDocuments();
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch documents'
            );
        }
    }
);

export const fetchDocumentById = createAsyncThunk(
    'documents/fetchDocumentById',
    async (id: string, { rejectWithValue }) => {
        try {
            const data = await documentService.getDocumentById(id);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch document'
            );
        }
    }
);

export const uploadDocument = createAsyncThunk(
    'documents/uploadDocument',
    async (formData: FormData, { rejectWithValue }) => {
        try {
            const data = await documentService.uploadDocument(formData);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to upload document'
            );
        }
    }
);

export const deleteDocument = createAsyncThunk(
    'documents/deleteDocument',
    async (id: string, { rejectWithValue }) => {
        try {
            await documentService.deleteDocument(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to delete document'
            );
        }
    }
);

// Add this new async thunk
export const generateDocumentSummary = createAsyncThunk(
    'documents/generateSummary',
    async (documentId: string, { rejectWithValue }) => {
        try {
            const data = await documentService.requestSummary(documentId);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to generate summary'
            );
        }
    }
);

// Add this new async thunk
export const generateDocumentQa = createAsyncThunk(
    'documents/generateQa',
    async (documentId: string, { rejectWithValue }) => {
        try {
            const data = await documentService.requestQa(documentId);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to generate Q&A'
            );
        }
    }
);

// Add this new async thunk
export const generateDocumentQuiz = createAsyncThunk(
    'documents/generateQuiz',
    async (documentId: string, { rejectWithValue }) => {
        try {
            const data = await documentService.requestQuiz(documentId);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to generate quiz'
            );
        }
    }
);

const documentSlice = createSlice({
    name: 'documents',
    initialState,
    reducers: {
        resetUploadStatus: (state) => {
            state.uploadStatus = 'idle';
            state.uploadError = null;
        },
        clearCurrentDocument: (state) => {
            state.currentDocument = null;
            state.currentDocumentStatus = 'idle';
            state.currentDocumentError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch documents cases
            .addCase(fetchUserDocuments.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUserDocuments.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.documents = action.payload;
                state.error = null;
            })
            .addCase(fetchUserDocuments.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            // Fetch document by ID cases
            .addCase(fetchDocumentById.pending, (state) => {
                state.currentDocumentStatus = 'loading';
                state.currentDocumentError = null;
            })
            .addCase(fetchDocumentById.fulfilled, (state, action) => {
                state.currentDocumentStatus = 'succeeded';
                state.currentDocument = action.payload;
            })
            .addCase(fetchDocumentById.rejected, (state, action) => {
                state.currentDocumentStatus = 'failed';
                state.currentDocumentError = action.payload as string;
            })
            // Upload document cases
            .addCase(uploadDocument.pending, (state) => {
                state.uploadStatus = 'loading';
            })
            .addCase(uploadDocument.fulfilled, (state, action) => {
                state.uploadStatus = 'succeeded';
                state.documents.push(action.payload);
                state.uploadError = null;
            })
            .addCase(uploadDocument.rejected, (state, action) => {
                state.uploadStatus = 'failed';
                state.uploadError = action.payload as string;
            })
            // Delete document cases
            .addCase(deleteDocument.fulfilled, (state, action) => {
                state.documents = state.documents.filter(
                    (doc) => doc._id !== action.payload
                );
                // If the deleted document is the current document, clear it
                if (state.currentDocument && state.currentDocument._id === action.payload) {
                    state.currentDocument = null;
                    state.currentDocumentStatus = 'idle';
                }
            })
            // Generate document summary cases
            .addCase(generateDocumentSummary.pending, (state) => {
                state.currentDocumentStatus = 'loading';
                state.currentDocumentError = null;
            })
            .addCase(generateDocumentSummary.fulfilled, (state, action) => {
                state.currentDocumentStatus = 'succeeded';
                if (state.currentDocument) {
                    state.currentDocument = action.payload;
                }
            })
            .addCase(generateDocumentSummary.rejected, (state, action) => {
                state.currentDocumentStatus = 'failed';
                state.currentDocumentError = action.payload as string;
            })
            // Update the extraReducers in the slice to handle Q&A generation
            .addCase(generateDocumentQa.pending, (state) => {
                state.currentDocumentStatus = 'loading';
                state.currentDocumentError = null;
            })
            .addCase(generateDocumentQa.fulfilled, (state, action) => {
                state.currentDocumentStatus = 'succeeded';
                if (state.currentDocument) {
                    state.currentDocument = action.payload;
                }
            })
            .addCase(generateDocumentQa.rejected, (state, action) => {
                state.currentDocumentStatus = 'failed';
                state.currentDocumentError = action.payload as string;
            })

            // Update the extraReducers in the slice to handle Quiz generation
            .addCase(generateDocumentQuiz.pending, (state) => {
                state.currentDocumentStatus = 'loading';
                state.currentDocumentError = null;
            })
            .addCase(generateDocumentQuiz.fulfilled, (state, action) => {
                state.currentDocumentStatus = 'succeeded';
                if (state.currentDocument) {
                    state.currentDocument = action.payload;
                }
            })
            .addCase(generateDocumentQuiz.rejected, (state, action) => {
                state.currentDocumentStatus = 'failed';
                state.currentDocumentError = action.payload as string;
            });
    },
});

export const { resetUploadStatus, clearCurrentDocument } = documentSlice.actions;
export default documentSlice.reducer;