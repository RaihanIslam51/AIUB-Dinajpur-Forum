import { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { AuthContext } from '../Authantication/Context/AuthContext';
import Footer from '../Pages/Shared/Footer';
import Navbar from '../Pages/Shared/Navbar';

const RootLayout = () => {
  const { darkMode } = useContext(AuthContext);

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
      <header className={`w-full sticky top-0 z-50 shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <Navbar />
      </header>
    
      <main className="flex-1 w-full max-w-7xl mx-auto sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>

      <footer className={`w-full mt-auto ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <Footer />
      </footer>
    </div>
  );
};

export default RootLayout;