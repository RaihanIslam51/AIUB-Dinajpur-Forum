import { useMutation } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { FaBullhorn, FaImage, FaSpinner, FaUserCircle } from "react-icons/fa";
import Swal from "sweetalert2";
import { AuthContext } from "../../../Authantication/Context/AuthContext";
import useAxiosSecure from "../../../Hooks/AxiosSeure/useAxiosSecure";

const MakeAnnouncement = () => {
  const axiosSecure = useAxiosSecure();
  const { darkMode } = useContext(AuthContext);

  const [authorImage, setAuthorImage] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const createAnnouncementMutation = useMutation({
    mutationFn: async (newAnnouncement) => {
      const response = await axiosSecure.post("/announcements", newAnnouncement);
      return response.data;
    },
  });

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    if (!image) return;
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', image);

    try {
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=YOUR_IMGBB_API_KEY`,
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
        text: 'Please try again with a different image',
        icon: 'error',
        confirmButtonColor: '#6366f1',
        background: darkMode ? '#1f2937' : '#ffffff',
        color: darkMode ? 'white' : '#1f2937',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!authorImage.trim() || !authorName.trim() || !title.trim() || !description.trim()) {
      Swal.fire({
        title: "Incomplete Form",
        text: "Please fill in all required fields",
        icon: "warning",
        confirmButtonColor: "#6366f1",
        background: darkMode ? '#1f2937' : '#ffffff',
        color: darkMode ? 'white' : '#1f2937',
      });
      return;
    }

    const result = await Swal.fire({
      title: "Publish Announcement?",
      text: "This will be visible to all users",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#6366f1",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Publish",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      background: darkMode ? '#1f2937' : '#ffffff',
      color: darkMode ? 'white' : '#1f2937',
      backdrop: `
        rgba(79, 70, 229, 0.1)
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

    if (result.isConfirmed) {
      const announcementData = {
        authorImage,
        authorName,
        title,
        description,
        date: new Date().toISOString(),
      };

      createAnnouncementMutation.mutate(announcementData, {
        onSuccess: () => {
          Swal.fire({
            title: "Published!",
            text: "Your announcement is now live",
            icon: "success",
            confirmButtonColor: "#6366f1",
            background: darkMode ? '#1f2937' : '#ffffff',
            color: darkMode ? 'white' : '#1f2937',
            timer: 2000,
            showConfirmButton: false
          });
          // Reset form
          setAuthorImage("");
          setAuthorName("");
          setTitle("");
          setDescription("");
        },
        onError: (error) => {
          Swal.fire({
            title: "Error",
            text: error.response?.data?.message || "Failed to create announcement",
            icon: "error",
            confirmButtonColor: "#6366f1",
            background: darkMode ? '#1f2937' : '#ffffff',
            color: darkMode ? 'white' : '#1f2937',
          });
        },
      });
    }
  };

  const loading = createAnnouncementMutation.isLoading || isUploading;

  return (
    <div className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-indigo-50 to-purple-50'
    }`}>
      <div className="max-w-3xl mx-auto">
        <div className={`rounded-xl shadow-xl overflow-hidden ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          {/* Header */}
          <div className={`p-6 text-center ${
            darkMode 
              ? 'bg-gradient-to-r from-indigo-700 to-purple-800' 
              : 'bg-gradient-to-r from-indigo-600 to-purple-700'
          }`}>
            <div className={`inline-flex items-center justify-center p-3 rounded-full mb-4 ${
              darkMode ? 'bg-white/10' : 'bg-white/20'
            }`}>
              <FaBullhorn className="text-white text-2xl" />
            </div>
            <h1 className="text-3xl font-bold text-white">Create Announcement</h1>
            <p className={`mt-2 ${
              darkMode ? 'text-indigo-200' : 'text-indigo-100'
            }`}>
              Share important updates with your community
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Author Image */}
            <div className="space-y-2">
              <label className={`block text-sm font-medium flex items-center ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <FaImage className={`mr-2 ${
                  darkMode ? 'text-indigo-400' : 'text-indigo-500'
                }`} /> Author Image
              </label>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className={`w-20 h-20 rounded-full overflow-hidden border-2 border-dashed flex items-center justify-center ${
                    authorImage 
                      ? 'border-transparent' 
                      : darkMode ? 'border-gray-600' : 'border-gray-300'
                  } ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    {authorImage ? (
                      <img
                        src={authorImage}
                        alt="Author"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaUserCircle className={`text-3xl ${
                        darkMode ? 'text-gray-500' : 'text-gray-400'
                      }`} />
                    )}
                  </div>
                  {isUploading && (
                    <div className={`absolute inset-0 rounded-full flex items-center justify-center ${
                      darkMode ? 'bg-black/40' : 'bg-black/30'
                    }`}>
                      <FaSpinner className="animate-spin text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <label className="cursor-pointer">
                    <div className={`px-4 py-2 rounded-lg transition text-sm font-medium ${
                      darkMode 
                        ? 'bg-indigo-900/50 hover:bg-indigo-900 text-indigo-300' 
                        : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'
                    }`}>
                      {authorImage ? 'Change Image' : 'Upload Image'}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="sr-only"
                      disabled={loading}
                    />
                  </label>
                  <p className={`text-xs mt-1 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    JPEG, PNG (Max. 5MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Author Name */}
            <div>
              <label htmlFor="authorName" className={`block text-sm font-medium flex items-center ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <FaUserCircle className={`mr-2 ${
                  darkMode ? 'text-indigo-400' : 'text-indigo-500'
                }`} /> Author Name
              </label>
              <input
                id="authorName"
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                disabled={loading}
                required
                className={`mt-1 block w-full rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'border-gray-300 text-gray-900'
                }`}
                placeholder="Enter author name"
              />
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className={`block text-sm font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Announcement Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading}
                required
                className={`mt-1 block w-full rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'border-gray-300 text-gray-900'
                }`}
                placeholder="Enter announcement title"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className={`block text-sm font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Announcement Content
              </label>
              <textarea
                id="description"
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
                required
                className={`mt-1 block w-full rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'border-gray-300 text-gray-900'
                }`}
                placeholder="Write your announcement here..."
              />
            </div>

            {/* Preview Section */}
            {title && (
              <div className={`border rounded-lg p-4 ${
                darkMode 
                  ? 'border-gray-700 bg-gray-700' 
                  : 'border-gray-200 bg-gray-50'
              }`}>
                <h3 className={`text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>Preview</h3>
                <div className="prose max-w-none">
                  <h4 className={`text-lg font-semibold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>{title}</h4>
                  <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{description}</p>
                  {authorImage && (
                    <div className="flex items-center mt-4">
                      <img
                        src={authorImage}
                        alt="Author"
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <span className={`text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>{authorName}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center items-center py-3 px-4 rounded-lg shadow-md text-white font-bold ${
                  loading 
                    ? darkMode 
                      ? 'bg-indigo-700' 
                      : 'bg-indigo-400'
                    : darkMode 
                      ? 'bg-indigo-700 hover:bg-indigo-600' 
                      : 'bg-indigo-600 hover:bg-indigo-700'
                } transition-colors`}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" /> Publishing...
                  </>
                ) : (
                  <>
                    <FaBullhorn className="mr-2" /> Publish Announcement
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MakeAnnouncement;