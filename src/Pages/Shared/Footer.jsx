import {
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaTwitter,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 text-blue-950 dark:bg-gradient-to-br dark:from-blue-950 dark:via-blue-900 dark:to-blue-800 dark:text-white relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background:
            "radial-gradient(circle at 70% 30%, #60a5fa 0%, transparent 70%)",
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 relative z-10">
        {/* Logo & Description */}
        <div className="backdrop-blur-md bg-white/70 dark:bg-white/5 rounded-3xl shadow-xl p-6 flex flex-col gap-4">
          <h2 className="text-4xl font-extrabold mb-2 flex items-center gap-3 tracking-tight">
            <span className="text-blue-600 dark:text-blue-400 text-4xl">🗨️</span>
            <span className="bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-200 bg-clip-text text-transparent">
              TalkSphere
            </span>
          </h2>
          <p className="text-blue-900 dark:text-blue-100 text-base leading-relaxed">
            A vibrant space where voices connect, ideas grow, and communities engage. Join conversations. Share perspectives. Be heard.
          </p>
        </div>

        {/* Quick Links */}
        <div className="backdrop-blur-md bg-white/70 dark:bg-white/5 rounded-3xl shadow-xl p-6">
          <h3 className="font-semibold text-2xl mb-6 text-blue-600 dark:text-blue-300 tracking-wide border-b pb-2 border-blue-300 dark:border-blue-700">
            Quick Links
          </h3>
          <ul className="space-y-4">
            {['Home', 'Topics', 'Members', 'Discussions', 'Contact'].map((item) => (
              <li key={item}>
                <a href={`#${item.toLowerCase()}`} className="hover:text-blue-600 dark:hover:text-blue-300 transition font-medium">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="backdrop-blur-md bg-white/70 dark:bg-white/5 rounded-3xl shadow-xl p-6">
          <h3 className="font-semibold text-2xl mb-6 text-blue-600 dark:text-blue-300 tracking-wide border-b pb-2 border-blue-300 dark:border-blue-700">
            Contact Us
          </h3>
          <ul className="space-y-5 text-blue-900 dark:text-blue-100">
            <li className="flex items-center gap-4">
              <FaMapMarkerAlt className="text-blue-600 dark:text-blue-400 text-xl" />
              Block-B, Sector-6, Uttara, Dhaka
            </li>
            <li className="flex items-center gap-4">
              <FaPhoneAlt className="text-blue-600 dark:text-blue-400 text-xl" />
              <a href="tel:+8801999999999" className="hover:text-blue-600 dark:hover:text-blue-300 transition">
                +880 1999 999 999
              </a>
            </li>
            <li className="flex items-center gap-4">
              <FaEnvelope className="text-blue-600 dark:text-blue-400 text-xl" />
              <a href="mailto:support@talksphere.com" className="hover:text-blue-600 dark:hover:text-blue-300 transition">
                support@talksphere.com
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter & Social Media */}
        <div className="backdrop-blur-md bg-white/70 dark:bg-white/5 rounded-3xl shadow-xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-2xl mb-6 text-blue-600 dark:text-blue-300 tracking-wide border-b pb-2 border-blue-300 dark:border-blue-700">
              Join Our Newsletter
            </h3>
            <form className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="p-3 rounded-lg text-blue-900 dark:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300 hover:from-blue-400 hover:to-blue-600 dark:hover:from-blue-300 dark:hover:to-blue-400 transition text-white font-bold py-2 rounded-lg shadow-md"
              >
                Subscribe
              </button>
            </form>
          </div>
          <div className="mt-8 flex space-x-5 text-blue-600 dark:text-blue-300 text-2xl">
            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, idx) => (
              <a
                key={idx}
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-900 dark:hover:text-white transition hover:scale-110"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <hr className="border-blue-300 dark:border-blue-700 opacity-40 my-8" />
      </div>

      <div className="bg-blue-100/80 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-center py-5 text-sm font-medium relative z-10">
        &copy; {new Date().getFullYear()} <span className="font-bold text-blue-600 dark:text-blue-400">TalkSphere</span>. All rights reserved.
        <br />
        <span className="text-blue-800 dark:text-blue-200">
          Designed with <span className="text-red-500 dark:text-red-400">♥</span> by Md. Raihan Islam
        </span>
      </div>
    </footer>
  );
};

export default Footer;
