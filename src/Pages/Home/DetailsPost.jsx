import { Skeleton } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  FaComments,
  FaEllipsisV,
  FaHashtag,
  FaRegClock,
  FaShareAlt,
  FaThumbsDown,
  FaThumbsUp,
  FaUser
} from "react-icons/fa";
import Markdown from "react-markdown";
import { useNavigate, useParams } from "react-router-dom";
import remarkGfm from "remark-gfm";
import useAuth from "../../Hooks/AxiosSeure/useAuth";
import useAxiosSesure from "../../Hooks/AxiosSeure/useAxiosSecure";

const DetailsPost = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSesure();
  const { UserData, darkMode } = useAuth(); // Assuming darkMode is available from useAuth
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [newComment, setNewComment] = useState("");
  const [upvoteEmails, setUpvoteEmails] = useState([]);
  const [downvoteEmails, setDownvoteEmails] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  // Fetch the post data
  const {
    data: post,
    isLoading,
    isError,
    error,
    refetch: refetchPost,
  } = useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await axiosSecure.get(`/allpost/${id}`);
      return res.data[0];
    },
    enabled: !!id,
  });

  // Fetch comments
  const {
    data: comments = [],
    isLoading: commentsLoading,
    refetch: refetchComments,
  } = useQuery({
    queryKey: ["comments", id],
    queryFn: async () => {
      if (!id) return [];
      const res = await axiosSecure.get(`/post/comments/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (post) {
      setUpvoteEmails(post.upVote || []);
      setDownvoteEmails(post.downVote || []);
    }
  }, [post]);

  const voteScore = upvoteEmails.length - downvoteEmails.length;
  const shareUrl = `${window.location.origin}/postDetails/${post?._id}`;
  const isAuthor = UserData?.email === post?.authorEmail;

  const handleVote = async (type) => {
    if (!UserData) {
      toast.error("Please log in to vote.");
      return;
    }

    const email = UserData.email;

    try {
      const res = await axiosSecure.patch(`/post/vote/${id}`, {
        email,
        type,
      });

      const updatedPost = res.data;
      setUpvoteEmails(updatedPost.upVote || []);
      setDownvoteEmails(updatedPost.downVote || []);
      toast.success(`Post ${type === "up" ? "upvoted" : "downvoted"}!`);
    } catch (error) {
      console.error("Failed to update vote:", error);
      toast.error("Failed to update vote, please try again.");
    }
  };

  const handleCommentSubmit = async () => {
    if (!UserData) {
      toast.error("Please log in to comment.");
      return;
    }
    if (!newComment.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }

    setSubmitting(true);
    try {
      await axiosSecure.post(`/post/comment/${id}`, {
        authorName: UserData.displayName || "Anonymous",
        authorEmail: UserData.email,
        authorImage: UserData.photoURL || "",
        comment: newComment.trim(),
      });

      setNewComment("");
      await refetchComments();
      toast.success("Comment added!");
    } catch (error) {
      console.error("Failed to submit comment:", error);
      toast.error("Failed to submit comment, please try again.");
    }
    setSubmitting(false);
  };

  const handleDeletePost = async () => {
    if (!isAuthor) return;
    
    try {
      await axiosSecure.delete(`/allpost/${id}`);
      toast.success("Post deleted successfully");
      navigate("/community");
    } catch (error) {
      console.error("Failed to delete post:", error);
      toast.error("Failed to delete post");
    }
  };

  if (isLoading) {
    return (
      <div className={`max-w-4xl mx-auto px-4 py-12 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="flex flex-col gap-8">
          {/* Post Header Skeleton */}
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <Skeleton 
              variant="circular" 
              width={120} 
              height={120} 
              sx={{ bgcolor: darkMode ? '#374151' : '#e5e7eb' }} 
            />
            <div className="flex-1 space-y-3">
              <Skeleton 
                variant="text" 
                width="80%" 
                height={40} 
                sx={{ bgcolor: darkMode ? '#374151' : '#e5e7eb' }} 
              />
              <Skeleton 
                variant="text" 
                width="60%" 
                height={30} 
                sx={{ bgcolor: darkMode ? '#374151' : '#e5e7eb' }} 
              />
              <Skeleton 
                variant="text" 
                width="40%" 
                height={20} 
                sx={{ bgcolor: darkMode ? '#374151' : '#e5e7eb' }} 
              />
            </div>
          </div>
          
          {/* Content Skeleton */}
          <div className="space-y-3">
            <Skeleton 
              variant="rectangular" 
              width="100%" 
              height={200} 
              sx={{ bgcolor: darkMode ? '#374151' : '#e5e7eb' }} 
            />
            <Skeleton 
              variant="text" 
              width="100%" 
              height={30} 
              sx={{ bgcolor: darkMode ? '#374151' : '#e5e7eb' }} 
            />
            <Skeleton 
              variant="text" 
              width="100%" 
              height={30} 
              sx={{ bgcolor: darkMode ? '#374151' : '#e5e7eb' }} 
            />
            <Skeleton 
              variant="text" 
              width="80%" 
              height={30} 
              sx={{ bgcolor: darkMode ? '#374151' : '#e5e7eb' }} 
            />
          </div>
          
          {/* Comments Skeleton */}
          <div className="space-y-4">
            <Skeleton 
              variant="text" 
              width={150} 
              height={40} 
              sx={{ bgcolor: darkMode ? '#374151' : '#e5e7eb' }} 
            />
            {[...Array(3)].map((_, i) => (
              <div 
                key={i} 
                className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Skeleton 
                    variant="circular" 
                    width={40} 
                    height={40} 
                    sx={{ bgcolor: darkMode ? '#4b5563' : '#e5e7eb' }} 
                  />
                  <Skeleton 
                    variant="text" 
                    width={120} 
                    height={20} 
                    sx={{ bgcolor: darkMode ? '#4b5563' : '#e5e7eb' }} 
                  />
                </div>
                <Skeleton 
                  variant="text" 
                  width="100%" 
                  height={60} 
                  sx={{ bgcolor: darkMode ? '#4b5563' : '#e5e7eb' }} 
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={`max-w-4xl mx-auto px-4 py-20 text-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`border-l-4 p-4 ${darkMode ? 'bg-gray-800 border-red-500' : 'bg-red-50 border-red-500'}`}>
          <h3 className={`text-lg font-medium ${darkMode ? 'text-red-400' : 'text-red-700'}`}>
            {error?.message || "Failed to load post"}
          </h3>
          <button
            onClick={() => refetchPost()}
            className={`mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
              darkMode ? 'bg-red-700 hover:bg-red-800' : 'bg-red-600 hover:bg-red-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className={`max-w-4xl mx-auto px-4 py-20 text-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`border-l-4 p-4 ${darkMode ? 'bg-gray-800 border-blue-500' : 'bg-blue-50 border-blue-500'}`}>
          <h3 className={`text-lg font-medium ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>
            Post not found
          </h3>
          <button
            onClick={() => navigate(-1)}
            className={`mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
              darkMode ? 'bg-blue-700 hover:bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: darkMode ? '#1f2937' : '#fff',
            color: darkMode ? '#f3f4f6' : '#111827',
            boxShadow: darkMode ? '0 4px 6px -1px rgba(0, 0, 0, 0.5)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          },
        }}
      />
      <main className={`max-w-4xl mx-auto pt-15 px-4 py-8 min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
        {/* Post Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row gap-6 items-start md:items-center mb-8 relative"
        >
          <div className="relative">
            <img
              src={post.authorImage || "https://i.ibb.co/4Y8xJyM/default-avatar.jpg"}
              alt={post.authorName}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 shadow-lg"
              style={{ borderColor: darkMode ? '#374151' : '#fff' }}
              loading="lazy"
            />
            {isAuthor && (
              <button 
                onClick={() => setShowOptions(!showOptions)}
                className={`absolute -bottom-2 -right-2 p-2 rounded-full shadow-md ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <FaEllipsisV className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
              </button>
            )}
            {showOptions && (
              <div className={`absolute right-0 bottom-0 translate-y-full shadow-lg rounded-lg overflow-hidden z-10 ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}
              >
                <button 
                  onClick={handleDeletePost}
                  className={`px-4 py-2 w-full text-left ${
                    darkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-red-50'
                  }`}
                >
                  Delete Post
                </button>
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${
              darkMode ? 'text-gray-100' : 'text-gray-900'
            }`}>
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4">
              <div className={`flex items-center gap-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <FaUser className="text-blue-500" />
                <span>{post.authorName}</span>
              </div>
              <div className={`flex items-center gap-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <FaRegClock className="text-blue-500" />
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
                </time>
              </div>
              <div className="flex items-center gap-2">
                <FaHashtag className="text-blue-500" />
                <span className={`px-3 py-1 rounded-full text-sm ${
                  darkMode ? 'bg-gray-700 text-blue-400' : 'bg-blue-100 text-blue-700'
                }`}>
                  {post.tag}
                </span>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Post Content */}
        <motion.article
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`prose prose-lg max-w-none rounded-xl shadow-sm p-6 mb-8 border ${
            darkMode 
              ? 'bg-gray-800 border-gray-700 prose-invert' 
              : 'bg-white border-gray-200'
          }`}
        >
          <Markdown remarkPlugins={[remarkGfm]}>
            {post.description}
          </Markdown>
        </motion.article>

        {/* Voting and Sharing */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-between items-center gap-4 mb-12"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleVote("up")}
              disabled={!UserData}
              className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium ${
                UserData
                  ? darkMode
                    ? 'bg-green-900/50 text-green-400 hover:bg-green-900'
                    : 'bg-green-50 text-green-700 hover:bg-green-100'
                  : darkMode
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <FaThumbsUp /> Upvote ({upvoteEmails.length})
            </button>
            <div className={`text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              {voteScore}
            </div>
            <button
              onClick={() => handleVote("down")}
              disabled={!UserData}
              className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium ${
                UserData
                  ? darkMode
                    ? 'bg-red-900/50 text-red-400 hover:bg-red-900'
                    : 'bg-red-50 text-red-700 hover:bg-red-100'
                  : darkMode
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <FaThumbsDown /> Downvote ({downvoteEmails.length})
            </button>
          </div>

          <button
            onClick={() => {
              if (!UserData) {
                toast.error("Please log in to share.");
                return;
              }
              navigator.clipboard.writeText(shareUrl);
              toast.success("Link copied to clipboard!");
            }}
            className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium ${
              darkMode
                ? 'bg-blue-900/50 text-blue-400 hover:bg-blue-900'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            <FaShareAlt /> Share
          </button>
        </motion.section>

        {/* Comments Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={`rounded-xl shadow-sm p-6 border ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-center gap-3 mb-6">
            <FaComments className="text-2xl text-blue-500" />
            <h2 className={`text-2xl font-bold ${
              darkMode ? 'text-gray-100' : 'text-gray-900'
            }`}>
              Comments ({comments.length})
            </h2>
          </div>

          {/* Comment Form */}
          {UserData ? (
            <form onSubmit={(e) => {
              e.preventDefault();
              handleCommentSubmit();
            }} className="mb-8">
              <div className="flex gap-4 items-start">
                <img
                  src={UserData.photoURL || "https://i.ibb.co/4Y8xJyM/default-avatar.jpg"}
                  alt={UserData.displayName || "User"}
                  className="w-12 h-12 rounded-full object-cover border-2 shadow"
                  style={{ borderColor: darkMode ? '#374151' : '#fff' }}
                  loading="lazy"
                />
                <div className="flex-1">
                  <textarea
                    className={`w-full p-4 rounded-lg focus:outline-none focus:ring-2 ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-gray-100 focus:ring-blue-500'
                        : 'border border-gray-300 focus:ring-blue-500 focus:border-transparent'
                    }`}
                    rows={4}
                    placeholder="Write your comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                    disabled={submitting}
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`mt-3 px-6 py-2 text-white rounded-lg font-medium ${
                      darkMode
                        ? 'bg-blue-700 hover:bg-blue-600 disabled:bg-blue-800'
                        : 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-500'
                    } disabled:opacity-50`}
                  >
                    {submitting ? "Posting..." : "Post Comment"}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className={`border-l-4 p-4 mb-6 ${
              darkMode ? 'bg-gray-800 border-blue-500' : 'bg-blue-50 border-blue-500'
            }`}
            >
              <p className={darkMode ? 'text-blue-400' : 'text-blue-700'}>
                Please log in to leave a comment.
              </p>
            </div>
          )}

          {/* Comments List */}
          {commentsLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton 
                    variant="circular" 
                    width={48} 
                    height={48} 
                    sx={{ bgcolor: darkMode ? '#4b5563' : '#e5e7eb' }} 
                  />
                  <div className="flex-1 space-y-2">
                    <Skeleton 
                      variant="text" 
                      width="40%" 
                      height={24} 
                      sx={{ bgcolor: darkMode ? '#4b5563' : '#e5e7eb' }} 
                    />
                    <Skeleton 
                      variant="text" 
                      width="100%" 
                      height={60} 
                      sx={{ bgcolor: darkMode ? '#4b5563' : '#e5e7eb' }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : comments.length === 0 ? (
            <div className={`text-center py-8 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              No comments yet. Be the first to comment!
            </div>
          ) : (
            <div className="space-y-6">
              {comments.map((comment) => (
                <motion.div
                  key={comment._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4"
                >
                  <img
                    src={comment.authorImage || "https://i.ibb.co/4Y8xJyM/default-avatar.jpg"}
                    alt={comment.authorName}
                    className="w-12 h-12 rounded-full object-cover border-2 shadow flex-shrink-0"
                    style={{ borderColor: darkMode ? '#374151' : '#fff' }}
                    loading="lazy"
                  />
                  <div className={`flex-1 p-4 rounded-lg ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className={`font-medium ${
                        darkMode ? 'text-gray-100' : 'text-gray-900'
                      }`}>
                        {comment.authorName}
                      </h4>
                      <time
                        dateTime={comment.date}
                        className={`text-xs ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        {new Date(comment.date).toLocaleString()}
                      </time>
                    </div>
                    <p className={`whitespace-pre-wrap ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {comment.comment}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </main>
    </>
  );
};

export default DetailsPost;