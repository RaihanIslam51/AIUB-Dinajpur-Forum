import { Skeleton } from "@mui/material";
import { Award, ChevronRight, Clock, Edit, FileText } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../Authantication/Context/AuthContext";
import useAuth from "../../../Hooks/AxiosSeure/useAuth";
import useAxiosSesure from "../../../Hooks/AxiosSeure/useAxiosSecure";

const MyProfile = () => {
  const { UserData } = useAuth();
  const axiosSecure = useAxiosSesure();
  const navigate = useNavigate();
  const { darkMode } = useContext(AuthContext);

  const [profilePic, setProfilePic] = useState(UserData?.photoURL || "");
  const [badge, setBadge] = useState("bronze");
  const [dbUser, setDbUser] = useState({});
  const [postCount, setPostCount] = useState(0);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllPosts, setShowAllPosts] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (UserData?.email) {
        try {
          setLoading(true);
          const [userRes, postRes] = await Promise.all([
            axiosSecure.get(`/users?email=${UserData.email}`),
            axiosSecure.get(`/posts/counts?email=${UserData.email}`)
          ]);
          
          const user = Array.isArray(userRes.data) ? userRes.data[0] : userRes.data;
          setDbUser(user || {});
          setProfilePic(user?.image || UserData?.image || "");
          setBadge(user?.payment_status?.toLowerCase().includes("gold") ? "gold" : "bronze");
          setPostCount(postRes.data.count || 0);

          const postsRes = await axiosSecure.get(`/mypost?email=${UserData.email}`);
          setPosts(postsRes.data.sort((a, b) => new Date(b.date) - new Date(a.date)));
        } catch (err) {
          console.error("Fetch failed:", err);
          setError("Failed to load profile data");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchUserData();
  }, [UserData, axiosSecure]);

  const handleUploadImg = async (e) => {
    const image = e.target.files[0];
    if (!image) return;

    const formData = new FormData();
    formData.append("image", image);
    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=36f47c5ee620bb292f8a6a4a24adb091`,
        formData
      );
      setProfilePic(res.data.data.url);
      // TODO: Update profile picture in backend
    } catch (error) {
      console.error("Image upload failed", error);
    }
  };

  const handleViewAllPosts = () => {
    navigate('/dashboard/MyPosts');
  };

  if (loading) {
    return (
      <div className={`max-w-7xl mx-auto p-8 ${darkMode ? 'bg-gray-900' : ''}`}>
        <div className={`rounded-2xl shadow-md p-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex flex-col md:flex-row gap-8">
            <Skeleton variant="circular" width={160} height={160} className={darkMode ? 'bg-gray-700' : ''} />
            <div className="flex-1 space-y-4">
              <Skeleton variant="text" width="60%" height={50} className={darkMode ? 'bg-gray-700' : ''} />
              <Skeleton variant="text" width="40%" height={30} className={darkMode ? 'bg-gray-700' : ''} />
              <div className="flex flex-wrap gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} variant="rectangular" width={120} height={80} className={darkMode ? 'bg-gray-700' : ''} />
                ))}
              </div>
            </div>
          </div>
          <div className="mt-12">
            <Skeleton variant="text" width="30%" height={40} className={darkMode ? 'bg-gray-700' : ''} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} variant="rectangular" height={200} className={darkMode ? 'bg-gray-700' : ''} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`max-w-7xl mx-auto p-8 ${darkMode ? 'bg-gray-900' : ''}`}>
        <div className={`rounded-2xl shadow-md p-8 text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className={`text-xl font-medium mb-4 ${darkMode ? 'text-red-400' : 'text-red-500'}`}>{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-7xl mx-auto p-4 sm:p-8 ${darkMode ? 'bg-gray-900' : ''}`}>
      {/* Profile Card */}
      <div className={`rounded-2xl shadow-lg overflow-hidden mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative group">
              <img
                src={profilePic || UserData?.photoURL}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-white/80 shadow-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/default-avatar.png';
                }}
              />
              <label
                htmlFor="upload"
                className={`absolute bottom-0 right-0 p-2 rounded-full shadow-md cursor-pointer transition ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'
                }`}
                title="Change Profile Picture"
              >
                <Edit className={`w-5 h-5 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
              </label>
              <input
                id="upload"
                type="file"
                accept="image/*"
                onChange={handleUploadImg}
                className="hidden"
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold flex items-center justify-center md:justify-start gap-3">
                {dbUser?.name || UserData?.name}
                {badge === "gold" && (
                  <Award className="text-yellow-400 w-6 h-6" />
                )}
              </h1>
              <p className="text-indigo-100 mt-1">{dbUser?.email || UserData?.email}</p>
              <p className="text-indigo-200 mt-3 flex items-center justify-center md:justify-start gap-2">
                <Clock className="w-4 h-4" />
                Joined {dbUser?.created_at ? new Date(dbUser.created_at).toLocaleDateString() : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className={`p-4 rounded-lg text-center ${
            darkMode ? 'bg-gray-700' : 'bg-indigo-50'
          }`}>
            <div className={`font-bold text-2xl ${
              darkMode ? 'text-indigo-300' : 'text-indigo-600'
            }`}>{postCount}</div>
            <div className={`text-sm ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>Total Posts</div>
          </div>
          
          <div className={`p-4 rounded-lg text-center ${
            darkMode ? 'bg-gray-700' : 'bg-indigo-50'
          }`}>
            <div className={`font-bold text-2xl capitalize ${
              darkMode ? 'text-indigo-300' : 'text-indigo-600'
            }`}>{dbUser?.role || "User"}</div>
            <div className={`text-sm ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>Account Role</div>
          </div>
          
          <div className={`p-4 rounded-lg text-center ${
            badge === "gold"
              ? darkMode ? 'bg-yellow-900/30' : 'bg-yellow-50'
              : darkMode ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <div className={`font-bold text-2xl capitalize ${
              badge === "gold"
                ? darkMode ? 'text-yellow-400' : 'text-yellow-600'
                : darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {badge}
            </div>
            <div className={`text-sm ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>Membership</div>
          </div>
          
          <div className={`p-4 rounded-lg text-center ${
            darkMode ? 'bg-gray-700' : 'bg-indigo-50'
          }`}>
            <div className={`font-bold text-2xl ${
              darkMode ? 'text-indigo-300' : 'text-indigo-600'
            }`}>0</div>
            <div className={`text-sm ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>Comments</div>
          </div>
        </div>
      </div>

      {/* Recent Posts Section */}
      <div className={`rounded-2xl shadow-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className={`text-2xl font-bold mb-6 flex items-center gap-3 ${
          darkMode ? 'text-white' : 'text-gray-800'
        }`}>
          <FileText className="text-indigo-600" />
          Recent Posts
        </h2>

        {posts.length === 0 ? (
          <div className={`text-center py-8 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            You haven't created any posts yet.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(showAllPosts ? posts : posts.slice(0, 6)).map((post) => (
                <div key={post._id} className={`border rounded-xl hover:shadow-md transition ${
                  darkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-white'
                }`}>
                  <div className="p-5">
                    <h3 className={`font-bold text-lg mb-2 line-clamp-2 ${
                      darkMode ? 'text-white' : 'text-gray-800'
                    }`}>{post.title}</h3>
                    <p className={`text-sm line-clamp-3 mb-4 ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>{post.description || post.content}</p>
                    <div className={`flex justify-between items-center text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                      <button className={`font-medium ${
                        darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'
                      }`}>
                        View →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {posts.length > 6 && !showAllPosts && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setShowAllPosts(true)}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 mx-auto"
                >
                  See All My Posts
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {showAllPosts && (
              <div className="mt-8 text-center">
                <button
                  onClick={handleViewAllPosts}
                  className={`px-6 py-2 rounded-lg hover:bg-indigo-50 transition flex items-center gap-2 mx-auto ${
                    darkMode 
                      ? 'bg-gray-700 border border-indigo-500 text-indigo-400 hover:bg-gray-600'
                      : 'bg-white border border-indigo-600 text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  View in Posts Manager
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyProfile;