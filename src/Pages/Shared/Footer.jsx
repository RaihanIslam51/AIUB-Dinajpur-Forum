import { motion } from "framer-motion";
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

const Footer = () => {
  const currentYear = new Date().getFullYear();

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
    <footer className="bg-gray-900 text-gray-300 pt-20 pb-10 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
      <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-indigo-900 opacity-10"></div>
      <div className="absolute -bottom-40 left-0 w-64 h-64 rounded-full bg-purple-900 opacity-10"></div>

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
              <span className="text-2xl font-bold text-white">Forum<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Hub</span></span>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-gray-400 leading-relaxed"
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
                  className="bg-gray-800 hover:bg-gradient-to-br from-indigo-600 to-purple-600 text-gray-300 hover:text-white p-3 rounded-full transition-all duration-300 flex items-center justify-center"
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
            <h3 className="text-lg font-semibold text-white uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <motion.a
                    href={item.path}
                    whileHover={{ x: 5 }}
                    className="text-gray-400 hover:text-indigo-400 transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-indigo-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
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
            <h3 className="text-lg font-semibold text-white uppercase tracking-wider">
              Contact Us
            </h3>
            <address className="not-italic space-y-4">
              <div className="flex items-start">
                <FaMapMarkerAlt className="text-indigo-400 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-400">
                  123 Tech Park Avenue<br />
                  Silicon Valley, CA 94025<br />
                  United States
                </span>
              </div>
              <div className="flex items-center">
                <FaPhoneAlt className="text-indigo-400 mr-3 flex-shrink-0" />
                <a href="tel:+11234567890" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300">
                  +1 (123) 456-7890
                </a>
              </div>
              <div className="flex items-center">
                <FaEnvelope className="text-indigo-400 mr-3 flex-shrink-0" />
                <a href="mailto:support@forumhub.com" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300">
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
            <h3 className="text-lg font-semibold text-white uppercase tracking-wider">
              Newsletter
            </h3>
            <p className="text-gray-400">
              Subscribe to our newsletter for the latest updates and community news.
            </p>
            <form className="flex flex-col space-y-3">
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="email"
                placeholder="Your email address"
                className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-500"
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
          className="border-t border-gray-800 my-12"
        ></motion.div>

        {/* Bottom Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} ForumHub. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {legalLinks.map((item) => (
              <a 
                key={item.name} 
                href={item.path} 
                className="text-gray-500 hover:text-indigo-400 text-sm transition-colors duration-300"
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
          <p className="text-gray-600 text-xs flex items-center justify-center space-x-1">
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