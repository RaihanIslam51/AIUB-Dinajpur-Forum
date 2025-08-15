import { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router';
import { AuthContext } from '../../Authantication/Context/AuthContext';
// import Reval from '../Animation/Reval';
// import { AuthContext } from '../Authantication/Context/AuthContext';

const Profile = () => {
  const { UserData, updateUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: UserData?.displayName || '',
    email: UserData?.email || ''
  });
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const navigate = useNavigate();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call the updateUser function to update the user's data
    updateUser(formData);
    setIsEditing(false); // Close the edit form after submitting
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div>
      <div className={`relative min-h-screen flex items-center justify-center p-6 overflow-hidden bg-gradient-to-br from-indigo-400 via-purple-300 to-pink-200 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 transition-colors duration-500`}>
        {/* Decorative SVG background */}
        <svg className="absolute -top-32 -left-32 w-[600px] h-[600px] opacity-30 blur-2xl pointer-events-none" viewBox="0 0 600 600">
          <defs>
            <radialGradient id="bg-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#a5b4fc" />
              <stop offset="100%" stopColor="#fbcfe8" />
            </radialGradient>
          </defs>
          <circle cx="300" cy="300" r="300" fill="url(#bg-grad)" />
        </svg>
        <Helmet>
          <title>User Profile</title>
          <meta name="description" content="Track your subscriptions easily." />
        </Helmet>
        <div className="absolute top-6 right-6 z-20">
          <button
            onClick={toggleTheme}
            className="bg-white/80 dark:bg-gray-800 border border-indigo-200 dark:border-gray-700 text-indigo-600 dark:text-gray-200 font-bold py-2 px-4 rounded-full shadow hover:bg-indigo-50 dark:hover:bg-gray-700 transition-all duration-300"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
        <div className="relative z-10 backdrop-blur-xl bg-white/60 dark:bg-gray-900/70 border border-white/30 dark:border-gray-700 rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden transition-all duration-500 hover:shadow-3xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-400 dark:from-gray-800 dark:via-gray-700 dark:to-gray-900 p-8 text-white text-center rounded-b-3xl shadow-lg">
            <div className="relative w-28 h-28 mx-auto mb-4">
              <img
                src={UserData?.photoURL || 'https://i.pravatar.cc/150?img=3'}
                alt={`${UserData?.displayName || 'User'}'s profile`}
                className="w-28 h-28 rounded-full border-4 border-white shadow-xl object-cover ring-4 ring-pink-200 transition-transform duration-300 hover:scale-105"
              />
              <span className="absolute bottom-2 right-2 w-5 h-5 bg-green-400 border-2 border-white rounded-full shadow"></span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight drop-shadow-lg">
              {UserData?.displayName}
            </h2>
            <p className="text-base opacity-90 font-medium">
              {UserData?.email}
            </p>
          </div>

          {/* Account Information */}
          <div className="p-8 space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 border-b-2 border-indigo-200 dark:border-gray-700 pb-3 mb-4 tracking-wide">
              Account Information
            </h3>
            {!isEditing ? (
              <>
                <div className="flex items-center gap-4 text-gray-700 dark:text-gray-200">
                  <span className="material-symbols-outlined text-indigo-500">person</span>
                  <div>
                    <p className="font-semibold text-gray-900">Full Name</p>
                    <p className="text-gray-700">{UserData?.displayName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-gray-700 dark:text-gray-200">
                  <span className="material-symbols-outlined text-indigo-500">mail</span>
                  <div>
                    <p className="font-semibold text-gray-900">Email Address</p>
                    <p className="text-gray-700">{UserData?.email}</p>
                  </div>
                </div>
              </>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in">
                <div>
                  <label className="block font-semibold text-gray-800 dark:text-gray-100 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    className="w-full px-5 py-3 rounded-xl border border-indigo-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800 focus:ring-2 focus:ring-indigo-400 outline-none text-gray-900 dark:text-gray-100 font-medium transition"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-800 dark:text-gray-100 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-5 py-3 rounded-xl border border-indigo-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800 focus:ring-2 focus:ring-indigo-400 outline-none text-gray-900 dark:text-gray-100 font-medium transition"
                    required
                  />
                </div>
                <div className="flex gap-4 justify-end">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-indigo-500 to-pink-400 dark:from-gray-700 dark:to-gray-900 hover:from-indigo-600 hover:to-pink-500 dark:hover:from-gray-800 dark:hover:to-gray-800 text-white font-bold py-2 px-8 rounded-full shadow-lg transition-all duration-300"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="bg-white/80 dark:bg-gray-800 border border-indigo-200 dark:border-gray-700 text-indigo-600 dark:text-gray-200 font-bold py-2 px-8 rounded-full shadow hover:bg-indigo-50 dark:hover:bg-gray-700 transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Edit and Go Back Buttons */}
          <div className="p-6 pt-0 text-center space-y-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-r from-indigo-500 to-pink-400 dark:from-gray-700 dark:to-gray-900 hover:from-indigo-600 hover:to-pink-500 dark:hover:from-gray-800 dark:hover:to-gray-800 text-white font-bold py-2 px-8 rounded-full shadow-lg transition-all duration-300"
              >
                Edit Profile
              </button>
            ) : null}
            <div>
              <button
                onClick={() => navigate(-1)}
                className="mt-2 text-indigo-600 dark:text-gray-200 hover:underline text-sm font-semibold"
              >
                ← Go Back
              </button>
            </div>
          </div>
        </div>
        {/* Optionally, add Google Fonts and Material Symbols */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
      </div>
    </div>
  );
};

export default Profile;
