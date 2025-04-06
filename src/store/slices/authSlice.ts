import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Define types
interface User {
    _id: string;
    name: string;
    email: string;
}

interface ErrorResponse {
    response: {
        data: {
            message: string;
        }
    }
}

interface AuthState {
    userInfo: User | null;
    token: string | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

// Define initial state
const initialState: AuthState = {
    userInfo: null,
    token: localStorage.getItem('token'),
    status: 'idle',
    error: null,
};

// API base URL
const API_URL = 'http://localhost:5000/api';

// Async thunks
export const loginUser = createAsyncThunk(
    'auth/login',
    async (userData: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, userData);

            // Store token in localStorage
            localStorage.setItem('token', response.data.token);

            return response.data;
        } catch (error: unknown) {
            return rejectWithValue(
                ((error as ErrorResponse).response?.data?.message) || 'Failed to login'
            );
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData: { name: string; email: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/auth/register`, userData);

            // Store token in localStorage
            localStorage.setItem('token', response.data.token);

            return response.data;
        } catch (error: unknown) {
            return rejectWithValue(
                ((error as ErrorResponse).response?.data?.message) || 'Failed to register'
            );
        }
    }
);

// Create the slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem('token');
            state.userInfo = null;
            state.token = null;
            state.status = 'idle';
            state.error = null;
        },
        setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
            state.userInfo = action.payload.user;
            state.token = action.payload.token;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login cases
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.userInfo = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            // Register cases
            .addCase(registerUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.userInfo = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

// Export actions and reducer
export const { logout, setCredentials, clearError } = authSlice.actions;
export default authSlice.reducer;
