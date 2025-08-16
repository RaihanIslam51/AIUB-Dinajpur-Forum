import React from 'react';
import { Outlet } from 'react-router';
import Footer from '../Pages/Shared/Footer';
import Navbar from '../Pages/Shared/Navbar';

const RootLayout = () => {
  return (
    <div  className="flex flex-col min-h-screen">
      <header className="w-full sticky top-0 z-50 shadow-md">
            <Navbar></Navbar>
      </header>
    
       <main className="flex-1 w-full max-w-7xl mx-auto sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
      <footer  className="w-full mt-auto">
          <Footer></Footer>
      </footer>
    
      
    </div>
  );
};

export default RootLayout;