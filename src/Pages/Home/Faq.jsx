import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { FiChevronDown, FiCode, FiExternalLink, FiHelpCircle, FiSettings } from 'react-icons/fi';
import useAuth from '../../Hooks/AxiosSeure/useAuth';


const Faq = () => {
  const { darkMode } = useAuth()
  const [activeCategory, setActiveCategory] = useState('general');
  const [expandedItem, setExpandedItem] = useState(null);

  const faqData = {
    general: [
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for annual plans."
      },
      {
        question: "How can I cancel my subscription?",
        answer: "You can cancel anytime from your account settings. No penalties, no questions asked."
      },
      {
        question: "Is there a free trial available?",
        answer: "Yes! We offer a 14-day free trial with full access to all features. No credit card required."
      }
    ],
    setup: [
      {
        question: "How do I install the SDK?",
        answer: (
          <>
            <p className="mb-2">Install via npm:</p>
            <code className={`block p-3 rounded mb-2 ${darkMode ? 'bg-gray-700 text-green-400' : 'bg-gray-100 text-gray-800'}`}>
              npm install @yourpackage/sdk
            </code>
            <p>Or include directly in your HTML:</p>
            <code className={`block p-3 rounded ${darkMode ? 'bg-gray-700 text-green-400' : 'bg-gray-100 text-gray-800'}`}>
              &lt;script src="https://cdn.yourpackage.com/sdk/v1.2.3.min.js"&gt;&lt;/script&gt;
            </code>
          </>
        )
      },
      {
        question: "What are the system requirements?",
        answer: "Our software works on Windows 10+, macOS 10.15+, and most modern Linux distributions. Requires Node.js 14+ for the CLI tools."
      }
    ],
    support: [
      {
        question: "How do I contact support?",
        answer: "Our support team is available 24/7 via email at support@yourcompany.com or through the chat widget in your dashboard."
      },
      {
        question: "Where can I find documentation?",
        answer: (
          <>
            <p>Our full documentation is available at:</p>
            <a 
              href="https://docs.yourcompany.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`inline-flex items-center mt-2 ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}
            >
              docs.yourcompany.com <FiExternalLink className="ml-1" />
            </a>
          </>
        )
      }
    ]
  };

  const toggleItem = (index) => {
    setExpandedItem(expandedItem === index ? null : index);
  };

  return (
    <div className={`py-16 px-4 sm:px-6 lg:px-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Frequently Asked Questions
          </h2>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Find answers to common questions about our product and services
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Categories sidebar */}
          <div className="md:w-1/4">
            <div className={`sticky top-6 rounded-lg p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
              <h3 className={`font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Categories</h3>
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveCategory('general')}
                  className={`flex items-center w-full px-3 py-2 rounded-md text-left ${activeCategory === 'general' ? (darkMode ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-700') : (darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100')}`}
                >
                  <FiHelpCircle className="mr-2" /> General
                </button>
                <button
                  onClick={() => setActiveCategory('setup')}
                  className={`flex items-center w-full px-3 py-2 rounded-md text-left ${activeCategory === 'setup' ? (darkMode ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-700') : (darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100')}`}
                >
                  <FiSettings className="mr-2" /> Setup & Installation
                </button>
                <button
                  onClick={() => setActiveCategory('support')}
                  className={`flex items-center w-full px-3 py-2 rounded-md text-left ${activeCategory === 'support' ? (darkMode ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-700') : (darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100')}`}
                >
                  <FiCode className="mr-2" /> Support & Help
                </button>
              </nav>
            </div>
          </div>

          {/* FAQ content */}
          <div className="md:w-3/4">
            <div className={`rounded-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
              {faqData[activeCategory].map((item, index) => (
                <div 
                  key={index} 
                  className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                >
                  <button
                    onClick={() => toggleItem(index)}
                    className={`flex items-center justify-between w-full px-6 py-4 text-left ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                  >
                    <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {item.question}
                    </h3>
                    <FiChevronDown 
                      className={`transition-transform duration-200 ${expandedItem === index ? 'transform rotate-180' : ''} ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                    />
                  </button>
                  <AnimatePresence>
                    {expandedItem === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
                      >
                        <div className={`px-6 py-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Additional help */}
            <div className={`mt-8 rounded-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
              <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Still need help?
              </h3>
              <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Can't find what you're looking for? Our support team is ready to help.
              </p>
              <button
                className={`px-4 py-2 rounded-md font-medium ${darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faq;