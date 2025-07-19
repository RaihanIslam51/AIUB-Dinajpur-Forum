import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import Swal from "sweetalert2";
import useAxiosSesure from "../../../Hooks/AxiosSeure/useAxiosSecure";

const MakeAnnouncement = () => {
  const axiosSecure = useAxiosSesure();

  const [authorImage, setAuthorImage] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const createAnnouncementMutation = useMutation({
    mutationFn: async (newAnnouncement) => {
      const response = await axiosSecure.post("/announcements", newAnnouncement);
      return response.data;
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !authorImage.trim() ||
      !authorName.trim() ||
      !title.trim() ||
      !description.trim()
    ) {
      Swal.fire({
        icon: "warning",
        title: "Missing fields",
        text: "Please fill in all fields.",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to submit this announcement?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, submit it!",
      cancelButtonText: "Cancel",
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
            icon: "success",
            title: "Announcement created!",
            timer: 2000,
            showConfirmButton: false,
          });
          setAuthorImage("");
          setAuthorName("");
          setTitle("");
          setDescription("");
        },
        onError: (error) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text:
              error.response?.data?.message ||
              error.message ||
              "Failed to create announcement",
          });
        },
      });
    }
  };

  const loading = createAnnouncementMutation.isLoading;

  return (
    <main className="max-w-3xl mx-auto p-8 bg-white/60 backdrop-blur-md rounded-3xl shadow-xl border border-indigo-200">
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-700 mb-10 text-center">
        Make Announcement
      </h1>

      <form onSubmit={handleSubmit} noValidate className="space-y-8">
        {/* Author Image URL */}
        <div className="relative">
          <input
            id="authorImage"
            type="url"
            placeholder=" "
            value={authorImage}
            onChange={(e) => setAuthorImage(e.target.value)}
            disabled={loading}
            required
            className="peer block w-full rounded-xl border border-gray-300 bg-transparent px-4 pt-6 pb-2 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
          />
          <label
            htmlFor="authorImage"
            className="absolute left-4 top-2 text-gray-500 text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-600 transition-all cursor-text select-none"
          >
            Author Image URL
          </label>
          {authorImage && (
            <img
              src={authorImage}
              alt="Author Preview"
              className="mt-3 h-28 w-28 rounded-full object-cover mx-auto shadow-lg transition-opacity duration-500"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          )}
        </div>

        {/* Author Name */}
        <div className="relative">
          <input
            id="authorName"
            type="text"
            placeholder=" "
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            disabled={loading}
            required
            className="peer block w-full rounded-xl border border-gray-300 bg-transparent px-4 pt-6 pb-2 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
          />
          <label
            htmlFor="authorName"
            className="absolute left-4 top-2 text-gray-500 text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-600 transition-all cursor-text select-none"
          >
            Author Name
          </label>
        </div>

        {/* Title */}
        <div className="relative">
          <input
            id="title"
            type="text"
            placeholder=" "
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            required
            className="peer block w-full rounded-xl border border-gray-300 bg-transparent px-4 pt-6 pb-2 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
          />
          <label
            htmlFor="title"
            className="absolute left-4 top-2 text-gray-500 text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-600 transition-all cursor-text select-none"
          >
            Title
          </label>
        </div>

        {/* Description */}
        <div className="relative">
          <textarea
            id="description"
            rows={5}
            placeholder=" "
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            required
            className="peer block w-full rounded-xl border border-gray-300 bg-transparent px-4 pt-6 pb-2 resize-y text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
          />
          <label
            htmlFor="description"
            className="absolute left-4 top-2 text-gray-500 text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-600 transition-all cursor-text select-none"
          >
            Write your announcement here...
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded-xl py-3 font-extrabold text-white bg-gradient-to-r from-indigo-600 via-purple-700 to-pink-600 shadow-lg shadow-indigo-300/50 hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-indigo-400 transition ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Submitting..." : "Submit Announcement"}
        </button>
      </form>
    </main>
  );
};

export default MakeAnnouncement;
