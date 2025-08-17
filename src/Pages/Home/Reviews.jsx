import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { FaCode, FaEdit, FaEllipsisV, FaRegStar, FaReply, FaStar, FaTrash, FaUserCircle } from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';
import useAuth from '../../Hooks/AxiosSeure/useAuth';


const Reviews = () => {
  const { user, darkMode } = useAuth();
  const [reviews, setReviews] = useState([
    {
      id: 1,
      userId: 'user1',
      userName: 'Alex Johnson',
      userAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      userRole: 'Senior Developer',
      rating: 5,
      comment: 'This project is incredibly well-structured. The documentation made it easy to get started, and the code quality is exceptional. Would definitely recommend!',
      date: '2023-10-15T14:30:00Z',
      replies: [
        {
          id: 101,
          userId: 'user2',
          userName: 'Sarah Miller',
          userAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
          comment: 'Thanks Alex! We put a lot of effort into the documentation.',
          date: '2023-10-15T16:45:00Z'
        }
      ]
    },
    {
      id: 2,
      userId: 'user3',
      userName: 'CodeMaster2000',
      userAvatar: null,
      userRole: 'Open Source Contributor',
      rating: 4,
      comment: 'Great work overall. The only suggestion I have is to add more test coverage for the edge cases.',
      date: '2023-10-12T09:15:00Z',
      replies: []
    },
    {
      id: 3,
      userId: 'user4',
      userName: 'Anonymous',
      userAvatar: null,
      userRole: null,
      rating: 3,
      comment: 'The project works as described, but the learning curve is a bit steep for beginners.',
      date: '2023-10-10T18:20:00Z',
      replies: []
    }
  ]);

  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: '',
    isAnonymous: false
  });

  const [editingId, setEditingId] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [showOptionsId, setShowOptionsId] = useState(null);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!newReview.rating) {
      toast.error('Please select a rating');
      return;
    }

    const review = {
      id: Date.now(),
      userId: user?.id || 'guest',
      userName: newReview.isAnonymous ? 'Anonymous' : user?.name || 'Guest User',
      userAvatar: newReview.isAnonymous ? null : user?.avatar,
      userRole: user?.role || 'Developer',
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString(),
      replies: []
    };

    setReviews([review, ...reviews]);
    setNewReview({ rating: 0, comment: '', isAnonymous: false });
    toast.success('Review submitted!');
  };

  const handleUpdateReview = () => {
    setReviews(reviews.map(review => 
      review.id === editingId 
        ? { ...review, comment: newReview.comment, rating: newReview.rating } 
        : review
    ));
    setEditingId(null);
    setNewReview({ rating: 0, comment: '', isAnonymous: false });
    toast.success('Review updated!');
  };

  const handleDeleteReview = (id) => {
    setReviews(reviews.filter(review => review.id !== id));
    toast.success('Review deleted');
    setShowOptionsId(null);
  };

  const handleSubmitReply = (reviewId) => {
    if (!replyContent.trim()) {
      toast.error('Reply cannot be empty');
      return;
    }

    const reply = {
      id: Date.now(),
      userId: user?.id || 'guest',
      userName: user?.name || 'You',
      userAvatar: user?.avatar,
      comment: replyContent,
      date: new Date().toISOString()
    };

    setReviews(reviews.map(review => 
      review.id === reviewId
        ? { ...review, replies: [...review.replies, reply] }
        : review
    ));

    setReplyContent('');
    setReplyingTo(null);
    toast.success('Reply added!');
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
        {i < rating ? <FaStar /> : <FaRegStar />}
      </span>
    ));
  };

  return (
    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
        <FaCode className="text-blue-500" /> Project Reviews
      </h2>

      {/* Review Form */}
      <div className={`mb-8 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          {editingId ? 'Edit Your Review' : 'Write a Review'}
        </h3>
        <form onSubmit={editingId ? handleUpdateReview : handleSubmitReview}>
          <div className="flex items-center mb-4">
            <span className={`mr-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Rating:</span>
            {[...Array(5)].map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setNewReview({...newReview, rating: i + 1})}
                className="focus:outline-none"
              >
                {i < newReview.rating ? (
                  <FaStar className={`text-xl ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
                ) : (
                  <FaRegStar className={`text-xl ${darkMode ? 'text-gray-400' : 'text-gray-300'}`} />
                )}
              </button>
            ))}
          </div>
          <textarea
            className={`w-full p-3 rounded-lg mb-3 focus:outline-none focus:ring-2 ${
              darkMode
                ? 'bg-gray-600 text-gray-100 border-gray-500 focus:ring-blue-400'
                : 'bg-white text-gray-800 border-gray-300 focus:ring-blue-500'
            }`}
            rows="4"
            placeholder="Share your experience with this project..."
            value={newReview.comment}
            onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
            required
          />
          <div className="flex justify-between items-center">
            <label className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <input
                type="checkbox"
                checked={newReview.isAnonymous}
                onChange={(e) => setNewReview({...newReview, isAnonymous: e.target.checked})}
                className="mr-2"
              />
              Post anonymously
            </label>
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                darkMode
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {editingId ? 'Update Review' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <p className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No reviews yet. Be the first to share your thoughts!
          </p>
        ) : (
          reviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`rounded-lg overflow-hidden ${
                darkMode ? 'bg-gray-700' : 'bg-white border border-gray-200'
              }`}
            >
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    {review.userAvatar ? (
                      <img
                        src={review.userAvatar}
                        alt={review.userName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <FaUserCircle className={`text-3xl ${darkMode ? 'text-gray-400' : 'text-gray-300'}`} />
                    )}
                    <div>
                      <h4 className={`font-medium ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                        {review.userName}
                        {review.userRole && (
                          <span className={`ml-2 text-xs px-2 py-1 rounded ${
                            darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'
                          }`}>
                            {review.userRole}
                          </span>
                        )}
                      </h4>
                      <div className="flex items-center gap-1 mb-1">
                        {renderStars(review.rating)}
                      </div>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {new Date(review.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  {(user?.id === review.userId || user?.role === 'admin') && (
                    <div className="relative">
                      <button
                        onClick={() => setShowOptionsId(showOptionsId === review.id ? null : review.id)}
                        className={`p-1 rounded-full ${
                          darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'
                        }`}
                      >
                        <FaEllipsisV className={darkMode ? 'text-gray-300' : 'text-gray-500'} />
                      </button>
                      {showOptionsId === review.id && (
                        <div className={`absolute right-0 mt-1 w-32 rounded-md shadow-lg z-10 ${
                          darkMode ? 'bg-gray-600' : 'bg-white border border-gray-200'
                        }`}
                        >
                          <button
                            onClick={() => {
                              setEditingId(review.id);
                              setNewReview({
                                rating: review.rating,
                                comment: review.comment,
                                isAnonymous: review.userName === 'Anonymous'
                              });
                              setShowOptionsId(null);
                            }}
                            className={`flex items-center gap-2 w-full px-3 py-2 text-left ${
                              darkMode ? 'hover:bg-gray-500' : 'hover:bg-gray-100'
                            }`}
                          >
                            <FaEdit className="text-blue-500" /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteReview(review.id)}
                            className={`flex items-center gap-2 w-full px-3 py-2 text-left ${
                              darkMode ? 'hover:bg-gray-500' : 'hover:bg-gray-100'
                            }`}
                          >
                            <FaTrash className="text-red-500" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <p className={`mt-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  {review.comment}
                </p>
                <div className="mt-3 flex justify-between items-center">
                  <button
                    onClick={() => setReplyingTo(replyingTo === review.id ? null : review.id)}
                    className={`flex items-center gap-1 text-sm ${
                      darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
                    }`}
                  >
                    <FaReply /> Reply
                  </button>
                  {review.replies.length > 0 && (
                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {review.replies.length} {review.replies.length === 1 ? 'reply' : 'replies'}
                    </span>
                  )}
                </div>
              </div>

              {/* Reply Form */}
              <AnimatePresence>
                {replyingTo === review.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`overflow-hidden ${
                      darkMode ? 'bg-gray-600' : 'bg-gray-50'
                    }`}
                  >
                    <div className="p-4 border-t flex gap-3">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <FaUserCircle className={`text-2xl ${darkMode ? 'text-gray-400' : 'text-gray-300'}`} />
                      )}
                      <div className="flex-1">
                        <textarea
                          className={`w-full p-2 rounded-lg text-sm focus:outline-none focus:ring-1 ${
                            darkMode
                              ? 'bg-gray-500 text-gray-100 border-gray-400 focus:ring-blue-400'
                              : 'bg-white text-gray-800 border-gray-300 focus:ring-blue-500'
                          }`}
                          rows="2"
                          placeholder="Write your reply..."
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                        />
                        <div className="flex justify-end mt-2">
                          <button
                            onClick={() => handleSubmitReply(review.id)}
                            className={`px-3 py-1 text-sm rounded-lg flex items-center gap-1 ${
                              darkMode
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                            }`}
                          >
                            <IoMdSend /> Send
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Replies List */}
              {review.replies.length > 0 && (
                <div className={`border-t ${
                  darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-200 bg-gray-50'
                }`}
                >
                  {review.replies.map((reply) => (
                    <motion.div
                      key={reply.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 pl-12 flex gap-3"
                    >
                      {reply.userAvatar ? (
                        <img
                          src={reply.userAvatar}
                          alt={reply.userName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <FaUserCircle className={`text-2xl ${darkMode ? 'text-gray-400' : 'text-gray-300'}`} />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className={`font-medium text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            {reply.userName}
                          </h5>
                          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {new Date(reply.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <p className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {reply.comment}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Reviews;