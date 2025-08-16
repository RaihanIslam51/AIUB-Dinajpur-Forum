import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../Authantication/Context/AuthContext';
import useAuth from '../../../Hooks/AxiosSeure/useAuth';
import useAxiosSecure from '../../../Hooks/AxiosSeure/useAxiosSecure';

const TAG_OPTIONS = [
  { value: 'tech', label: 'Technology', color: '#3b82f6' },
  { value: 'news', label: 'News', color: '#ef4444' },
  { value: 'education', label: 'Education', color: '#10b981' },
  { value: 'health', label: 'Health', color: '#8b5cf6' },
  { value: 'business', label: 'Business', color: '#f59e0b' },
  { value: 'entertainment', label: 'Entertainment', color: '#ec4899' },
];

const AddPost = () => {
  const { UserData } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { darkMode } = useContext(AuthContext);
  const [authorImage, setAuthorImage] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const getCustomSelectStyles = () => ({
    control: (provided, state) => ({
      ...provided,
      borderRadius: '0.75rem',
      borderColor: state.isFocused ? '#6366f1' : darkMode ? '#4b5563' : '#e5e7eb',
      backgroundColor: darkMode ? '#1f2937' : 'white',
      color: darkMode ? 'white' : '#1f2937',
      boxShadow: state.isFocused ? '0 0 0 3px rgb(99 102 241 / 0.1)' : 'none',
      transition: 'all 0.2s',
      padding: '0.25rem',
      cursor: 'pointer',
      minHeight: '3rem',
      '&:hover': {
        borderColor: '#818cf8'
      }
    }),
    option: (provided, state) => {
      const option = TAG_OPTIONS.find(opt => opt.value === state.value);
      return {
        ...provided,
        backgroundColor: state.isSelected 
          ? '#6366f1' 
          : state.isFocused 
            ? darkMode ? '#374151' : '#eef2ff' 
            : darkMode ? '#1f2937' : 'white',
        color: state.isSelected 
          ? 'white' 
          : state.isFocused 
            ? darkMode ? 'white' : '#4f46e5' 
            : darkMode ? 'white' : '#1f2937',
        cursor: 'pointer',
        padding: '0.75rem 1rem',
        fontSize: '0.875rem',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        '&:before': {
          content: '""',
          display: 'inline-block',
          width: '0.75rem',
          height: '0.75rem',
          borderRadius: '50%',
          backgroundColor: option?.color || '#6366f1',
          marginRight: '0.5rem'
        }
      };
    },
    menu: (provided) => ({
      ...provided,
      borderRadius: '0.75rem',
      boxShadow: darkMode 
        ? '0 10px 15px -3px rgb(0 0 0 / 0.25), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
        : '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      border: darkMode ? '1px solid #4b5563' : '1px solid #e5e7eb',
      marginTop: '0.25rem',
      overflow: 'hidden',
      backgroundColor: darkMode ? '#1f2937' : 'white',
    }),
    singleValue: (provided, state) => {
      const option = TAG_OPTIONS.find(opt => opt.value === state.data?.value);
      return {
        ...provided,
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: darkMode ? 'white' : '#1f2937',
        fontWeight: '500',
        '&:before': {
          content: '""',
          display: 'inline-block',
          width: '0.75rem',
          height: '0.75rem',
          borderRadius: '50%',
          backgroundColor: option?.color || '#6366f1',
          marginRight: '0.5rem'
        }
      };
    },
    placeholder: (provided) => ({
      ...provided,
      color: darkMode ? '#9ca3af' : '#9ca3af',
    }),
    indicatorSeparator: () => ({
      display: 'none'
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: darkMode ? '#9ca3af' : '#9ca3af',
      '&:hover': {
        color: darkMode ? '#d1d5db' : '#6b7280'
      }
    })
  });

  // Fetch user info
  const { data: userInfo, isLoading: userLoading } = useQuery({
    queryKey: ['userInfo', UserData?.email],
    queryFn: async () => {
      if (!UserData?.email) return null;
      const userRes = await axiosSecure.get(`/users?email=${UserData.email}`);
      return userRes.data;
    },
    enabled: !!UserData?.email,
    staleTime: 5 * 60 * 1000,
  });

  const badge = userInfo?.[0]?.payment_status || 'Bronze Badge';

  // Fetch user's posts
  const { data: postData = [], isLoading: postsLoading } = useQuery({
    queryKey: ['userPostCount', UserData?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/mypost?email=${UserData.email}`);
      return res.data;
    },
    enabled: !!UserData?.email,
  });

  const postCount = postData.length || 0;

  // Upload image to imgbb
  const handleUploadImage = async (e) => {
    const image = e.target.files[0];
    if (!image) return;
    
    setIsUploading(true);
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
      Swal.fire({
        title: 'Image Upload Failed',
        text: 'Please try again with a different image.',
        icon: 'error',
        confirmButtonColor: '#6366f1',
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Handle form submit
  const onSubmit = async (data) => {
    if (!authorImage) {
      Swal.fire({
        title: 'Image Required',
        text: 'Please upload an author image',
        icon: 'warning',
        confirmButtonColor: '#6366f1',
      });
      return;
    }
    
    if (!selectedTag?.value) {
      Swal.fire({
        title: 'Category Required',
        text: 'Please select a category for your post',
        icon: 'warning',
        confirmButtonColor: '#6366f1',
      });
      return;
    }

    if (badge === 'Bronze Badge' && postCount >= 5) {
      Swal.fire({
        title: 'Post Limit Reached',
        text: 'Upgrade to Gold Badge to post more content',
        icon: 'error',
        confirmButtonColor: '#6366f1',
      });
      return;
    }

    const newPost = {
      authorName: UserData?.displayName,
      authorEmail: UserData?.email,
      authorImage,
      title: data.title,
      description: data.description,
      tag: selectedTag.value,
      upVote: [],
      downVote: [],
      date: new Date(),
    };

    try {
      const res = await axiosSecure.post('/addposts', newPost);
      if (res.data.insertedId) {
        Swal.fire({
          title: 'Success!',
          text: 'Your post has been published',
          icon: 'success',
          confirmButtonColor: '#6366f1',
        });
        reset();
        setAuthorImage('');
        setSelectedTag(null);
        queryClient.invalidateQueries(['userPostCount', UserData?.email]);
      }
    } catch (error) {
      console.error('Error submitting post:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to submit your post',
        icon: 'error',
        confirmButtonColor: '#6366f1',
      });
    }
  };

  if (userLoading || postsLoading) {
    return (
      <div className={`flex justify-center items-center min-h-[40vh] ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${darkMode ? 'border-indigo-400' : 'border-indigo-500'}`}></div>
      </div>
    );
  }

  if (badge === 'Bronze Badge' && postCount >= 5) {
    return (
      <section className={`max-w-xl mx-auto rounded-xl shadow-lg overflow-hidden mt-10 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Post Limit Reached</h2>
          <p className="text-red-100">
            You've used all {postCount} free posts available with your Bronze Badge
          </p>
        </div>
        <div className={`p-8 text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="mb-6">
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${darkMode ? 'text-red-300 bg-red-900/50' : 'text-red-600 bg-red-200'}`}>
                    Bronze Badge
                  </span>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-semibold inline-block ${darkMode ? 'text-red-300' : 'text-red-600'}`}>
                    {postCount}/5 posts
                  </span>
                </div>
              </div>
              <div className={`overflow-hidden h-2 mb-4 text-xs flex rounded ${darkMode ? 'bg-red-900/50' : 'bg-red-200'}`}>
                <div
                  style={{ width: '100%' }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"
                ></div>
              </div>
            </div>
          </div>
          <a
            href="/membership"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 transition-all duration-300"
          >
            Upgrade to Gold Badge
            <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>
      </section>
    );
  }

  return (
    <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`rounded-xl shadow-lg overflow-hidden ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-8 text-center">
          <h1 className="text-3xl font-bold text-white">Create New Post</h1>
          <p className="mt-2 text-indigo-100">
            Share your knowledge with the community
          </p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8 space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Author Image
              <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 flex items-center">
              <div className="relative group">
                <div className={`w-24 h-24 rounded-full overflow-hidden border-2 border-dashed ${authorImage ? 'border-transparent' : darkMode ? 'border-indigo-700 group-hover:border-indigo-600' : 'border-indigo-300 group-hover:border-indigo-400'} transition-colors duration-300 flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  {authorImage ? (
                    <img
                      src={authorImage}
                      alt="Author preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg
                      className={`h-12 w-12 ${darkMode ? 'text-indigo-600 group-hover:text-indigo-500' : 'text-indigo-300 group-hover:text-indigo-400'} transition-colors duration-300`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  )}
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="bg-black bg-opacity-50 text-white text-xs font-medium px-2 py-1 rounded">
                    Change
                  </span>
                </div>
              </div>
              <div className="ml-4">
                <label className="cursor-pointer">
                  <div className={`px-4 py-2 rounded-lg transition-colors duration-300 text-sm font-medium ${darkMode ? 'bg-indigo-900/50 hover:bg-indigo-900 text-indigo-300' : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'}`}>
                    {isUploading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Uploading...
                      </span>
                    ) : authorImage ? (
                      'Change Image'
                    ) : (
                      'Upload Image'
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUploadImage}
                    className="sr-only"
                    required={!authorImage}
                  />
                </label>
                <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  JPEG, PNG or GIF (Max. 5MB)
                </p>
              </div>
            </div>
          </div>

          {/* Author Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Author Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={UserData?.displayName || ''}
                  readOnly
                  className={`block w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-gray-50 border-gray-200 text-gray-700'} focus:ring-indigo-500 focus:border-indigo-500`}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={UserData?.email || ''}
                  readOnly
                  className={`block w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-gray-50 border-gray-200 text-gray-700'} focus:ring-indigo-500 focus:border-indigo-500`}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Post Title <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="title"
                type="text"
                {...register('title', { required: 'Title is required' })}
                className={`block w-full px-4 py-3 rounded-lg border shadow-sm ${errors.title 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : darkMode 
                    ? 'border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 text-white' 
                    : 'border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 bg-white'
                }`}
                placeholder="Enter a compelling title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Post Content <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <textarea
                id="description"
                rows={8}
                {...register('description', { required: 'Content is required' })}
                className={`block w-full px-4 py-3 rounded-lg border shadow-sm ${errors.description 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : darkMode 
                    ? 'border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 text-white' 
                    : 'border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 bg-white'
                }`}
                placeholder="Write your post content here..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Tag Select */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Category <span className="text-red-500">*</span>
            </label>
            <Select
              options={TAG_OPTIONS}
              value={selectedTag}
              onChange={(selectedOption) => setSelectedTag(selectedOption || null)}
              placeholder="Select a category..."
              styles={getCustomSelectStyles()}
              isClearable
              required
              noOptionsMessage={() => "No categories found"}
              components={{
                IndicatorSeparator: null
              }}
            />
          </div>

          {/* Badge Info */}
          <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-indigo-50 border-indigo-100'}`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  badge === 'Bronze Badge' 
                    ? darkMode 
                      ? 'bg-amber-900/50 text-amber-300' 
                      : 'bg-amber-100 text-amber-800' 
                    : darkMode 
                      ? 'bg-purple-900/50 text-purple-300' 
                      : 'bg-purple-100 text-purple-800'
                }`}>
                  {badge}
                </span>
              </div>
              <div className="ml-3">
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {badge === 'Bronze Badge' 
                    ? `You have ${5 - postCount} free posts remaining`
                    : 'You have unlimited posting capability'}
                </p>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white ${
                isSubmitting 
                  ? 'bg-indigo-400' 
                  : 'bg-indigo-600 hover:bg-indigo-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                darkMode ? 'focus:ring-indigo-500' : 'focus:ring-indigo-500'
              } transition-colors duration-300`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Publishing...
                </>
              ) : (
                'Publish Post'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPost;