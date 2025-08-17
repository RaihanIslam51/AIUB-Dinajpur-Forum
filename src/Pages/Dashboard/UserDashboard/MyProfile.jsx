import { Skeleton } from "@mui/material";
import { Award, ChevronRight, Clock, Edit, FileText, User } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../Authantication/Context/AuthContext";
import useAuth from "../../../Hooks/AxiosSeure/useAuth";
import useAxiosSesure from "../../../Hooks/AxiosSeure/useAxiosSecure";
// import defaultAvatar from '/default-avatar.png';

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
  const [isUploading, setIsUploading] = useState(false);

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
          setProfilePic(user?.image || UserData?.photoURL || "");
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

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", image);
    
    try {
      const res = await axiosSecure.post(
        `https://api.imgbb.com/1/upload?key=36f47c5ee620bb292f8a6a4a24adb091`,
        formData
      );
      setProfilePic(res.data.data.url);
      
      // Update profile picture in backend
      await axiosSecure.patch(`/users/${dbUser._id}`, {
        image: res.data.data.url
      });
      
    } catch (error) {
      console.error("Image upload failed", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleViewAllPosts = () => {
    navigate('/dashboard/MyPosts');
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className={`max-w-7xl mx-auto p-4 sm:p-6 md:p-8 ${darkMode ? 'bg-gray-900' : ''}`}>
        <div className={`rounded-2xl shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            <Skeleton 
              variant="circular" 
              width={120} 
              height={120} 
              className={`mx-auto md:mx-0 ${darkMode ? 'bg-gray-700' : ''}`} 
            />
            <div className="flex-1 space-y-4">
              <Skeleton 
                variant="text" 
                width="60%" 
                height={40} 
                className={`mx-auto md:mx-0 ${darkMode ? 'bg-gray-700' : ''}`} 
              />
              <Skeleton 
                variant="text" 
                width="40%" 
                height={30} 
                className={`mx-auto md:mx-0 ${darkMode ? 'bg-gray-700' : ''}`} 
              />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton 
                    key={i} 
                    variant="rectangular" 
                    width="100%" 
                    height={80} 
                    className={`rounded-lg ${darkMode ? 'bg-gray-700' : ''}`} 
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="mt-12">
            <Skeleton 
              variant="text" 
              width="30%" 
              height={40} 
              className={`mx-auto md:mx-0 ${darkMode ? 'bg-gray-700' : ''}`} 
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-6">
              {[1, 2, 3].map((i) => (
                <Skeleton 
                  key={i} 
                  variant="rectangular" 
                  height={180} 
                  className={`rounded-xl ${darkMode ? 'bg-gray-700' : ''}`} 
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`max-w-7xl mx-auto p-4 sm:p-8 ${darkMode ? 'bg-gray-900' : ''}`}>
        <div className={`rounded-2xl shadow-md p-6 md:p-8 text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className={`text-lg md:text-xl font-medium mb-4 ${darkMode ? 'text-red-400' : 'text-red-500'}`}>
            {error}
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-7xl mx-auto p-4 sm:p-6 md:p-8 ${darkMode ? 'bg-gray-900' : ''}`}>
      {/* Profile Card */}
      <div className={`rounded-2xl shadow-lg overflow-hidden mb-6 md:mb-8 transition-all ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 sm:p-6 text-white">
          <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6">
            <div className="relative group">
              {isUploading ? (
                <Skeleton 
                  variant="circular" 
                  width={120} 
                  height={120} 
                  className={`${darkMode ? 'bg-gray-700' : 'bg-indigo-200'}`} 
                />
              ) : (
                <>
                  <img
                    src={profilePic}
                    alt="Profile"
                    className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-white/80 shadow-lg"
                    onError={(e) => {
                      e.target.onerror = null;
                      // e.target.src = defaultAvatar;
                    }}
                  />
                  <label
                    htmlFor="upload"
                    className={`absolute bottom-0 right-0 p-2 rounded-full shadow-md cursor-pointer transition ${
                      darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'
                    }`}
                    title="Change Profile Picture"
                  >
                    <Edit className={`w-4 h-4 sm:w-5 sm:h-5 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                  </label>
                  <input
                    id="upload"
                    type="file"
                    accept="image/*"
                    onChange={handleUploadImg}
                    className="hidden"
                    disabled={isUploading}
                  />
                </>
              )}
            </div>

            <div className="flex-1 text-center md:text-left mt-4 md:mt-0">
              <h1 className="text-2xl sm:text-3xl font-bold flex items-center justify-center md:justify-start gap-2 sm:gap-3">
                {dbUser?.name || UserData?.displayName || "Anonymous User"}
                {badge === "gold" && (
                  <Award className="text-yellow-400 w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" />
                )}
              </h1>
              <p className="text-indigo-100 mt-1 text-sm sm:text-base">
                {dbUser?.email || UserData?.email || "No email provided"}
              </p>
              <p className="text-indigo-200 mt-2 sm:mt-3 flex items-center justify-center md:justify-start gap-2 text-xs sm:text-sm">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                Joined {dbUser?.created_at ? formatDate(dbUser.created_at) : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <StatCard 
            darkMode={darkMode} 
            value={postCount} 
            label="Total Posts" 
            highlight={true}
          />
          
          <StatCard 
            darkMode={darkMode} 
            value={dbUser?.role || "User"} 
            label="Account Role" 
            capitalize={true}
          />
          
          <StatCard 
            darkMode={darkMode} 
            value={badge} 
            label="Membership" 
            highlight={badge === "gold"}
            capitalize={true}
            gold={badge === "gold"}
          />
          
          <StatCard 
            darkMode={darkMode} 
            value={dbUser?.commentsCount || 0} 
            label="Comments" 
          />
        </div>
      </div>

      {/* Recent Posts Section */}
      <div className={`rounded-2xl shadow-lg p-4 sm:p-6 transition-all ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className={`text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 ${
          darkMode ? 'text-white' : 'text-gray-800'
        }`}>
          <FileText className={`w-5 h-5 sm:w-6 sm:h-6 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <span>Recent Posts</span>
        </h2>

        {posts.length === 0 ? (
          <div className={`text-center py-8 rounded-lg ${
            darkMode ? 'bg-gray-700/50 text-gray-400' : 'bg-gray-50 text-gray-500'
          }`}>
            <User className="mx-auto w-8 h-8 mb-3" />
            <p className="text-sm sm:text-base">You haven't created any posts yet.</p>
            <button
              onClick={() => navigate('/dashboard/AddPost')}
              className="mt-4 px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm sm:text-base"
            >
              Create Your First Post
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {(showAllPosts ? posts : posts.slice(0, 6)).map((post) => (
                <PostCard 
                  key={post._id} 
                  post={post} 
                  darkMode={darkMode} 
                  onClick={() => navigate(`/posts/${post._id}`)}
                />
              ))}
            </div>
            
            {posts.length > 6 && !showAllPosts && (
              <div className="mt-6 sm:mt-8 text-center">
                <button
                  onClick={() => setShowAllPosts(true)}
                  className="px-5 sm:px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 mx-auto text-sm sm:text-base"
                >
                  See All My Posts
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {showAllPosts && (
              <div className="mt-6 sm:mt-8 text-center">
                <button
                  onClick={handleViewAllPosts}
                  className={`px-5 sm:px-6 py-2 rounded-lg transition-colors flex items-center gap-2 mx-auto text-sm sm:text-base ${
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

// Reusable Stat Card Component
const StatCard = ({ darkMode, value, label, highlight = false, capitalize = false, gold = false }) => (
  <div className={`p-3 sm:p-4 rounded-lg text-center transition-all ${
    gold
      ? darkMode ? 'bg-yellow-900/30' : 'bg-yellow-50'
      : highlight
        ? darkMode ? 'bg-gray-700' : 'bg-indigo-50'
        : darkMode ? 'bg-gray-700' : 'bg-gray-50'
  }`}>
    <div className={`font-bold text-xl sm:text-2xl ${
      gold
        ? darkMode ? 'text-yellow-400' : 'text-yellow-600'
        : highlight
          ? darkMode ? 'text-indigo-300' : 'text-indigo-600'
          : darkMode ? 'text-gray-300' : 'text-gray-600'
    } ${capitalize ? 'capitalize' : ''}`}>
      {value}
    </div>
    <div className={`text-xs sm:text-sm mt-1 ${
      darkMode ? 'text-gray-300' : 'text-gray-600'
    }`}>
      {label}
    </div>
  </div>
);

// Reusable Post Card Component
const PostCard = ({ post, darkMode, onClick }) => (
  <div 
    onClick={onClick}
    className={`border rounded-xl hover:shadow-md transition-all cursor-pointer ${
      darkMode ? 'border-gray-700 bg-gray-700 hover:bg-gray-600' : 'border-gray-200 bg-white hover:bg-gray-50'
    }`}
  >
    <div className="p-4 sm:p-5">
      <h3 className={`font-bold text-base sm:text-lg mb-2 line-clamp-2 ${
        darkMode ? 'text-white' : 'text-gray-800'
      }`}>
        {post.title}
      </h3>
      <p className={`text-xs sm:text-sm line-clamp-3 mb-3 sm:mb-4 ${
        darkMode ? 'text-gray-300' : 'text-gray-600'
      }`}>
        {post.description || post.content}
      </p>
      <div className={`flex justify-between items-center text-xs sm:text-sm ${
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
);

export default MyProfile;