import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { logout } from '../store/slices/authSlice';

const MainLayout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Masterji</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main content area with sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md hidden md:block">
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <a 
                  href="/"
                  className="block px-4 py-2 rounded-md hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a 
                  href="/upload"
                  className="block px-4 py-2 rounded-md hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Upload Document
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;