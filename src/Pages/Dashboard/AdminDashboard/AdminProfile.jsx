import { format } from 'date-fns';
import { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaChartPie,
  FaCommentAlt,
  FaEdit,
  FaEnvelope,
  FaPenFancy,
  FaPlus,
  FaTags,
  FaUserShield,
  FaUsers
} from "react-icons/fa";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import Swal from "sweetalert2";
import useAuth from "../../../Hooks/AxiosSeure/useAuth";
import useAxiosSecure from "../../../Hooks/AxiosSeure/useAxiosSecure";

const COLORS = ["#6366F1", "#10B981", "#F59E0B"];

const AdminProfile = () => {
  const axiosSecure = useAxiosSecure();
  const { UserData } = useAuth();

  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countLoading, setCountLoading] = useState(true);
  const [counts, setCounts] = useState({ users: 0, posts: 0, comments: 0 });
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editedName, setEditedName] = useState("");

  useEffect(() => {
    if (!UserData?.email) return;

    const fetchAdminData = async () => {
      setLoading(true);
      try {
        const res = await axiosSecure.get(`/users/${UserData.email}/role`);
        setAdminData(res.data);
        setEditedName(res.data.name);
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Failed to load admin profile",
          icon: "error",
          confirmButtonColor: "#6366f1"
        });
        setAdminData(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchCounts = async () => {
      setCountLoading(true);
      try {
        const [userRes, commentRes, postRes] = await Promise.all([
          axiosSecure.get("/users/counts"),
          axiosSecure.get("/comments/count"),
          axiosSecure.get("/posts/count"),
        ]);
        setCounts({
          users: userRes.data.totalusers || 0,
          comments: commentRes.data.totalComments || 0,
          posts: postRes.data.totalPost || 0,
        });
      } catch (error) {
        console.error("Failed to fetch counts:", error);
      } finally {
        setCountLoading(false);
      }
    };

    const fetchTags = async () => {
      try {
        const res = await axiosSecure.get("/tags");
        setTags(res.data);
      } catch (error) {
        console.error("Failed to load tags:", error);
      }
    };

    fetchAdminData();
    fetchCounts();
    fetchTags();
  }, [UserData?.email, axiosSecure]);

  const handleAddTag = async (e) => {
    e.preventDefault();
    if (!newTag.trim()) {
      Swal.fire({
        title: "Warning",
        text: "Please enter a tag name",
        icon: "warning",
        confirmButtonColor: "#6366f1"
      });
      return;
    }
    try {
      const tagToSend = { name: newTag.trim(), value: newTag.trim().toLowerCase() };
      const response = await axiosSecure.post("/tags", tagToSend);
      if (response.status === 201) {
        Swal.fire({
          title: "Success",
          text: "Tag added successfully",
          icon: "success",
          confirmButtonColor: "#6366f1"
        });
        setNewTag("");
        const res = await axiosSecure.get("/tags");
        setTags(res.data);
      } else {
        Swal.fire({
          title: "Error",
          text: "Failed to add tag",
          icon: "error",
          confirmButtonColor: "#6366f1"
        });
      }
    } catch (error) {
      console.error("Error posting tag:", error.response || error.message);
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Failed to add tag",
        icon: "error",
        confirmButtonColor: "#6366f1"
      });
    }
  };

  const handleDeleteTag = async (tagId) => {
    const result = await Swal.fire({
      title: "Delete Tag?",
      text: "This will remove the tag from the system",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6366f1",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel"
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/tags/${tagId}`);
        setTags(tags.filter(tag => tag._id !== tagId));
        Swal.fire({
          title: "Deleted!",
          text: "Tag has been removed",
          icon: "success",
          confirmButtonColor: "#6366f1"
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Failed to delete tag",
          icon: "error",
          confirmButtonColor: "#6366f1"
        });
      }
    }
  };

  const handleUpdateName = async () => {
    try {
      const response = await axiosSecure.patch(`/users/${UserData.email}`, {
        name: editedName
      });
      if (response.data.modifiedCount > 0) {
        setAdminData({ ...adminData, name: editedName });
        Swal.fire({
          title: "Success!",
          text: "Name updated successfully",
          icon: "success",
          confirmButtonColor: "#6366f1"
        });
      }
      setEditMode(false);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to update name",
        icon: "error",
        confirmButtonColor: "#6366f1"
      });
    }
  };

  if (loading || countLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
          <p className="text-indigo-600 font-medium text-lg">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!adminData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Admin Profile Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't load your admin profile. Please try again later.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  const {
    email = "Not Provided",
    role = "admin",
    name = "Admin User",
    photo = "https://i.ibb.co/2Fc7Wp8/avatar.png",
    created_at = new Date()
  } = adminData;

  const pieData = [
    { name: "Users", value: counts.users, icon: <FaUsers className="inline mr-1" /> },
    { name: "Posts", value: counts.posts, icon: <FaPenFancy className="inline mr-1" /> },
    { name: "Comments", value: counts.comments, icon: <FaCommentAlt className="inline mr-1" /> }
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="text-sm text-gray-500">
            Last updated: {format(new Date(), 'MMMM d, yyyy h:mm a')}
          </div>
        </div>

        {/* Profile Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6 sm:p-8 md:flex items-start gap-8">
            <div className="relative mb-6 md:mb-0">
              <img
                src={photo}
                alt="Admin Avatar"
                className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-indigo-500 object-cover shadow-lg"
              />
              <div className="absolute -bottom-2 -right-2 bg-indigo-600 rounded-full p-3 shadow-md">
                <FaUserShield className="text-white text-xl" />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                {editMode ? (
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="text-2xl font-bold text-gray-900 border-b-2 border-indigo-500 px-2 py-1 focus:outline-none"
                    />
                    <button
                      onClick={handleUpdateName}
                      className="text-green-600 hover:text-green-800"
                      title="Save"
                    >
                      <FaEdit size={18} />
                    </button>
                    <button
                      onClick={() => setEditMode(false)}
                      className="text-red-600 hover:text-red-800"
                      title="Cancel"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-gray-900">{name}</h2>
                    <button
                      onClick={() => setEditMode(true)}
                      className="text-indigo-600 hover:text-indigo-800"
                      title="Edit name"
                    >
                      <FaEdit size={16} />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <p className="flex items-center text-gray-700">
                  <FaEnvelope className="text-indigo-500 mr-2" size={16} />
                  <span className="font-medium">{email}</span>
                </p>

                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium">
                    <FaUserShield className="mr-1" /> {role.charAt(0).toUpperCase() + role.slice(1)}
                  </span>

                  <span className="flex items-center text-gray-700 text-sm">
                    <FaCalendarAlt className="text-indigo-500 mr-2" size={14} />
                    Joined: {format(new Date(created_at), 'MMMM d, yyyy')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {pieData.map(({ name, value, icon }, index) => (
            <div key={name} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">{name}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{value.toLocaleString()}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${COLORS[index].replace(/[^0-9]/g, '') < 500 ? 'bg-opacity-10' : 'bg-opacity-20'} bg-[${COLORS[index]}]`}>
                    {icon}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pie Chart */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <FaChartPie className="text-indigo-500 mr-2" /> Content Distribution
              </h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [`${value}`, name]}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      padding: '0.5rem 1rem'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tags Management */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <FaTags className="text-indigo-500 mr-2" /> Manage Tags
              </h3>
              <span className="text-sm text-gray-500">{tags.length} tags</span>
            </div>

            <form onSubmit={handleAddTag} className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="New tag name"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  <FaPlus className="mr-1" /> Add
                </button>
              </div>
            </form>

            {tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <div
                    key={tag._id}
                    className="flex items-center bg-gray-100 rounded-full px-3 py-1"
                  >
                    <span className="text-gray-800">#{tag.name}</span>
                    <button
                      onClick={() => handleDeleteTag(tag._id)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No tags yet. Add your first tag!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;