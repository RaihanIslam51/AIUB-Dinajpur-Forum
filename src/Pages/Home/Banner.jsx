import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaCalendarAlt, FaSearch, FaTags, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import useAxiosSecure from '../../Hooks/AxiosSeure/useAxiosSecure';

const Banner = () => {
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState('');
  const [submittedTerm, setSubmittedTerm] = useState('');
  const navigate = useNavigate();

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['searchPosts', submittedTerm],
    enabled: !!submittedTerm,
    queryFn: async () => {
      const res = await axiosSecure.get(`/addposts?tag=${submittedTerm}`);
      return res.data;
    },
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSubmittedTerm(searchTerm.trim());
    }
  };

  const formatDate = (isoDate) =>
    new Date(isoDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  return (
    <section className="min-h-screen bg-gradient-to-tr from-blue-50 via-white to-blue-100 px-4 sm:px-10 py-20 flex flex-col items-center">
      {/* Heading & Search */}
      <div className="max-w-3xl w-full text-center space-y-8 mb-12">
        <motion.h1
          className="text-5xl font-extrabold text-gray-800 tracking-tight leading-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          🔍 Explore Posts by Tags
        </motion.h1>

        <form onSubmit={handleSearch} className="relative w-full">
          <div className="relative w-full">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 rounded-full border border-gray-300 shadow-md bg-white/80 backdrop-blur-sm text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              placeholder="Search tags like React, UX, JavaScript..."
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-all duration-300 shadow-md flex items-center gap-2"
            >
              <FaSearch /> Search
            </button>
          </div>
        </form>
      </div>

      {/* Welcome Message */}
      {!submittedTerm && (
        <motion.div
          className="text-center max-w-2xl text-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-semibold mb-3">Welcome to DevCommunity</h2>
          <p className="text-lg leading-relaxed">
            A place to discover insights, explore trending tech, and connect with a vibrant
            developer community. Use the search bar above to find posts by tag or start sharing your own!
          </p>
        </motion.div>
      )}

      {/* Search Results */}
      {submittedTerm && (
        <motion.div
          className="w-full max-w-6xl mt-14"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
            Showing results for: <span className="text-blue-600">"{submittedTerm}"</span>
          </h2>

          {isLoading ? (
            <p className="text-center text-gray-500 animate-pulse">Loading posts...</p>
          ) : posts.length === 0 ? (
            <p className="text-center text-red-500 font-medium">No posts found for this tag.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <motion.div
                  key={post._id}
                  className="bg-white/70 backdrop-blur-lg border border-gray-200 rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <FaUser className="text-blue-600" />
                    <span className="font-medium">{post.authorName}</span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h3>

                  <p className="text-gray-700 line-clamp-3 mb-3">{post.content}</p>

                  <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <FaCalendarAlt className="text-blue-500" />
                      {formatDate(post.date)}
                    </div>
                    <div className="flex items-center gap-1">
                      <FaTags className="text-yellow-600" />
                      <span>{post.tag} {post.tags?.length > 0 && `, ${post.tags.join(', ')}`}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">{post.description}</p>

                  <button
                    onClick={() => navigate(`/postDetails/${post._id}`)}
                    className="mt-auto px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:shadow-lg hover:scale-105 transition duration-300"
                  >
                    View Details
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </section>
  );
};

export default Banner;
