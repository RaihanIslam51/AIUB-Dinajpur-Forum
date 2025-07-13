// import Navbar from '../Components/Navbar';
// import Footer from "../Components/Footer"
import { Toaster } from 'react-hot-toast';
import { Outlet } from 'react-router';
import Navbar from '../Pages/Shared/Navbar';

const AuthRoot = () => {
  return (
    <div className='bg-gray-200 min-h-screen'>
    <Toaster position="top-right" />
  <header>
     <Navbar></Navbar>
  </header>
   <main className='w-11/12 mx-auto py-5'>
      <Outlet></Outlet>
      </main>
    </div>
  );
};

export default AuthRoot;