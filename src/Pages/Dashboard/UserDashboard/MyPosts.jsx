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
    console.log('Navigate to comment:', postId);
    navigate(`/dashboard/comment`);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white text-center">
        My Posts
      </h2>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <span className="loading loading-bars loading-lg text-primary"></span>
        </div>
      ) : myPosts.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-300 text-center">
          You haven’t posted anything yet.
        </p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-xl bg-white dark:bg-gray-900 p-4 border border-gray-200 dark:border-gray-700">
          <table className="min-w-full table-auto text-sm text-left text-gray-700 dark:text-gray-300">
            <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
              <tr>
                <th className="px-6 py-3">#</th>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Votes</th>
                <th className="px-6 py-3">Comments</th>
                <th className="px-6 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {myPosts.map((post, idx) => (
                <tr
                  key={post._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-300"
                >
                  <td className="px-6 py-4">{idx + 1}</td>
                  <td className="px-6 py-4 font-medium">{post.title}</td>
                  <td className="px-6 py-4">
                    {(post.upVote || 0) - (post.downVote || 0)}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleComment(post._id)}
                      className="flex items-center gap-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-3 py-1 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition"
                    >
                      <FaComments />
                      Comment
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full transition duration-200"
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
      )}
    </div>
  );
};

export default MyPosts;
