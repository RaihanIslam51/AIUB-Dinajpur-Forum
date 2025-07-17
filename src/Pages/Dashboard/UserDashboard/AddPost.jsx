import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import Swal from "sweetalert2";
import useAuth from "../../../Hooks/AxiosSeure/useAuth";
import useAxiosSesure from "../../../Hooks/AxiosSeure/useAxiosSecure";


const AddPost = () => {
  const { UserData } = useAuth();
  const axiosSecure = useAxiosSesure()
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [authorImage, setAuthorImage] = useState("");
  const [tag, setTag] = useState(null);
  const [postCount, setPostCount] = useState(0);
  const postLimit = 5;

  const tagOptions = [
    { value: "tech", label: "Tech" },
    { value: "news", label: "News" },
    { value: "tutorial", label: "Tutorial" },
    { value: "lifestyle", label: "Lifestyle" },
  ];

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append("image", image);
    const uploadUrl = `https://api.imgbb.com/1/upload?key=36f47c5ee620bb292f8a6a4a24adb091`;

    try {
      const res = await axios.post(uploadUrl, formData);
      setAuthorImage(res.data.data.url);
    } catch (error) {
      console.error("Image upload failed", error);
    }
  };

  // 🧠 Mutation for adding post
  const { mutate: addPost, isLoading } = useMutation({
    mutationFn: async (postData) => {
      const res = await axiosSecure.post("/posts", postData);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire("Success!", "Post added successfully", "success");
      reset();
      setAuthorImage("");
      setTag(null);
    },
    onError: () => {
      Swal.fire("Error", "Failed to add post", "error");
    },
  });

  const onSubmit = (data) => {
    const newPost = {
      authorName: UserData?.displayName,
      authorEmail: UserData?.email,
      authorImage: authorImage,
      title: data.title,
      description: data.description,
      tag: tag?.value || "general",
      upVote: 0,
      downVote: 0,
      date: new Date(),
    };

    addPost(newPost);
  };

  // Simulate post count (replace with DB logic)
  useEffect(() => {
    setPostCount(UserData?.posts?.length || 3);
  }, [UserData]);

  const isLimitReached = postCount >= postLimit && !UserData?.isMember;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-3xl font-bold text-indigo-700 mb-4">Add New Post</h2>

      {isLimitReached ? (
        <div className="text-center space-y-4 py-10">
          <p className="text-lg font-medium text-red-500">
            You have reached your post limit. Become a member to add more!
          </p>
          <button
            onClick={() => navigate("/membership")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md"
          >
            Become a Member
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Author Name & Email */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Author Name</label>
              <input
                type="text"
                defaultValue={UserData?.displayName}
                disabled
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Author Email</label>
              <input
                type="email"
                defaultValue={UserData?.email}
                disabled
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          {/* Author Image Upload */}
          <div>
            <label className="text-sm font-medium">Author Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full p-2 border rounded"
            />
            {authorImage && (
              <img
                src={authorImage}
                alt="Author"
                className="mt-2 w-20 h-20 rounded-full object-cover border"
              />
            )}
          </div>

          {/* Title */}
          <div>
            <label className="text-sm font-medium">Post Title</label>
            <input
              type="text"
              {...register("title", { required: true })}
              placeholder="Enter title"
              className="w-full p-2 border rounded"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">Title is required</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium">Post Description</label>
            <textarea
              {...register("description", { required: true })}
              placeholder="Write your post here..."
              rows="4"
              className="w-full p-2 border rounded"
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-sm">Description is required</p>
            )}
          </div>

          {/* Tag */}
          <div>
            <label className="text-sm font-medium">Tag</label>
            <Select
              options={tagOptions}
              value={tag}
              onChange={setTag}
              placeholder="Select a tag"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded disabled:opacity-50"
          >
            {isLoading ? "Posting..." : "Submit Post"}
          </button>
        </form>
      )}
    </div>
  );
};

export default AddPost;
