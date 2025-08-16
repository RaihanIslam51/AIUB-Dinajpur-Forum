import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaBullhorn, FaCalendarAlt, FaChevronRight } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import useAxiosSesure from "../../Hooks/AxiosSeure/useAxiosSecure";

const Announcement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [dismissed, setDismissed] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosSecure = useAxiosSesure();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get("/announcements");
        setAnnouncements(res.data || []);
      } catch (err) {
        console.error("Failed to fetch announcements", err);
        setError("Failed to load announcements");
        setAnnouncements([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, [axiosSecure]);

  const handleDismiss = (id) => {
    setDismissed([...dismissed, id]);
  };

  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  // Filter out dismissed announcements and ensure announcements is an array
  const visibleAnnouncements = (announcements || [])
    .filter(announcement => 
      announcement && 
      announcement._id && 
      !dismissed.includes(announcement._id)
    );

  if (loading) {
    return (
      <section className="my-14 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl"></div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="my-14 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center py-8 text-red-500">
          {error}
        </div>
      </section>
    );
  }

  if (!visibleAnnouncements.length) {
    return null;
  }

  return (
    <section className="my-14 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-8 px-4"
      >
        <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-400 rounded-lg shadow-lg">
          <FaBullhorn className="text-2xl text-white" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Community Announcements</h2>
          <p className="text-gray-600">Important updates and news</p>
        </div>
        <span className="ml-auto bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-semibold">
          {visibleAnnouncements.length} New
        </span>
      </motion.div>

      {/* Announcements */}
      <div className="space-y-4">
        {visibleAnnouncements.map((announcement) => (
          announcement && (
            <motion.div
              key={announcement._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`bg-white rounded-xl shadow-md overflow-hidden border-l-4 ${announcement.priority === 'high' ? 'border-red-500' : 'border-orange-400'}`}
            >
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${announcement.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                        {announcement.priority === 'high' ? 'Important' : 'Update'}
                      </span>
                      <span className="text-sm text-gray-500 flex items-center">
                        <FaCalendarAlt className="mr-1" />
                        {new Date(announcement.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">{announcement.title}</h3>
                  </div>
                  <button 
                    onClick={() => handleDismiss(announcement._id)}
                    className="text-gray-400 hover:text-gray-600 transition"
                    aria-label="Dismiss announcement"
                  >
                    <IoMdClose />
                  </button>
                </div>

                <div className={`mt-3 text-gray-600 ${expanded === announcement._id ? 'block' : 'line-clamp-2'}`}>
                  {announcement.message}
                </div>

                {announcement.message && announcement.message.length > 100 && (
                  <button
                    onClick={() => toggleExpand(announcement._id)}
                    className="mt-2 text-orange-500 hover:text-orange-600 text-sm font-medium flex items-center"
                  >
                    {expanded === announcement._id ? 'Show less' : 'Read more'}
                    <FaChevronRight className={`ml-1 text-xs transition-transform ${expanded === announcement._id ? 'rotate-90' : ''}`} />
                  </button>
                )}
              </div>

              {announcement.link && (
                <div className="bg-gray-50 px-5 py-3 border-t border-gray-100">
                  <a
                    href={announcement.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium text-sm"
                  >
                    Learn more <FaChevronRight className="ml-1 text-xs" />
                  </a>
                </div>
              )}
            </motion.div>
          )
        ))}
      </div>
    </section>
  );
};

export default Announcement;