import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { FaArrowDown, FaArrowUp, FaComments, FaRegClock, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import useAuth from '../../../Hooks/AxiosSeure/useAuth';
import useAxiosSesure from '../../../Hooks/AxiosSeure/useAxiosSecure';

const MyPosts = () => {
  const { UserData } = useAuth();
  const axiosSecure = useAxiosSesure();
  const navigate = useNavigate();

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
      background: '#ffffff',
      backdrop: `
        rgba(79, 70, 229, 0.2)
        url("/images/nyan-cat.gif")
        left top
        no-repeat
      `,
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
          confirmButtonColor: '#6366f1'
        });
      }
    }
  };

  const handleComment = (postId) => {
    navigate(`/dashboard/comment/${postId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-indigo-600 font-medium">Loading your posts...</p>
        </div>
      </div>
    );
  }

  if (myPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
        <div className="bg-indigo-50 p-6 rounded-full mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-indigo-400"
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
        <h3 className="text-2xl font-bold text-gray-700 mb-2">No Posts Yet</h3>
        <p className="text-gray-500 max-w-md mb-6">
          You haven't created any posts yet. Start sharing your knowledge with the community!
        </p>
        <button
          onClick={() => navigate('/dashboard/add-post')}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-medium"
        >
          Create Your First Post
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Posts</h1>
          <p className="text-gray-500 mt-2">
            {myPosts.length} {myPosts.length === 1 ? 'post' : 'posts'} created
          </p>
        </div>
        {/* <button
          onClick={() => navigate('/dashboard/add-post')}
          className="mt-4 sm:mt-0 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow transition-colors duration-300 font-medium flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          New Post
        </button> */}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-12 bg-gray-50 border-b border-gray-200 px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <div className="col-span-5">Title</div>
          <div className="col-span-2 text-center">Votes</div>
          <div className="col-span-2 text-center">Comments</div>
          <div className="col-span-2 text-center">Date</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        <div className="divide-y divide-gray-200">
          {myPosts.map((post) => (
            <div key={post._id} className="grid grid-cols-12 px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
              <div className="col-span-5 flex items-center">
                <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-indigo-600 font-medium">
                    {post.title.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-800 line-clamp-1">
                    {post.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                    {post.tag && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 capitalize">
                        {post.tag}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="col-span-2 flex items-center justify-center">
                <div className="flex items-center space-x-2">
                  <span className="flex items-center text-green-500">
                    <FaArrowUp className="mr-1" />
                    {post.upVote?.length || 0}
                  </span>
                  <span className="flex items-center text-red-500">
                    <FaArrowDown className="mr-1" />
                    {post.downVote?.length || 0}
                  </span>
                  <span className="font-medium text-gray-700">
                    {post.upVote?.length - post.downVote?.length || 0}
                  </span>
                </div>
              </div>

              <div className="col-span-2 flex items-center justify-center">
                <button
                  onClick={() => handleComment(post._id)}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  <FaComments className="mr-1" />
                  {post.comments?.length || 0}
                </button>
              </div>

              <div className="col-span-2 flex items-center justify-center text-sm text-gray-500">
                <FaRegClock className="mr-1.5" />
                {formatDistanceToNow(new Date(post.date), { addSuffix: true })}
              </div>

              <div className="col-span-1 flex items-center justify-end">
                <button
                  onClick={() => handleDelete(post._id)}
                  className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50 transition-colors duration-200"
                  aria-label="Delete post"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-between items-center text-sm text-gray-500">
        <div>
          Showing <span className="font-medium">1</span> to{' '}
          <span className="font-medium">{myPosts.length}</span> of{' '}
          <span className="font-medium">{myPosts.length}</span> posts
        </div>
        <div className="flex space-x-2">
          <button
            disabled
            className="px-3 py-1 rounded-md bg-gray-100 text-gray-400 cursor-not-allowed"
          >
            Previous
          </button>
          <button
            disabled
            className="px-3 py-1 rounded-md bg-gray-100 text-gray-400 cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyPosts;