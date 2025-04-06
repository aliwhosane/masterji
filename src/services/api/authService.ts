import axios from 'axios';

const API_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Define user interface
export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}
// Create an axios interceptor to add the auth token to all requests
axios.interceptors.request.use(
    (config) => {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userData = JSON.parse(userStr);
        if (userData.token) {
          config.headers.Authorization = `Bearer ${userData.token}`;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
// Define auth response interface
export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  // Register a new user
  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/auth/register`, {
      name,
      email,
      password,
    });
    
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    
    return response.data;
  },
  
  // Login user
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    
    return response.data;
  },
  
  // Logout user
  logout: (): void => {
    localStorage.removeItem('user');
  },
  
  // Get current user from localStorage
  getCurrentUser: (): AuthResponse | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },
  
  // Update user profile
  updateProfile: async (userId: string, userData: Partial<User>): Promise<User> => {
    const response = await axios.put(`${API_URL}/users/${userId}`, userData);
    
    // Update stored user data if it exists
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      userData.user = response.data;
      localStorage.setItem('user', JSON.stringify(userData));
    }
    
    return response.data;
  },
  
  // Request password reset
  requestPasswordReset: async (email: string): Promise<{ message: string }> => {
    const response = await axios.post(`${API_URL}/auth/request-reset`, { email });
    return response.data;
  },
  
  // Reset password with token
  resetPassword: async (token: string, password: string): Promise<{ message: string }> => {
    const response = await axios.post(`${API_URL}/auth/reset-password`, {
      token,
      password,
    });
    return response.data;
  },
};