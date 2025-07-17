import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaMedal } from "react-icons/fa";
import useAuth from "../../../Hooks/AxiosSeure/useAuth";

// Dummy 3 recent posts (replace with real API later)
const dummyPosts = [
  { id: 1, title: "First Post", description: "This is your first post" },
  { id: 2, title: "React Tips", description: "React + Tailwind is awesome" },
  { id: 3, title: "JS Snippets", description: "Useful JavaScript snippets" },
];

const MyProfile = () => {
  const { UserData } = useAuth();
  const { register, handleSubmit, reset } = useForm();

  const [profilePic, setProfilePic] = useState(UserData?.image || '');
  const [badge, setBadge] = useState("");
  console.log(UserData);
  

  // Badge logic
  useEffect(() => {
    if (UserData?.isMember) {
      setBadge("gold");
    } else {
      setBadge("bronze");
    }
  }, [UserData]);

  // Image Upload Handler
  const handleUploadImg = async (e) => {
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append("image", image);

    const imgbbApiKey = "36f47c5ee620bb292f8a6a4a24adb091";
    const uploadUrl = `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`;

    try {
      const res = await axios.post(uploadUrl, formData);
      setProfilePic(res.data.data.url);
    } catch (error) {
      console.error("Image upload failed", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6">My Profile</h2>

      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div>
          <img
            src={profilePic || "https://i.ibb.co/vz7M9f3/default-avatar.png"}
            alt="User"
            className="w-32 h-32 rounded-full border-4 border-indigo-200 object-cover"
          />
        </div>

        <div className="flex-1 space-y-2">
          <h3 className="text-2xl font-semibold text-gray-800">{UserData?.name || "N/A"}</h3>
          <p className="text-gray-600">{UserData?.email}</p>

          {badge === "bronze" && (
            <div className="inline-flex items-center gap-2 mt-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
              <FaMedal className="text-yellow-500" /> Bronze Badge
            </div>
          )}
          {badge === "gold" && (
            <div className="inline-flex items-center gap-2 mt-2 bg-yellow-200 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
              <FaMedal className="text-yellow-600" /> Gold Badge
            </div>
          )}
        </div>
      </div>

      {/* Upload Section */}
      <form className="mt-6 space-y-4" onSubmit={handleSubmit(() => {})}>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Upload New Profile Picture</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleUploadImg}
            className="mt-1 block w-full border rounded-md p-2 text-sm"
          />
        </label>
      </form>

      {/* Recent Posts */}
      <div className="mt-10">
        <h3 className="text-xl font-bold text-indigo-600 mb-4">My Recent Posts</h3>
        <div className="space-y-4">
          {dummyPosts.slice(0, 3).map((post) => (
            <div
              key={post.id}
              className="bg-gray-100 p-4 rounded-lg shadow-sm hover:bg-gray-200 transition"
            >
              <h4 className="text-lg font-semibold">{post.title}</h4>
              <p className="text-sm text-gray-700">{post.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
