import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import Swal from 'sweetalert2';
import useAuth from '../../../Hooks/AxiosSeure/useAuth';
import useAxiosSecure from '../../../Hooks/AxiosSeure/useAxiosSecure';

const TAG_OPTIONS = [
  { value: 'tech', label: 'Tech' },
  { value: 'news', label: 'News' },
  { value: 'education', label: 'Education' },
  { value: 'health', label: 'Health' },
];

const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    borderRadius: '0.75rem',
    borderColor: state.isFocused ? '#6366f1' : '#d1d5db',
    boxShadow: state.isFocused ? '0 0 0 3px rgb(99 102 241 / 0.3)' : 'none',
    transition: 'all 0.2s',
    padding: '0.1rem',
    cursor: 'pointer',
    minHeight: '2.9rem',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? '#6366f1' : 'white',
    color: state.isFocused ? 'white' : 'black',
    cursor: 'pointer',
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: '0.75rem',
    boxShadow: '0 10px 15px -3px rgb(99 102 241 / 0.2)',
  }),
};

const AddPost = () => {
  const { UserData } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [authorImage, setAuthorImage] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Fetch post count and badge
  const { data: postData, isLoading } = useQuery({
    queryKey: ['userPostCount', UserData?.email],
    enabled: !!UserData?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/posts/count?email=${UserData.email}`);
      return res.data;
    },
  });

  const postCount = postData?.count || 0;
  const badge = postData?.badge || 'Bronze Badge';

  // Upload image to imgbb
  const handleUploadImage = async (e) => {
    const image = e.target.files[0];
    if (!image) return;
    const formData = new FormData();
    formData.append('image', image);

    try {
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=36f47c5ee620bb292f8a6a4a24adb091`,
        { method: 'POST', body: formData }
      );
      const imgData = await res.json();
      if (imgData.success) {
        setAuthorImage(imgData.data.url);
      } else {
        throw new Error('Upload failed');
      }
    } catch {
      Swal.fire('Image Upload Failed', 'Please try again with a different image.', 'error');
    }
  };

  // Submit handler
  const onSubmit = async (data) => {
    if (!authorImage) {
      Swal.fire('Please upload an author image', '', 'warning');
      return;
    }
    if (!selectedTag) {
      Swal.fire('Please select a tag', '', 'warning');
      return;
    }

    if (badge === 'Bronze Badge' && postCount >= 5) {
      Swal.fire('Post Limit Reached', 'Upgrade to Gold Badge to post more.', 'error');
      return;
    }

    const postData = {
      authorName: UserData?.displayName,
      authorEmail: UserData?.email,
      authorImage,
      title: data.title,
      description: data.description,
      tag: selectedTag.value,
      upVote: 0,
      downVote: 0,
      date: new Date(),
    };

    try {
      const res = await axiosSecure.post('/addposts', postData);
      if (res.data.insertedId) {
        Swal.fire('Post Added Successfully', '', 'success');
        reset();
        setAuthorImage('');
        setSelectedTag(null);
      }
    } catch {
      Swal.fire('Failed to Submit Post', '', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh] text-indigo-600 text-xl font-semibold">
        Loading your posts...
      </div>
    );
  }

  if (badge === 'Bronze Badge' && postCount >= 5) {
    return (
      <section className="max-w-xl mx-auto bg-red-50 border border-red-300 rounded-2xl p-8 text-center shadow-lg mt-10">
        <h2 className="text-3xl font-extrabold text-red-700 mb-3">Post Limit Reached</h2>
        <p className="text-red-600 mb-6">
          You have reached the free post limit of <span className="font-bold">5</span> articles.
        </p>
        <a
          href="/membership"
          className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:brightness-110 transition"
        >
          Become a Member & Post More
        </a>
      </section>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-3xl shadow-2xl mt-10">
      <h1 className="text-4xl font-extrabold text-indigo-700 mb-10 text-center tracking-tight">
        Create a New Post
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Image Upload */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">Upload Author Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleUploadImage}
            className="w-full rounded-xl border-2 border-dashed border-indigo-300 p-4 cursor-pointer hover:border-indigo-500 transition"
            required={!authorImage}
          />
          {authorImage && (
            <img
              src={authorImage}
              alt="Author preview"
              className="mt-4 w-28 h-28 object-cover rounded-full border-4 border-indigo-300 shadow-lg mx-auto transition-opacity duration-500"
              style={{ opacity: authorImage ? 1 : 0 }}
            />
          )}
        </div>

        {/* Author Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            value={UserData?.displayName || ''}
            readOnly
            className="rounded-xl border border-gray-300 px-4 py-3 text-gray-800"
          />
          <input
            type="email"
            value={UserData?.email || ''}
            readOnly
            className="rounded-xl border border-gray-300 px-4 py-3 text-gray-800"
          />
        </div>

        {/* Title */}
        <div className="relative">
          <input
            type="text"
            {...register('title', { required: 'Title is required' })}
            placeholder=" "
            className={`peer w-full rounded-xl border ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            } px-4 py-3`}
          />
          <label className="absolute left-4 top-1 text-gray-500 text-sm transition-all">
            Post Title
          </label>
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
        </div>

        {/* Description */}
        <div className="relative">
          <textarea
            rows={6}
            {...register('description', { required: 'Description is required' })}
            placeholder=" "
            className={`peer w-full rounded-xl border ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            } px-4 py-3 resize-y`}
          />
          <label className="absolute left-4 top-1 text-gray-500 text-sm transition-all">
            Write your post content...
          </label>
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Tag Select */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">Select Tag</label>
          <Select
            options={TAG_OPTIONS}
            value={selectedTag}
            onChange={setSelectedTag}
            placeholder="Choose a tag"
            styles={customSelectStyles}
            isClearable
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-extrabold rounded-3xl shadow-lg hover:brightness-110 transition"
        >
          Submit Post
        </button>
      </form>
    </div>
  );
};

export default AddPost;
