import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import { Toaster } from 'react-hot-toast';

// Lazy load pages for better performance
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const DocumentDetailPage = lazy(() => import('./pages/DocumentDetailPage'));
// const UploadPage = lazy(() => import('./pages/UploadPage'));

// Loading component for suspense fallback
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

function App() {
  return (
    <>
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#363636',
          color: '#fff',
        },
        success: {
          duration: 3000,
          style: {
            background: '#22c55e',
            color: '#fff',
          },
        },
        error: {
          duration: 4000,
          style: {
            background: '#ef4444',
            color: '#fff',
          },
        },
      }}
    />
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected routes with MainLayout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/documents/:id" element={<DocumentDetailPage />} />
              {/* <Route path="/upload" element={<UploadPage />} /> */}
            </Route>
          </Route>
          
          {/* Redirect any unknown routes to dashboard if logged in, otherwise to login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
    </>
  );
}
export default App;