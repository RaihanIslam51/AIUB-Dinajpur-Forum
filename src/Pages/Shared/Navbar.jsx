import { useContext, useEffect, useRef, useState } from 'react';
import { FaAngleDown, FaBell, FaMoon, FaSun } from 'react-icons/fa';
import { IoMdMenu } from 'react-icons/io';
import { IoCloseSharp } from 'react-icons/io5';
import { NavLink } from 'react-router';
import { AuthContext } from '../../Authantication/Context/AuthContext';
import useAxiosSecure from '../../Hooks/AxiosSeure/useAxiosSecure';

const Navbar = () => {
  const { SignOutUser, darkMode, toggleDarkMode, UserData } = useContext(AuthContext);
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
    <nav className={`fixed top-0 left-0 right-0 z-50 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} shadow-sm border-b backdrop-blur-sm bg-opacity-90`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex items-center">
            <NavLink
              to="/"
              onClick={scrollToTop}
              className="flex items-center gap-2"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} hidden sm:block`}>
                Forum<span className="text-indigo-400">Hub</span>
              </span>
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map(({ name, path }) => (
              <NavLink
                key={name}
                to={path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? `${darkMode ? 'bg-indigo-900 text-indigo-300' : 'bg-indigo-50 text-indigo-600'}`
                      : `${darkMode ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'}`
                  }`
                }
              >
                {name}
              </NavLink>
            ))}
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-3">
            {/* Dark/Light Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <FaSun className="h-5 w-5 text-yellow-300" />
              ) : (
                <FaMoon className="h-5 w-5 text-gray-600" />
              )}
            </button>

            {/* Notifications */}
            <NavLink
              to="/notifications"
              className={`p-2 rounded-full relative ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}
            >
              <FaBell className={`h-5 w-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
              {announcements.length > 0 && (
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
              )}
            </NavLink>

            {/* Auth Section */}
            {UserData ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <img
                    src={UserData.photoURL || '/default-avatar.png'}
                    alt="Profile"
                    className="h-8 w-8 rounded-full border-2 border-white shadow-sm object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-avatar.png';
                    }}
                  />
                  <FaAngleDown
                    className={`h-4 w-4 ${darkMode ? 'text-gray-300' : 'text-gray-500'} transition-transform ${
                      profileOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Profile Dropdown */}
                {profileOpen && (
                  <div className={`absolute right-0 mt-2 w-56 origin-top-right rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y ${darkMode ? 'divide-gray-700 bg-gray-800' : 'divide-gray-100 bg-white'}`}>
                    <div className="px-4 py-3">
                      <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'} truncate`}>{UserData.displayName}</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-500'} truncate`}>{UserData.email}</p>
                    </div>
                    <div className="py-1">
                      <NavLink
                        to="/profile"
                        onClick={() => setProfileOpen(false)}
                        className={`block px-4 py-2 text-sm ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                      >
                        Your Profile
                      </NavLink>
                      <NavLink
                        to="/settings"
                        onClick={() => setProfileOpen(false)}
                        className={`block px-4 py-2 text-sm ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                      >
                        Settings
                      </NavLink>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={handleSignOut}
                        className={`block w-full text-left px-4 py-2 text-sm text-red-600 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-red-50'}`}
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <NavLink
                  to="/auth/login"
                  className={`px-4 py-2 rounded-md text-sm font-medium ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50'} transition-colors`}
                >
                  Log in
                </NavLink>
                <NavLink
                  to="/auth/register"
                  className="px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors"
                >
                  Sign up
                </NavLink>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className={`md:hidden p-2 rounded-md ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'} focus:outline-none`}
              onClick={() => setOpen(!open)}
            >
              {open ? (
                <IoCloseSharp className="h-6 w-6" />
              ) : (
                <IoMdMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className={`md:hidden shadow-lg ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map(({ name, path }) => (
              <NavLink
                key={name}
                to={path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? `${darkMode ? 'bg-indigo-900 text-indigo-300' : 'bg-indigo-50 text-indigo-600'}`
                      : `${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50'}`
                  }`
                }
              >
                {name}
              </NavLink>
            ))}
            {!UserData && (
              <>
                <NavLink
                  to="/auth/login"
                  onClick={() => setOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  Log in
                </NavLink>
                <NavLink
                  to="/auth/register"
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Sign up
                </NavLink>
              </>
            )}
          </div>
          {UserData && (
            <div className={`pt-4 pb-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <img
                    src={UserData.photoURL || '/default-avatar.png'}
                    alt="Profile"
                    className="h-10 w-10 rounded-full"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-avatar.png';
                    }}
                  />
                </div>
                <div className="ml-3">
                  <div className={`text-base font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {UserData.displayName}
                  </div>
                  <div className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    {UserData.email}
                  </div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <NavLink
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  Your Profile
                </NavLink>
                <button
                  onClick={handleSignOut}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-red-50'}`}
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;