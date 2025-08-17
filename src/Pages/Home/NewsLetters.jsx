import { motion } from 'framer-motion';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { FiCheck, FiMail, FiSend, FiX } from 'react-icons/fi';
import useAuth from '../../Hooks/AxiosSeure/useAuth';


const NewsLetters = () => {
  const { darkMode } = useAuth()
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSubscribed(true);
      toast.success('Thanks for subscribing!');
      setEmail('');
    } catch (error) {
      toast.error('Subscription failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsubscribe = () => {
    setIsSubscribed(false);
    toast('We\'re sorry to see you go!', { icon: '😢' });
  };

  return (
    <section className={`py-16 px-4 sm:px-6 lg:px-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`rounded-2xl px-6 py-12 sm:p-12 lg:flex lg:items-center lg:gap-16 ${
            darkMode ? 'bg-gray-800' : 'bg-white shadow-xl'
          }`}
        >
          <div className="lg:w-1/2">
            <h2 className={`text-3xl font-bold tracking-tight sm:text-4xl ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Stay Updated with Our Latest News
            </h2>
            <p className={`mt-4 text-lg leading-7 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Join our developer community and receive monthly updates on new tools, tutorials, and special offers.
            </p>
            
            <div className="mt-8 flex items-center gap-4">
              <a 
                href="#" 
                className={`p-3 rounded-full ${
                  darkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-label="Twitter"
              >
                <FaTwitter className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className={`p-3 rounded-full ${
                  darkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-label="GitHub"
              >
                <FaGithub className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className={`p-3 rounded-full ${
                  darkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-label="LinkedIn"
              >
                <FaLinkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="mt-12 lg:mt-0 lg:w-1/2">
            {isSubscribed ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-8 rounded-xl text-center ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <FiCheck className="h-6 w-6 text-green-600" />
                </div>
                <h3 className={`mt-4 text-lg font-medium ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  You're subscribed!
                </h3>
                <p className={`mt-2 text-sm ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Thanks for joining our community. Look out for our next newsletter.
                </p>
                <button
                  onClick={handleUnsubscribe}
                  className={`mt-6 inline-flex items-center gap-2 text-sm font-medium ${
                    darkMode 
                      ? 'text-red-400 hover:text-red-300' 
                      : 'text-red-600 hover:text-red-500'
                  }`}
                >
                  <FiX className="h-4 w-4" /> Unsubscribe
                </button>
              </motion.div>
            ) : (
              <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className={`p-8 rounded-xl ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2 mb-4">
                  <FiMail className={`h-5 w-5 ${
                    darkMode ? 'text-blue-400' : 'text-blue-600'
                  }`} />
                  <h3 className={`text-lg font-medium ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Join our newsletter
                  </h3>
                </div>
                
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <label htmlFor="email" className="sr-only">Email address</label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className={`block w-full rounded-md border-0 py-3 px-4 shadow-sm focus:ring-2 focus:ring-inset focus:outline-none ${
                        darkMode
                          ? 'bg-gray-600 text-white placeholder-gray-400 focus:ring-blue-500'
                          : 'bg-white text-gray-900 placeholder-gray-500 focus:ring-blue-600'
                      }`}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 font-medium shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                      isLoading
                        ? 'bg-blue-400'
                        : darkMode
                          ? 'bg-blue-600 hover:bg-blue-500 focus-visible:outline-blue-600'
                          : 'bg-blue-600 hover:bg-blue-500 focus-visible:outline-blue-600'
                    } text-white`}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Subscribing...
                      </>
                    ) : (
                      <>
                        <FiSend className="h-4 w-4" /> Subscribe
                      </>
                    )}
                  </button>
                </div>
                
                <p className={`mt-4 text-xs ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </motion.form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsLetters;