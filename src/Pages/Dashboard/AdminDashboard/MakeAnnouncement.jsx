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
    <main className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Make Announcement</h1>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div>
          <label
            htmlFor="authorImage"
            className="block text-sm font-semibold mb-1 text-gray-700"
          >
            Author Image URL
          </label>
          <input
            type="url"
            id="authorImage"
            placeholder="https://example.com/image.jpg"
            value={authorImage}
            onChange={(e) => setAuthorImage(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label
            htmlFor="authorName"
            className="block text-sm font-semibold mb-1 text-gray-700"
          >
            Author Name
          </label>
          <input
            type="text"
            id="authorName"
            placeholder="John Doe"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label
            htmlFor="title"
            className="block text-sm font-semibold mb-1 text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            placeholder="Announcement Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-semibold mb-1 text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            rows={5}
            placeholder="Write your announcement here..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 text-white font-semibold px-6 py-3 rounded-md transition ${
            loading ? "opacity-60 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          {loading ? "Submitting..." : "Submit Announcement"}
        </button>
      </form>
    </main>
  );
};

export default MakeAnnouncement;
