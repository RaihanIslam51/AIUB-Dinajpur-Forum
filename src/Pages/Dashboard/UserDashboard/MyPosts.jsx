import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { useContext } from 'react';
import { FaArrowDown, FaArrowUp, FaComments, FaEdit, FaPlus, FaRegClock, FaTrash } from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../Authantication/Context/AuthContext';
import useAuth from '../../../Hooks/AxiosSeure/useAuth';
import useAxiosSesure from '../../../Hooks/AxiosSeure/useAxiosSecure';

const MyPosts = () => {
  const { UserData } = useAuth();
  const axiosSecure = useAxiosSesure();
  const navigate = useNavigate();
  const { darkMode } = useContext(AuthContext);

  const {
    data: myPosts = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['myposts', UserData?.email],
    enabled: !!UserData?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/posts?email=${UserData.email}`);
      return res.data;
    },
  });

  const handleDelete = async (postId) => {
    const confirm = await Swal.fire({
      title: 'Delete Post?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6366f1',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      background: darkMode ? '#1f2937' : '#ffffff',
      color: darkMode ? 'white' : '#1f2937',
      backdrop: darkMode 
        ? 'rgba(0, 0, 0, 0.8)'
        : 'rgba(79, 70, 229, 0.2)',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/posts/${postId}`);
        if (res.data.deletedCount > 0) {
          await Swal.fire({
            title: 'Deleted!',
            text: 'Your post has been removed',
            icon: 'success',
            confirmButtonColor: '#6366f1',
            background: darkMode ? '#1f2937' : '#ffffff',
            color: darkMode ? 'white' : '#1f2937',
            timer: 1500,
            timerProgressBar: true,
          });
          refetch();
        }
      } catch (err) {
        Swal.fire({
          title: 'Error',
          text: 'Failed to delete post',
          icon: 'error',
          confirmButtonColor: '#6366f1',
          background: darkMode ? '#1f2937' : '#ffffff',
          color: darkMode ? 'white' : '#1f2937',
        });
      }
    }
  };

  const handleComment = (postId) => {
    navigate(`/dashboard/comment/${postId}`);
  };

  const handleEdit = (postId) => {
    navigate(`/dashboard/edit-post/${postId}`);
  };

  if (isLoading) {
    return (
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="mb-8">
          <Skeleton 
            height={32} 
            width={200} 
            baseColor={darkMode ? '#374151' : '#f3f4f6'} 
            highlightColor={darkMode ? '#4b5563' : '#e5e7eb'} 
          />
          <Skeleton 
            height={20} 
            width={150} 
            className="mt-2" 
            baseColor={darkMode ? '#374151' : '#f3f4f6'} 
            highlightColor={darkMode ? '#4b5563' : '#e5e7eb'} 
          />
        </div>
        
        <div className={`rounded-xl shadow-sm border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          {/* Header Skeleton */}
          <div className={`grid grid-cols-12 px-6 py-4 ${
            darkMode ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            {[...Array(5)].map((_, i) => (
              <Skeleton 
                key={i} 
                containerClassName={`col-span-${i === 0 ? 5 : i === 4 ? 1 : 2}`} 
                height={20} 
                baseColor={darkMode ? '#374151' : '#f3f4f6'} 
                highlightColor={darkMode ? '#4b5563' : '#e5e7eb'} 
              />
            ))}
          </div>
          
          {/* Content Skeleton */}
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`grid grid-cols-12 px-6 py-4 border-b ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="col-span-5 flex items-center">
                <Skeleton 
                  circle 
                  width={40} 
                  height={40} 
                  className="mr-4" 
                  baseColor={darkMode ? '#374151' : '#f3f4f6'} 
                  highlightColor={darkMode ? '#4b5563' : '#e5e7eb'} 
                />
                <div>
                  <Skeleton 
                    width={120} 
                    height={16} 
                    baseColor={darkMode ? '#374151' : '#f3f4f6'} 
                    highlightColor={darkMode ? '#4b5563' : '#e5e7eb'} 
                  />
                  <Skeleton 
                    width={80} 
                    height={12} 
                    className="mt-2" 
                    baseColor={darkMode ? '#374151' : '#f3f4f6'} 
                    highlightColor={darkMode ? '#4b5563' : '#e5e7eb'} 
                  />
                </div>
              </div>
              
              {[...Array(4)].map((_, j) => (
                <Skeleton 
                  key={j} 
                  containerClassName={`col-span-${j === 3 ? 1 : 2} flex items-center justify-center`} 
                  width={j === 3 ? 20 : 60} 
                  height={20} 
                  baseColor={darkMode ? '#374151' : '#f3f4f6'} 
                  highlightColor={darkMode ? '#4b5563' : '#e5e7eb'} 
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (myPosts.length === 0) {
    return (
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className={`flex flex-col items-center justify-center p-8 text-center rounded-xl ${
          darkMode ? 'bg-gray-800' : 'bg-gray-50'
        }`}>
          <div className={`p-6 rounded-full mb-6 ${
            darkMode ? 'bg-indigo-900/30' : 'bg-indigo-100'
          }`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-16 w-16 ${darkMode ? 'text-indigo-300' : 'text-indigo-500'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            No Posts Yet
          </h3>
          <p className={`max-w-md mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            You haven't created any posts yet. Start sharing your knowledge with the community!
          </p>
          <button
            onClick={() => navigate('/dashboard/add-post')}
            className={`px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-medium flex items-center gap-2 ${
              darkMode 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500'
                : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-400 hover:to-purple-400'
            }`}
          >
            <FaPlus /> Create Your First Post
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            My Posts
          </h1>
          <p className={`mt-1 text-sm sm:text-base ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {myPosts.length} {myPosts.length === 1 ? 'post' : 'posts'} created
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard/add-post')}
          className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg text-sm sm:text-base font-medium flex items-center gap-2 ${
            darkMode 
              ? 'bg-indigo-600 text-white hover:bg-indigo-500'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          } transition-colors`}
        >
          <FaPlus className="text-xs sm:text-sm" /> New Post
        </button>
      </div>

      <div className={`rounded-xl shadow-sm border overflow-hidden ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        {/* Table Header - Hidden on mobile */}
        <div className={`hidden sm:grid grid-cols-12 px-4 md:px-6 py-3 text-xs font-semibold uppercase tracking-wider ${
          darkMode ? 'bg-gray-700 border-b border-gray-600 text-gray-300' : 'bg-gray-50 border-b border-gray-200 text-gray-500'
        }`}>
          <div className="col-span-6 md:col-span-5">Title</div>
          <div className="col-span-2 text-center">Votes</div>
          <div className="col-span-2 text-center">Comments</div>
          <div className="col-span-1 md:col-span-2 text-center">Date</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        <div className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
          {myPosts.map((post) => (
            <div 
              key={post._id} 
              className={`grid grid-cols-1 sm:grid-cols-12 px-4 sm:px-6 py-4 transition-colors duration-150 ${
                darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
              }`}
            >
              {/* Title - Full width on mobile, then col-span-5 */}
              <div className="col-span-1 sm:col-span-6 md:col-span-5 flex items-center mb-3 sm:mb-0">
                <div className={`flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center mr-3 ${
                  darkMode ? 'bg-indigo-900/30' : 'bg-indigo-100'
                }`}>
                  <span className={darkMode ? 'text-indigo-300 font-medium' : 'text-indigo-600 font-medium'}>
                    {post.title.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`text-sm sm:text-base font-medium line-clamp-1 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    {post.title}
                  </h3>
                  <p className="text-xs mt-1 line-clamp-1">
                    {post.tag && (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                        darkMode 
                          ? 'bg-indigo-900/30 text-indigo-300' 
                          : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {post.tag}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Votes - Stacked on mobile, then col-span-2 */}
              <div className="col-span-1 sm:col-span-2 flex items-center justify-start sm:justify-center mb-3 sm:mb-0">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <span className="flex items-center text-green-500 text-sm sm:text-base">
                    <FaArrowUp className="mr-1" />
                    {post.upVote?.length || 0}
                  </span>
                  <span className="flex items-center text-red-500 text-sm sm:text-base">
                    <FaArrowDown className="mr-1" />
                    {post.downVote?.length || 0}
                  </span>
                  <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} hidden sm:inline`}>
                    {post.upVote?.length - post.downVote?.length || 0}
                  </span>
                </div>
              </div>

              {/* Comments - Stacked on mobile, then col-span-2 */}
              <div className="col-span-1 sm:col-span-2 flex items-center justify-start sm:justify-center mb-3 sm:mb-0">
                <button
                  onClick={() => handleComment(post._id)}
                  className={`inline-flex items-center px-3 py-1 border border-transparent text-xs sm:text-sm font-medium rounded-full shadow-sm text-white transition-colors duration-200 ${
                    darkMode 
                      ? 'bg-indigo-700 hover:bg-indigo-600' 
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  <FaComments className="mr-1" />
                  {post.comments?.length || 0}
                </button>
              </div>

              {/* Date - Stacked on mobile, then col-span-2 */}
              <div className={`col-span-1 sm:col-span-1 md:col-span-2 flex items-center justify-start sm:justify-center text-xs sm:text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              } mb-3 sm:mb-0`}>
                <FaRegClock className="mr-1.5 flex-shrink-0" />
                <span className="truncate">
                  {formatDistanceToNow(new Date(post.date), { addSuffix: true })}
                </span>
              </div>

              {/* Actions - Full width on mobile, then col-span-1 */}
              <div className="col-span-1 flex items-center justify-end sm:justify-end space-x-2">
                <button
                  onClick={() => handleEdit(post._id)}
                  className={`p-2 rounded-full transition-colors duration-200 ${
                    darkMode 
                      ? 'text-indigo-400 hover:text-indigo-300 hover:bg-indigo-900/30' 
                      : 'text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50'
                  }`}
                  aria-label="Edit post"
                >
                  <FaEdit className="text-sm sm:text-base" />
                </button>
                <button
                  onClick={() => handleDelete(post._id)}
                  className={`p-2 rounded-full transition-colors duration-200 ${
                    darkMode 
                      ? 'text-red-400 hover:text-red-300 hover:bg-red-900/30' 
                      : 'text-red-500 hover:text-red-700 hover:bg-red-50'
                  }`}
                  aria-label="Delete post"
                >
                  <FaTrash className="text-sm sm:text-base" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination - Only show if needed */}
      {myPosts.length > 10 && (
        <div className={`mt-6 flex flex-col sm:flex-row justify-between items-center text-sm ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <div className="mb-3 sm:mb-0">
            Showing <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>1</span> to{' '}
            <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{Math.min(10, myPosts.length)}</span> of{' '}
            <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{myPosts.length}</span> posts
          </div>
          <div className="flex space-x-2">
            <button
              disabled
              className={`px-3 py-1.5 rounded-md cursor-not-allowed text-sm ${
                darkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-100 text-gray-400'
              }`}
            >
              Previous
            </button>
            <button
              disabled
              className={`px-3 py-1.5 rounded-md cursor-not-allowed text-sm ${
                darkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-100 text-gray-400'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPosts;