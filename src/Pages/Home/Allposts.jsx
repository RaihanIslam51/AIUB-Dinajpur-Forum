import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaEnvelope,
  FaEye,
  FaFireAlt,
  FaHashtag,
  FaSortAmountDown,
  FaSortAmountUp,
  FaUser
} from "react-icons/fa";
import { useNavigate } from "react-router";
import useAxiosSesure from "../../Hooks/AxiosSeure/useAxiosSecure";

const POSTS_PER_PAGE = 5;

const Allposts = () => {
  const axiosSecure = useAxiosSesure();
  const [posts, setPosts] = useState([]);
  const [sortedByPopularity, setSortedByPopularity] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const res = await axiosSecure.get("/allpost");
      const sorted = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setPosts(sorted);
      setLoading(false);
    } catch {
      setError("Error fetching posts");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const sortByPopularity = () => {
    const sorted = [...posts].sort((a, b) => {
      const votesA = (a.upVote?.length || 0) - (a.downVote?.length || 0);
      const votesB = (b.upVote?.length || 0) - (b.downVote?.length || 0);
      return votesB - votesA;
    });
    setPosts(sorted);
    setSortedByPopularity(true);
    setCurrentPage(1);
  };

  const sortByNewest = () => {
    const sorted = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
    setPosts(sorted);
    setSortedByPopularity(false);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const currentPosts = posts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  const handleDetails = (id) => {
    navigate(`/postDetails/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="text-blue-600 text-5xl"
        >
          <FaFireAlt />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-600 py-8 text-xl">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <h2 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
          📢 All Community Posts
        </h2>
        <div className="flex gap-4">
          <button
            onClick={sortByNewest}
            disabled={!sortedByPopularity}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-400 ${
              !sortedByPopularity
                ? "bg-gradient-to-r from-blue-600 to-purple-700 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <FaSortAmountDown /> Newest
          </button>
          <button
            onClick={sortByPopularity}
            disabled={sortedByPopularity}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-400 ${
              sortedByPopularity
                ? "bg-gradient-to-r from-blue-600 to-purple-700 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <FaSortAmountUp /> Popularity
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {currentPosts.map((post) => {
          const votes = (post.upVote?.length || 0) - (post.downVote?.length || 0);
          return (
            <motion.article
              key={post._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              whileHover={{ scale: 1.03, boxShadow: "0 12px 30px rgba(59, 130, 246, 0.3)" }}
              className="relative flex flex-col bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200"
            >
              <div className="relative h-56 md:h-48 overflow-hidden rounded-t-3xl">
                <img
                  src={post.authorImage}
                  alt={post.authorName}
                  className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg absolute top-3 left-3 z-10"
                />
                <img
                  src="https://i.ibb.co/BV8WrQBY/community-ydyyyjq88jwv4nv6.jpg"
                  alt={post.title}
                  className="w-full h-full object-cover object-center filter brightness-75"
                  loading="lazy"
                />
                <div className="absolute top-3 right-3 bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-1 rounded-full text-white font-semibold text-sm flex items-center gap-2 shadow-lg">
                  <FaHashtag /> {post.tag}
                </div>
              </div>

              <div className="flex flex-col flex-grow p-6 gap-4">
                <h3 className="text-2xl font-bold text-gray-900 line-clamp-2">{post.title}</h3>
                <p className="text-gray-700 line-clamp-3">{post.description}</p>
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full shadow-inner">
                      <FaUser className="text-blue-600" />
                      <span>{post.authorName}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full shadow-inner">
                      <FaEnvelope className="text-green-600" />
                      <span>{post.authorEmail}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-auto">
                  <time
                    className="text-xs text-gray-400 italic"
                    title={new Date(post.date).toLocaleString()}
                  >
                    {new Date(post.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                  <button
                    onClick={() => handleDetails(post._id)}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-700 text-white px-5 py-2 rounded-full font-semibold shadow-lg hover:brightness-110 transition"
                    aria-label={`View details of ${post.title}`}
                  >
                    <FaEye /> Details
                  </button>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>

      <nav className="flex justify-center items-center mt-12 gap-3 flex-wrap">
        <motion.button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          whileTap={{ scale: 0.9 }}
          className="flex items-center gap-2 px-5 py-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 font-semibold shadow"
        >
          <FaArrowLeft /> Prev
        </motion.button>

        {[...Array(totalPages)].map((_, i) => (
          <motion.button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            whileTap={{ scale: 0.9 }}
            className={`px-5 py-2 rounded-full font-semibold shadow ${
              currentPage === i + 1
                ? "bg-gradient-to-r from-blue-600 to-purple-700 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {i + 1}
          </motion.button>
        ))}

        <motion.button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          whileTap={{ scale: 0.9 }}
          className="flex items-center gap-2 px-5 py-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 font-semibold shadow"
        >
          Next <FaArrowRight />
        </motion.button>
      </nav>
    </div>
  );
};

export default Allposts;
