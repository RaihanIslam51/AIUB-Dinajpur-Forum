import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaCalendarAlt, FaSearch, FaTags, FaThumbsDown, FaThumbsUp, FaUser } from 'react-icons/fa';
import useAxiosSecure from '../../Hooks/AxiosSeure/useAxiosSecure';

const Banner = () => {
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState('');
  const [submittedTerm, setSubmittedTerm] = useState('');

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
    <section className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4 sm:px-10 py-20 flex flex-col items-center justify-start">
      <div className="max-w-3xl text-center space-y-6">
        <motion.h1
          className="text-4xl sm:text-5xl font-extrabold text-gray-800 leading-tight"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          🔍 Discover Posts by Tag
        </motion.h1>

        <form onSubmit={handleSearch} className="relative w-full max-w-xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-4 rounded-full border border-blue-300 shadow-md bg-white/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              placeholder="e.g. JavaScript, React, Design"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition shadow flex items-center gap-2"
            >
              <FaSearch />
              Search
            </button>
          </div>
        </form>
      </div>

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
            <p className="text-center text-gray-500">Loading posts...</p>
          ) : posts.length === 0 ? (
            <p className="text-center text-red-500 font-medium">No posts found for this tag.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <motion.div
                  key={post._id}
                  className="bg-white/60 backdrop-blur-md border border-blue-200 rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <FaUser className="text-blue-600" />
                    <span className="font-medium">{post.authorName}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h3>
                  <p className="text-gray-700 line-clamp-3 mb-2">{post.content}</p>

                  <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-2">
                    <div className="flex items-center gap-1">
                      <FaThumbsUp className="text-green-500" />
                      {post.upVote}
                    </div>
                    <div className="flex items-center gap-1">
                      <FaThumbsDown className="text-red-500" />
                      {post.downVote}
                    </div>
                    <div className="flex items-center gap-1">
                      <FaCalendarAlt className="text-blue-500" />
                      {formatDate(post.date)}
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                    <FaTags className="text-yellow-600" />
                    <span className="font-medium text-gray-700">Tags: {post.tag}</span>{' '}
                    {post.tags?.join(', ')}
                  </p>
                  <p className="text-sm text-gray-600">{post.description}</p>
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
