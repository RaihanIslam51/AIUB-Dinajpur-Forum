import { useQuery } from '@tanstack/react-query';
import { FaComments, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
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
      title: 'Are you sure?',
      text: 'You will not be able to recover this post!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/posts/${postId}`);
        if (res.data.deletedCount > 0) {
          Swal.fire('Deleted!', 'Your post has been deleted.', 'success');
          refetch();
        }
      } catch (err) {
        Swal.fire('Failed to delete post', '', 'error');
      }
    }
  };

  const handleComment = (postId) => {
    navigate('/dashboard/comment');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-bars loading-lg text-indigo-600"></span>
      </div>
    );
  }

  if (myPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-400 space-y-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7l9 6 9-6"
          />
        </svg>
        <p className="text-xl font-semibold">You haven’t posted anything yet.</p>
        <p className="max-w-sm text-center text-gray-500">
          Create new posts to share your ideas and engage with the community!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <h2 className="text-3xl font-extrabold mb-6 text-gray-800 text-center">
        My Posts
      </h2>

      <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
        <table className="min-w-full table-auto text-sm text-left text-gray-700">
          <thead className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-4 rounded-tl-xl">#</th>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Votes</th>
              <th className="px-6 py-4">Comments</th>
              <th className="px-6 py-4 rounded-tr-xl text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {myPosts.map((post, idx) => (
              <tr
                key={post._id}
                className="border-b border-gray-200 hover:bg-indigo-50 transition"
              >
                <td className="px-6 py-4 font-medium">{idx + 1}</td>
                <td className="px-6 py-4 font-semibold">{post.title}</td>
                <td className="px-6 py-4">
                  {(post.upVote?.length || 0) - (post.downVote?.length || 0)}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleComment(post._id)}
                    className="flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full hover:bg-indigo-200 transition"
                    aria-label="Comment"
                  >
                    <FaComments />
                    Comment
                  </button>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full transition"
                    aria-label="Delete"
                  >
                    <FaTrash />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyPosts;
