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
    <footer className="bg-gradient-to-br from-white via-blue-50 to-white text-black pt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* Logo & Description */}
        <div className="rounded-3xl shadow-xl p-6 bg-white hover:shadow-2xl transition-all duration-300">
          <h2 className="text-3xl font-extrabold mb-3 flex items-center gap-3 text-blue-700">
            🗨️ <span>TalkSphere</span>
          </h2>
          <p className="text-gray-700 leading-relaxed">
            A vibrant space where voices connect, ideas grow, and communities engage. Join conversations. Share perspectives. Be heard.
          </p>
        </div>

        {/* Quick Links */}
        <div className="rounded-3xl shadow-xl p-6 bg-white hover:shadow-2xl transition-all duration-300">
          <h3 className="text-xl font-semibold text-blue-700 border-b-2 border-blue-300 pb-2 mb-4">
            Quick Links
          </h3>
          <ul className="space-y-3 text-gray-800 font-medium">
            {["Home", "Topics", "Members", "Discussions", "Contact"].map((item) => (
              <li key={item}>
                <a
                  href={`#${item.toLowerCase()}`}
                  className="hover:text-blue-600 transition-all duration-200"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="rounded-3xl shadow-xl p-6 bg-white hover:shadow-2xl transition-all duration-300">
          <h3 className="text-xl font-semibold text-blue-700 border-b-2 border-blue-300 pb-2 mb-4">
            Contact Us
          </h3>
          <ul className="space-y-4 text-gray-800">
            <li className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-blue-600" />
              Block-B, Sector-6, Uttara, Dhaka
            </li>
            <li className="flex items-center gap-3">
              <FaPhoneAlt className="text-blue-600" />
              <a href="tel:+8801999999999" className="hover:text-blue-600 transition">
                +880 1999 999 999
              </a>
            </li>
            <li className="flex items-center gap-3">
              <FaEnvelope className="text-blue-600" />
              <a
                href="mailto:support@talksphere.com"
                className="hover:text-blue-600 transition"
              >
                support@talksphere.com
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter & Social Links */}
        <div className="rounded-3xl shadow-xl p-6 bg-white hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-semibold text-blue-700 border-b-2 border-blue-300 pb-2 mb-4">
              Join Our Newsletter
            </h3>
            <form className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-2 rounded-xl shadow"
              >
                Subscribe
              </button>
            </form>
          </div>
          <div className="mt-6 flex space-x-4 text-blue-600 text-xl">
            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, idx) => (
              <a
                key={idx}
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-black transition duration-300 transform hover:scale-110"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <hr className="border-gray-300 my-10" />
      </div>

      {/* Bottom Text */}
      <div className="text-center pb-6 text-sm text-gray-700">
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <span className="font-bold text-blue-600">TalkSphere</span>. All rights reserved.
        </p>
        <p>
          Designed with <span className="text-red-500">♥</span> by{" "}
          <span className="font-medium text-blue-600">Md. Raihan Islam</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
