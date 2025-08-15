import { useContext, useEffect, useRef, useState } from 'react';
import { CgLogIn } from 'react-icons/cg';
import { FaAngleDown } from 'react-icons/fa';
import { IoMdMenu } from 'react-icons/io';
import { IoCloseSharp } from 'react-icons/io5';
import { NavLink } from 'react-router';
import { AuthContext } from '../../Authantication/Context/AuthContext';
import useAxiosSecure from '../../Hooks/AxiosSeure/useAxiosSecure';

const Navbar = () => {
  const { SignOutUser, UserData } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const profileRef = useRef(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await axiosSecure.get('/announcements');
        setAnnouncements(res.data);
      } catch (error) {
        console.error('Failed to fetch announcements:', error);
      }
    };
    fetchAnnouncements();
  }, [axiosSecure]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setOpen(false);
  };

  const handleSignOut = () => {
    SignOutUser();
    setOpen(false);
    setProfileOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Membership', path: '/membership' },
    ...(UserData ? [{ name: 'Dashboard', path: '/dashboard' }] : [])
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white text-black border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
        
        {/* Logo */}
        <NavLink
          to="/"
          onClick={scrollToTop}
          className="flex items-center gap-2 text-2xl font-bold tracking-tight text-gray-800 hover:text-blue-600 transition"
        >
          <span className="inline-block w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold shadow">
            🗨️
          </span>
          <span>
            Talk<span className="font-light text-gray-500">Sphere</span>
          </span>
        </NavLink>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map(({ name, path }) => (
            <NavLink
              key={name}
              to={path}
              className={({ isActive }) =>
                `px-4 py-2 rounded-md font-medium transition ${
                  isActive
                    ? 'bg-gray-100 text-blue-600 shadow-sm'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                }`
              }
            >
              {name}
            </NavLink>
          ))}

          {/* Notifications */}
          <NavLink
            to="/notifications"
            className="relative px-4 py-2 rounded-md font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition"
          >
            🔔
            {announcements.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow">
                {announcements.length}
              </span>
            )}
          </NavLink>

          {/* Auth Section */}
          {!UserData ? (
            <NavLink
              to="/auth/login"
              className="flex items-center gap-2 px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition"
            >
              <CgLogIn />
              Join Us
            </NavLink>
          ) : (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <img
                  src={UserData.photoURL || '/default-avatar.png'}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border border-gray-300 object-cover"
                />
                <FaAngleDown
                  className={`transition-transform duration-200 ${
                    profileOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 shadow-lg rounded-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <div className="font-semibold">{UserData.displayName || 'User'}</div>
                    <div className="text-sm text-gray-500 truncate">{UserData.email}</div>
                  </div>
                  <NavLink
                    to="/dashboard"
                    onClick={() => setProfileOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Dashboard
                  </NavLink>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setOpen(!open)}
        >
          {open ? <IoCloseSharp size={28} /> : <IoMdMenu size={28} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
