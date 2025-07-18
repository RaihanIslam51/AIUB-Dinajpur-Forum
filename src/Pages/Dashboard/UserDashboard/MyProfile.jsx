import axios from "axios";
import { BadgeCheck, Pencil, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import axiosInstance from "../../../Hooks/AxiosSeure/asiosInstance";
import useAuth from "../../../Hooks/AxiosSeure/useAuth";

const MyProfile = () => {
  const { UserData } = useAuth();
  const { register, handleSubmit, reset } = useForm();
  const navigate=useNavigate()

  const [profilePic, setProfilePic] = useState(UserData?.image || "");
  const [badge, setBadge] = useState("bronze");
  const [dbUser, setDbUser] = useState({});
  const [postCount, setPostCount] = useState(0);

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      if (UserData?.email) {
        try {
          const userRes = await axiosInstance.get(`/users?email=${UserData.email}`);
          const user = userRes.data;
          setDbUser(user);
          setProfilePic(user?.image || UserData?.image || "");
          setBadge(user?.payment_status?.toLowerCase().includes("gold") ? "gold" : "bronze");

          const postRes = await axiosInstance.get(`/posts/count?email=${UserData.email}`);
          setPostCount(postRes.data.count || 0);
        } catch (err) {
          console.error("Fetch failed:", err);
        }
      }
    };
    fetchUserAndPosts();
  }, [UserData]);

  const handleUploadImg = async (e) => {
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append("image", image);
    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=36f47c5ee620bb292f8a6a4a24adb091`,
        formData
      );
      setProfilePic(res.data.data.url);
    } catch (error) {
      console.error("Image upload failed", error);
    }
  };

  const onSubmit = async (data) => {
    alert(`Post Created: ${data.title}`);
    reset();
  };

  const handleMembership=()=>{
   navigate("/membership")
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="bg-white rounded-2xl shadow-xl p-8 space-y-10">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <img
            src={profilePic || "https://i.ibb.co/vz7M9f3/default-avatar.png"}
            alt="User"
            className="w-32 h-32 rounded-full object-cover ring-4 ring-indigo-300"
          />
          <div className="flex-1 space-y-1">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              {dbUser?.name || UserData?.name}
              <BadgeCheck className={`h-5 w-5 ${badge === "gold" ? "text-yellow-500" : "text-gray-400"}`} />
            </h2>
            <p className="text-gray-600">{dbUser?.email}</p>
            <div className="text-sm text-gray-500 grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              <p><strong>Total Posts:</strong> {postCount}</p>
              <p><strong>Role:</strong> {dbUser?.role || "User"}</p>
              {/* <p><strong>Badge:</strong> <span className={`${badge === "gold" ? "text-yellow-600" : "text-gray-500"}`}>{badge}</span></p> */}


              <p className="mt-2">
                <strong className="text-gray-700 mr-2">Badge:</strong>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold 
      ${badge === "gold" ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                      : "bg-gray-200 text-gray-700 border border-gray-300"}`}
                >
                  {badge.charAt(0).toUpperCase() + badge.slice(1)} Badge
                </span>
              </p>


              <p><strong>Joined:</strong> {new Date(dbUser?.created_at).toLocaleDateString() || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Upload Profile Picture */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload New Profile Picture</label>
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleUploadImg}
              className="file-input file-input-bordered file-input-sm w-full max-w-xs"
            />
            <Upload className="text-gray-500" />
          </div>
        </div>

        {/* Create Post Section */}
        <div>
          <h3 className="text-2xl font-semibold text-indigo-600 flex items-center gap-2">
            <Pencil size={20} /> Create New Post
          </h3>
          {badge === "gold" || postCount < 5 ? (
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4 bg-gray-50 p-5 rounded-xl space-y-4">
              {/* <input
                {...register("title")}
                placeholder="Post Title"
                className="input input-bordered w-full"
                required
              /> */}
              {/* <textarea
                {...register("description")}
                rows={4}
                placeholder="Write your thoughts..."
                className="textarea textarea-bordered w-full"
                required
              /> */}
              {/* <div className="flex justify-end">
                <button className="btn btn-primary">Publish</button>
              </div> */}
              {badge === "bronze" && (
                <p className="text-sm text-right text-gray-500">
                  You can post <strong>{5 - postCount}</strong> more time(s).
                </p>
              )}
            </form>
          ) : (
            <div className="bg-yellow-50 border border-yellow-300 p-5 rounded-lg text-yellow-700">
              <h4 className="text-lg font-bold">Post Limit Reached</h4>
              <p className="text-sm mt-1">Upgrade to <span className="font-semibold text-yellow-600">Gold Membership</span> for unlimited posting.</p>
              <button onClick={handleMembership} className="mt-3 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition">
                Upgrade Now
              </button>
            </div>
          )}
        </div>

        {/* Recent Posts */}
        <div>
          <h3 className="text-2xl font-semibold text-indigo-600 mb-4">Recent Posts</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { id: 1, title: "First Post", description: "This is your first post" },
              { id: 2, title: "React Tips", description: "React + Tailwind is awesome" },
              { id: 3, title: "JS Snippets", description: "Useful JavaScript snippets" },
            ].map(post => (
              <div key={post.id} className="bg-white shadow p-4 rounded-lg hover:shadow-md transition">
                <h4 className="text-lg font-bold text-gray-800">{post.title}</h4>
                <p className="text-sm text-gray-600">{post.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
