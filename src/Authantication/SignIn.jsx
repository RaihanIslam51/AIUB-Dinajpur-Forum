import { motion } from 'framer-motion';
import { useContext, useState } from 'react';
import { Helmet } from 'react-helmet';
import toast from 'react-hot-toast';
import { FaEnvelope, FaEye, FaEyeSlash, FaGoogle, FaLock } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router';
import { AuthContext } from './Context/AuthContext';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { SignInUser, GoogleLogin, darkMode } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await SignInUser(email, password);
      toast.success('Login successful', {
        style: {
          background: darkMode ? '#1f2937' : '#ffffff',
          color: darkMode ? 'white' : '#1f2937',
        },
      });
      navigate(location?.state?.from || '/');
    } catch (error) {
      toast.error(error.message || 'Invalid email or password', {
        style: {
          background: darkMode ? '#1f2937' : '#ffffff',
          color: darkMode ? 'white' : '#1f2937',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await GoogleLogin();
      toast.success('Login successful with Google', {
        style: {
          background: darkMode ? '#1f2937' : '#ffffff',
          color: darkMode ? 'white' : '#1f2937',
        },
      });
      navigate(location?.state?.from || '/');
    } catch (error) {
      toast.error(error.message || 'Google login failed', {
        style: {
          background: darkMode ? '#1f2937' : '#ffffff',
          color: darkMode ? 'white' : '#1f2937',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <Helmet>
        <title>Sign In | Your App Name</title>
        <meta name="description" content="Sign in to your account" />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`w-full max-w-md rounded-xl shadow-lg overflow-hidden ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}
      >
        {/* Header */}
        <div className={`p-6 text-center ${
          darkMode 
            ? 'bg-gradient-to-r from-indigo-700 to-indigo-600' 
            : 'bg-gradient-to-r from-indigo-600 to-indigo-500'
        }`}>
          <div className={`inline-flex items-center justify-center p-3 rounded-full mb-3 ${
            darkMode ? 'bg-white/10' : 'bg-white/20'
          }`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
              <path d="M12 2C12 2 7 8 7 12C7 15.3137 9.68629 18 13 18C16.3137 18 19 15.3137 19 12C19 8 12 2 12 2Z" fill="currentColor"/>
              <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
          <p className={`mt-1 ${
            darkMode ? 'text-indigo-200' : 'text-emerald-100'
          }`}>Sign in to continue</p>
        </div>

        {/* Form */}
        <div className="p-6 sm:p-8">
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1">
              <label htmlFor="email" className={`block text-sm font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className={darkMode ? 'text-gray-400' : 'text-gray-400'} />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className={`block w-full pl-10 pr-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label htmlFor="password" className={`block text-sm font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className={darkMode ? 'text-gray-400' : 'text-gray-400'} />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className={`block w-full pl-10 pr-10 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'border-gray-300 text-gray-900'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
                    darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <div className="flex justify-end">
                <Link 
                  to="/auth/forgot-password" 
                  className={`text-xs ${
                    darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-emerald-600 hover:text-emerald-500'
                  }`}
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                isLoading 
                  ? darkMode ? 'bg-indigo-700 opacity-70 cursor-not-allowed' : 'bg-indigo-600 opacity-70 cursor-not-allowed'
                  : darkMode ? 'bg-indigo-700 hover:bg-indigo-600' : 'bg-indigo-600 hover:bg-indigo-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                darkMode ? 'focus:ring-indigo-500' : 'focus:ring-indigo-500'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${
                  darkMode ? 'border-gray-700' : 'border-gray-300'
                }`}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-2 ${
                  darkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'
                }`}>Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className={`w-full inline-flex justify-center items-center py-2 px-4 rounded-lg shadow-sm text-sm font-medium ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white border-gray-600' 
                    : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
                } border focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  darkMode ? 'focus:ring-indigo-500' : 'focus:ring-emerald-500'
                }`}
              >
                <FaGoogle className={`mr-2 ${
                  darkMode ? 'text-red-400' : 'text-red-500'
                }`} />
                Google
              </button>
            </div>
          </div>

          <div className={`mt-6 text-center text-sm ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Don't have an account?{' '}
            <Link 
              to="/auth/register" 
              className={`font-medium ${
                darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-500'
              }`}
            >
              Sign up
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignIn;