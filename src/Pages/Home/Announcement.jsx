import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaBullhorn, FaCalendarAlt } from "react-icons/fa";
import useAxiosSesure from "../../Hooks/AxiosSeure/useAxiosSecure";

const Announcement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const axiosSecure = useAxiosSesure();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await axiosSecure.get("/announcements");
        setAnnouncements(res.data);
      } catch (err) {
        console.error("Failed to fetch announcements", err);
      }
    };
    fetchAnnouncements();
  }, []);

  if (!announcements || announcements.length === 0) return null;

  return (
    <section className="my-14 px-4 sm:px-8 md:px-16 pt-10">
      <div className="flex items-center gap-3 mb-6">
        <FaBullhorn className="text-3xl text-orange-500" />
        <h2 className="text-3xl font-extrabold text-gray-800">Latest Announcements</h2>
        <span className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white text-sm font-semibold px-3 py-1 rounded-full shadow">
          {announcements.length}
        </span>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {announcements.map((announcement, index) => (
          <motion.div
            key={announcement._id}
            className="bg-white border border-yellow-300 rounded-2xl shadow-md p-5 backdrop-blur-sm hover:shadow-xl transition duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <h3 className="text-xl font-bold text-orange-600 mb-2">{announcement.title}</h3>
            <p className="text-gray-700 mb-3">{announcement.message}</p>
            <div className="flex items-center justify-end text-sm text-gray-500">
              <FaCalendarAlt className="mr-1" />
              {new Date(announcement.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Announcement;
