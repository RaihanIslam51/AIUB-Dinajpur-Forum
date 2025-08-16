import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from "react-router";
import AuthProvider from '.././src/Authantication/Context/AuthProvider.jsx';
import './index.css';
import { router } from './Routers/Routers.jsx';

// Create a loading spinner component
const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
        <p className="mt-4 text-lg font-medium text-gray-700">Loading...</p>
      </div>
    </div>
  );
};

const queryClient = new QueryClient();

const AppWrapper = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 2 second delay

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading && <LoadingSpinner />}
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppWrapper />
  </StrictMode>
);