import { useContext } from 'react';
import { Toaster } from 'react-hot-toast';
import { Outlet } from 'react-router-dom';
// import { AuthContext } from '../Authentication/Context/AuthContext';
import { AuthContext } from '../Authantication/Context/AuthContext';
import Navbar from '../Pages/Shared/Navbar';

const AuthRoot = () => {
  const { darkMode } = useContext(AuthContext);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-200'}`}>
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: darkMode ? '#1f2937' : '#fff',
            color: darkMode ? '#f3f4f6' : '#111827',
            boxShadow: darkMode ? '0 4px 6px -1px rgba(0, 0, 0, 0.5)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          },
        }}
      />
      
      <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <Navbar />
      </header>
      
      <main className={`w-11/12 mx-auto py-5 transition-colors duration-300 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default AuthRoot;