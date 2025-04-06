import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

const ProtectedRoute = () => {
  const { token, userInfo } = useAppSelector((state) => state.auth);
  
  // If there's no token or user info, redirect to login
  if (!token && !userInfo) {
    return <Navigate to="/login" replace />;
  }
  
  // Otherwise, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;