import axios from "axios";
import { BadgeCheck, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import useAuth from "../../../Hooks/AxiosSeure/useAuth";
import useAxiosSesure from "../../../Hooks/AxiosSeure/useAxiosSecure";

const MyProfile = () => {
  const { UserData } = useAuth();
  const axiosSecure = useAxiosSesure();

  const [profilePic, setProfilePic] = useState(UserData?.image || "");
  const [badge, setBadge] = useState("bronze");
  const [dbUser, setDbUser] = useState({});
  const [postCount, setPostCount] = useState(0);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user info and post count
  useEffect(() => {
    const fetchUserAndPostsCount = async () => {
      if (UserData?.email) {
        try {
          const userRes = await axiosSecure.get(`/users?email=${UserData.email}`);
          const user = Array.isArray(userRes.data) ? userRes.data[0] : userRes.data;
          setDbUser(user || {});
          setProfilePic(user?.image || UserData?.image || "");
          setBadge(user?.payment_status?.toLowerCase().includes("gold") ? "gold" : "bronze");

          const postRes = await axiosSecure.get(`/posts/counts?email=${UserData.email}`);
          setPostCount(postRes.data.count || 0);
        } catch (err) {
          console.error("Fetch failed:", err);
        }
      }
    };
    fetchUserAndPostsCount();
  }, [UserData, axiosSecure]);

  console.log("dbuser",dbUser);
  

  // ✅ Fetch only this user's posts
  useEffect(() => {
    const fetchPosts = async () => {
      if (!UserData?.email) return;

      try {
        const res = await axiosSecure.get(`/mypost?email=${UserData.email}`);
        const sorted = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setPosts(sorted);
        setLoadingPosts(false);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Error fetching posts");
        setLoadingPosts(false);
      }
    };
    fetchPosts();
  }, [UserData?.email, axiosSecure]);

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

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 via-white to-indigo-100 py-16 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl p-12 space-y-14">
        {/* PROFILE HEADER */}
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="relative group w-40 h-40 rounded-full overflow-hidden ring-8 ring-indigo-300 hover:ring-indigo-500 transition-all duration-300 shadow-2xl cursor-pointer">
            <img
              src={profilePic || dbUser?.photo || "https://i.ibb.co/vz7M9f3/default-avatar.png"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
            <label
              htmlFor="upload"
              className="absolute bottom-3 right-3 bg-indigo-600 p-3 rounded-full text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-indigo-700"
              title="Change Profile Picture"
            >
              <Upload size={24} />
            </label>
            <input
              id="upload"
              type="file"
              accept="image/*"
              onChange={handleUploadImg}
              className="hidden"
            />
          </div>

          <div className="flex-1 space-y-4">
            <h1 className="flex items-center gap-4 text-5xl font-extrabold text-indigo-900 tracking-wide">
              {dbUser?.name || UserData?.name}
              <BadgeCheck
                className={`h-9 w-9 transition-transform ${
                  badge === "gold" ? "text-yellow-400 drop-shadow-lg" : "text-gray-400"
                }`}
                title={badge.charAt(0).toUpperCase() + badge.slice(1) + " Badge"}
              />
            </h1>

            <p className="text-indigo-600 font-semibold tracking-wide text-xl select-text">
              {dbUser?.email}
            </p>

            <div className="flex flex-wrap gap-8 mt-6 text-gray-700 text-lg font-semibold">
              {[
                {
                  label: "Total Posts",
                  value: postCount,
                  bg: "bg-indigo-100",
                  text: "text-indigo-700",
                },
                {
                  label: "Role",
                  value: dbUser?.role || "User",
                  bg: "bg-indigo-100",
                  text: "text-indigo-700",
                },
                {
                  label: "Membership",
                  value: badge.charAt(0).toUpperCase() + badge.slice(1) + " Badge",
                  bg:
                    badge === "gold"
                      ? "bg-yellow-300 text-yellow-900 shadow-lg"
                      : "bg-gray-300 text-gray-700",
                  text: "",
                },
                {
                  label: "Joined",
                  value: dbUser?.created_at
                    ? new Date(dbUser.created_at).toLocaleDateString()
                    : "N/A",
                  bg: "bg-indigo-100",
                  text: "text-indigo-700",
                },
              ].map(({ label, value, bg, text }, i) => (
                <div
                  key={i}
                  className={`flex flex-col items-center rounded-xl p-6 shadow-inner w-36 ${bg} ${text}`}
                >
                  <span
                    className={`text-2xl font-extrabold ${
                      badge === "gold" && label === "Membership" ? "text-yellow-900" : text
                    }`}
                  >
                    {value}
                  </span>
                  <span className="mt-1 text-sm uppercase tracking-wide text-gray-600 select-none">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* POSTS SECTION */}
        <section>
          <h3 className="text-4xl font-extrabold text-indigo-900 mb-10 tracking-wide text-center md:text-left">
            Recent Posts
          </h3>

          {loadingPosts ? (
            <p className="text-center text-indigo-500 text-lg animate-pulse">Loading posts...</p>
          ) : error ? (
            <p className="text-center text-red-600 font-semibold">{error}</p>
          ) : posts.length === 0 ? (
            <p className="text-center text-gray-500 italic">No posts available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
              {posts.map((post) => (
                <article
                  key={post._id || post.id}
                  className="bg-white rounded-3xl shadow-2xl p-8 hover:shadow-indigo-600/50 transition-shadow transform hover:-translate-y-1 cursor-pointer group"
                  onClick={() => alert(`Clicked on post: ${post.title}`)}
                >
                  <h4 className="text-2xl font-bold text-indigo-900 mb-3 line-clamp-2 group-hover:text-indigo-700 transition-colors">
                    {post.title}
                  </h4>
                  <p className="text-gray-700 text-base line-clamp-5 mb-6 select-text">
                    {post.description || post.content || "No description available."}
                  </p>
                  <button
                    className="text-indigo-600 font-semibold hover:text-indigo-800 focus:outline-none"
                    aria-label={`Read more about ${post.title}`}
                  >
                    Read More →
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default MyProfile;
