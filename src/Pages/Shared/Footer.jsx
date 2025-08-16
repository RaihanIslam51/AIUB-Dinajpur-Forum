import { motion } from "framer-motion";
import { useContext } from "react";
import {
  FaEnvelope,
  FaFacebookF,
  FaGithub,
  FaHeart,
  FaInstagram,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaTwitter,
  FaYoutube
} from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { AuthContext } from "../../Authantication/Context/AuthContext";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { darkMode } = useContext(AuthContext);

  const socialLinks = [
    { icon: FaFacebookF, name: "Facebook", url: "#" },
    { icon: FaTwitter, name: "Twitter", url: "#" },
    { icon: FaInstagram, name: "Instagram", url: "#" },
    { icon: FaLinkedinIn, name: "LinkedIn", url: "#" },
    { icon: FaGithub, name: "GitHub", url: "#" },
    { icon: FaYoutube, name: "YouTube", url: "#" }
  ];

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Community", path: "/community" },
    { name: "Blog", path: "/blog" },
    { name: "Events", path: "/events" },
    { name: "FAQ", path: "/faq" }
  ];

  const legalLinks = [
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms of Service", path: "/terms" },
    { name: "Cookie Policy", path: "/cookies" },
    { name: "GDPR", path: "/gdpr" }
  ];

  return (
    <footer className={`pt-20 pb-10 relative overflow-hidden ${
      darkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-700'
    }`}>
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
      <div className={`absolute -bottom-20 -right-20 w-64 h-64 rounded-full ${
        darkMode ? 'bg-indigo-900' : 'bg-indigo-100'
      } opacity-10`}></div>
      <div className={`absolute -bottom-40 left-0 w-64 h-64 rounded-full ${
        darkMode ? 'bg-purple-900' : 'bg-purple-100'
      } opacity-10`}></div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="flex items-center space-x-3"
            >
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-lg shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <span className={`text-2xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Forum<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Hub</span>
              </span>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className={`leading-relaxed ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Connecting minds through meaningful conversations. Join our global community of thinkers, creators, and innovators.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-wrap gap-3"
            >
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  whileHover={{ y: -3 }}
                  className={`p-3 rounded-full transition-all duration-300 flex items-center justify-center ${
                    darkMode
                      ? 'bg-gray-800 hover:bg-gradient-to-br from-indigo-600 to-purple-600 text-gray-300 hover:text-white'
                      : 'bg-white hover:bg-gradient-to-br from-indigo-500 to-purple-500 text-gray-700 hover:text-white shadow-sm'
                  }`}
                  aria-label={`${social.name} social link`}
                >
                  <social.icon className="h-4 w-4" />
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Quick Links */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className={`text-lg font-semibold uppercase tracking-wider ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <motion.a
                    href={item.path}
                    whileHover={{ x: 5 }}
                    className={`transition-colors duration-300 flex items-center group ${
                      darkMode ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-600'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-all duration-300 ${
                      darkMode ? 'bg-indigo-400' : 'bg-indigo-600'
                    }`}></span>
                    {item.name}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className={`text-lg font-semibold uppercase tracking-wider ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Contact Us
            </h3>
            <address className="not-italic space-y-4">
              <div className="flex items-start">
                <FaMapMarkerAlt className={`mt-1 mr-3 flex-shrink-0 ${
                  darkMode ? 'text-indigo-400' : 'text-indigo-600'
                }`} />
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  123 Tech Park Avenue<br />
                  Silicon Valley, CA 94025<br />
                  United States
                </span>
              </div>
              <div className="flex items-center">
                <FaPhoneAlt className={`mr-3 flex-shrink-0 ${
                  darkMode ? 'text-indigo-400' : 'text-indigo-600'
                }`} />
                <a href="tel:+11234567890" className={`transition-colors duration-300 ${
                  darkMode ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-600'
                }`}>
                  +1 (123) 456-7890
                </a>
              </div>
              <div className="flex items-center">
                <FaEnvelope className={`mr-3 flex-shrink-0 ${
                  darkMode ? 'text-indigo-400' : 'text-indigo-600'
                }`} />
                <a href="mailto:support@forumhub.com" className={`transition-colors duration-300 ${
                  darkMode ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-600'
                }`}>
                  support@forumhub.com
                </a>
              </div>
            </address>
          </motion.div>

          {/* Newsletter */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className={`text-lg font-semibold uppercase tracking-wider ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Newsletter
            </h3>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              Subscribe to our newsletter for the latest updates and community news.
            </p>
            <form className="flex flex-col space-y-3">
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="email"
                placeholder="Your email address"
                className={`px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-500 ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                required
              />
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <span>Subscribe</span>
                <FiSend className="h-4 w-4" />
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className={`my-12 ${
            darkMode ? 'border-gray-800' : 'border-gray-200'
          } border-t`}
        ></motion.div>

        {/* Bottom Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <p className={`text-sm ${
            darkMode ? 'text-gray-500' : 'text-gray-400'
          }`}>
            &copy; {currentYear} ForumHub. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {legalLinks.map((item) => (
              <a 
                key={item.name} 
                href={item.path} 
                className={`text-sm transition-colors duration-300 ${
                  darkMode 
                    ? 'text-gray-500 hover:text-indigo-400' 
                    : 'text-gray-500 hover:text-indigo-600'
                }`}
              >
                {item.name}
              </a>
            ))}
          </div>
        </motion.div>

        {/* Made with love */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <p className={`text-xs flex items-center justify-center space-x-1 ${
            darkMode ? 'text-gray-600' : 'text-gray-500'
          }`}>
            <span>Made with</span>
            <motion.span 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <FaHeart className="text-red-500" />
            </motion.span>
            <span>by ForumHub Team</span>
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;