import { Skeleton } from "@mui/material";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCommentAlt,
  FaFireAlt,
  FaHashtag,
  FaRegClock,
  FaSortAmountDown,
  FaThumbsUp
} from "react-icons/fa";
import { useNavigate } from "react-router";
import useAxiosSesure from "../../Hooks/AxiosSeure/useAxiosSecure";

const POSTS_PER_PAGE = 6;

const AllPosts = () => {
  const axiosSecure = useAxiosSesure();
  const [posts, setPosts] = useState([]);
  const [sortedByPopularity, setSortedByPopularity] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/allpost");
      const sorted = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setPosts(sorted);
    } catch (err) {
      setError("Failed to fetch posts. Please try again later.");
      console.error("Error fetching posts:", err);
    } finally {
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <Skeleton variant="text" width={300} height={50} />
          <div className="flex gap-4">
            <Skeleton variant="rounded" width={150} height={50} />
            <Skeleton variant="rounded" width={150} height={50} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="rounded-2xl overflow-hidden shadow-md">
              <Skeleton variant="rectangular" width="100%" height={200} />
              <div className="p-6">
                <Skeleton variant="text" width="80%" height={30} />
                <Skeleton variant="text" width="100%" height={20} />
                <Skeleton variant="text" width="100%" height={20} />
                <Skeleton variant="text" width="60%" height={20} />
                <div className="flex justify-between mt-4">
                  <Skeleton variant="circular" width={40} height={40} />
                  <Skeleton variant="rounded" width={100} height={40} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 text-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-lg font-medium text-red-700">{error}</p>
              <button 
                onClick={fetchPosts}
                className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Header with sorting options */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Community Discussions
          </h2>
          <p className="text-gray-600">
            {posts.length} posts shared by our community members
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={sortByNewest}
            disabled={!sortedByPopularity}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              !sortedByPopularity
                ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FaSortAmountDown className="text-lg" /> 
            <span>Newest</span>
          </button>
          <button
            onClick={sortByPopularity}
            disabled={sortedByPopularity}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              sortedByPopularity
                ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FaFireAlt className="text-lg" />
            <span>Popular</span>
          </button>
        </div>
      </div>

      {/* Posts Grid */}
      {currentPosts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentPosts.map((post) => {
              const votes = (post.upVote?.length || 0) - (post.downVote?.length || 0);
              const commentCount = post.comments?.length || 0;
              
              return (
                <motion.article
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5 }}
                  className="flex flex-col bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  {/* Post Header */}
                  <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                    <img
                      src={post.authorImage || "https://i.ibb.co/4Y8xJyM/default-avatar.jpg"}
                      alt={post.authorName}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">{post.authorName}</h4>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <FaRegClock className="text-xs" />
                        <time dateTime={post.date}>
                          {new Date(post.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </time>
                      </div>
                    </div>
                    <div className="ml-auto bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <FaHashtag /> {post.tag}
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="p-6 flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.description}
                    </p>
                  </div>

                  {/* Post Footer */}
                  <div className="px-6 pb-4 pt-2 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-gray-600">
                          <FaThumbsUp className="text-blue-500" />
                          <span className="text-sm font-medium">{votes}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <FaCommentAlt className="text-green-500" />
                          <span className="text-sm font-medium">{commentCount}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDetails(post._id)}
                        className="text-sm font-medium px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                      >
                        View Post
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  <FaArrowLeft className="mr-2" /> Previous
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                        currentPage === pageNum
                          ? "bg-blue-50 border-blue-500 text-blue-600"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next <FaArrowRight className="ml-2" />
                </button>
              </nav>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="mt-3 text-lg font-medium text-gray-900">No posts yet</h3>
          <p className="mt-1 text-gray-500">Be the first to share something with the community!</p>
          <div className="mt-6">
            <button
              onClick={() => navigate('/create-post')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllPosts;