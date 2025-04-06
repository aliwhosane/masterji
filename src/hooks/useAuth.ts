import { useSelector } from 'react-redux';
import { RootState } from '../store';

export const useAuth = () => {
  // This will be expanded when we add auth state to Redux
  const isAuthenticated = !!localStorage.getItem('token');
  
  return {
    isAuthenticated,
  };
};