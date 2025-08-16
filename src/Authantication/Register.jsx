import { motion } from 'framer-motion';
import { useContext, useState } from 'react';
import { Helmet } from 'react-helmet';
import toast from 'react-hot-toast';
import { FaEnvelope, FaEye, FaEyeSlash, FaGoogle, FaImage, FaLock, FaUser } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../Hooks/AxiosSeure/asiosInstance';
import { AuthContext } from './Context/AuthContext';

const Register = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordShow, setPasswordShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const { createUser, GoogleLogin, setUserData, updateUser, darkMode } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    const name = e.target.name.value;
    const photo = e.target.photo.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    const passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

    if (!passwordRegEx.test(password)) {
      const msg = 'Password must include uppercase, lowercase, digit, and be at least 6 characters.';
      setErrorMessage(msg);
      toast.error(msg);
      setIsLoading(false);
      return;
    }

    try {
      const result = await createUser(email, password);
      const user = result.user;

      await updateUser({ displayName: name, photoURL: photo });
      setUserData({ ...user, displayName: name, photoURL: photo });

      // Save user to database
      const userInfo = {
        name,
        photo,
        email,
        role: 'user',
        payment_status: 'Bronze Badge',
        created_at: new Date().toISOString(),
        last_log_in: new Date().toISOString()
      };

      await axiosInstance.post('/users', userInfo);
      toast.success('Account created successfully!');
      navigate(from, { replace: true });
    } catch (error) {
      console.error(error.message);
      setErrorMessage(error.message);
      toast.error(error.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await GoogleLogin();
      const user = result.user;

      const userInfo = {
        name: user.displayName || 'No Name',
        photo: user.photoURL || '',
        email: user.email,
        role: 'user',
        payment_status: 'Bronze Badge',
        created_at: new Date().toISOString(),
        last_log_in: new Date().toISOString()
      };

      await axiosInstance.post('/users', userInfo);
      setUserData(user);
      toast.success('Signed in with Google!');
      navigate(from, { replace: true });
    } catch (error) {
      console.error(error.message);
      setErrorMessage(error.message);
      toast.error(error.message || 'Google sign-in failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Helmet>
        <title>Register | Your App Name</title>
        <meta name="description" content="Create your account to get started" />
      </Helmet>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full max-w-md rounded-2xl shadow-xl overflow-hidden transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
      >
        {/* Header Section */}
        <div className={`bg-gradient-to-r p-6 text-center ${darkMode ? 'from-gray-700 to-gray-600' : 'from-indigo-600 to-indigo-500'}`}>
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-white'}`}>Create Your Account</h2>
          <p className={darkMode ? 'text-gray-300 mt-1' : 'text-indigo-100 mt-1'}>Join our community today</p>
        </div>

        {/* Form Section */}
        <div className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div className="space-y-1">
              <label htmlFor="name" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className={darkMode ? 'text-gray-400' : 'text-gray-400'} />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="John Doe"
                  className={`block w-full pl-10 pr-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-colors duration-300 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-gray-100 focus:ring-emerald-400 focus:border-emerald-400' 
                      : 'border border-gray-300 focus:ring-emerald-500 focus:border-emerald-500'
                  }`}
                />
              </div>
            </div>

            {/* Photo URL Field */}
            <div className="space-y-1">
              <label htmlFor="photo" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Photo URL (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaImage className={darkMode ? 'text-gray-400' : 'text-gray-400'} />
                </div>
                <input
                  id="photo"
                  name="photo"
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  className={`block w-full pl-10 pr-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-colors duration-300 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-gray-100 focus:ring-emerald-400 focus:border-emerald-400' 
                      : 'border border-gray-300 focus:ring-emerald-500 focus:border-emerald-500'
                  }`}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <label htmlFor="email" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className={darkMode ? 'text-gray-400' : 'text-gray-400'} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className={`block w-full pl-10 pr-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-colors duration-300 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-gray-100 focus:ring-emerald-400 focus:border-emerald-400' 
                      : 'border border-gray-300 focus:ring-emerald-500 focus:border-emerald-500'
                  }`}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label htmlFor="password" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className={darkMode ? 'text-gray-400' : 'text-gray-400'} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={passwordShow ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  className={`block w-full pl-10 pr-10 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-colors duration-300 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-gray-100 focus:ring-emerald-400 focus:border-emerald-400' 
                      : 'border border-gray-300 focus:ring-emerald-500 focus:border-emerald-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setPasswordShow(!passwordShow)}
                  className={`absolute inset-y-0 right-0 pr-3 flex items-center ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {passwordShow ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Must contain uppercase, lowercase, number, and 6+ characters
              </p>
            </div>

            {errorMessage && (
              <div className={`text-sm p-2 rounded-lg ${darkMode ? 'text-red-400 bg-red-900/50' : 'text-red-600 bg-red-50'}`}>
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center py-2 px-4 rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-300 ${
                isLoading 
                  ? 'opacity-70 cursor-not-allowed' 
                  : ''
              } ${
                darkMode 
                  ? 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-400' 
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-emerald-500'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                'Register'
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-2 ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className={`w-full inline-flex justify-center items-center py-2 px-4 rounded-lg shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-300 ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600 focus:ring-emerald-400' 
                    : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 focus:ring-emerald-500'
                }`}
              >
                <FaGoogle className={`${darkMode ? 'text-red-400' : 'text-red-500'} mr-2`} />
                Sign up with Google
              </button>
            </div>
          </div>

          <div className={`mt-6 text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Already have an account?{' '}
            <Link 
              to="/auth/login" 
              className={`font-medium ${darkMode ? 'text-emerald-400 hover:text-emerald-300' : 'text-indigo-600 hover:text-indigo-500'}`}
            >
              Sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;