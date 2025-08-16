import { format } from 'date-fns';
import React, { useContext, useEffect, useState } from 'react';
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
import { AuthContext } from "../../../Authantication/Context/AuthContext";
import useAuth from "../../../Hooks/AxiosSeure/useAuth";
import useAxiosSecure from "../../../Hooks/AxiosSeure/useAxiosSecure";

const COLORS = ["#6366F1", "#10B981", "#F59E0B"];

const AdminProfile = () => {
  const axiosSecure = useAxiosSecure();
  const { UserData } = useAuth();
  const { darkMode } = useContext(AuthContext);

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
          confirmButtonColor: "#6366f1",
          background: darkMode ? '#1f2937' : '#ffffff',
          color: darkMode ? 'white' : '#1f2937',
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
  }, [UserData?.email, axiosSecure, darkMode]);

  const handleAddTag = async (e) => {
    e.preventDefault();
    if (!newTag.trim()) {
      Swal.fire({
        title: "Warning",
        text: "Please enter a tag name",
        icon: "warning",
        confirmButtonColor: "#6366f1",
        background: darkMode ? '#1f2937' : '#ffffff',
        color: darkMode ? 'white' : '#1f2937',
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
          confirmButtonColor: "#6366f1",
          background: darkMode ? '#1f2937' : '#ffffff',
          color: darkMode ? 'white' : '#1f2937',
        });
        setNewTag("");
        const res = await axiosSecure.get("/tags");
        setTags(res.data);
      } else {
        Swal.fire({
          title: "Error",
          text: "Failed to add tag",
          icon: "error",
          confirmButtonColor: "#6366f1",
          background: darkMode ? '#1f2937' : '#ffffff',
          color: darkMode ? 'white' : '#1f2937',
        });
      }
    } catch (error) {
      console.error("Error posting tag:", error.response || error.message);
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Failed to add tag",
        icon: "error",
        confirmButtonColor: "#6366f1",
        background: darkMode ? '#1f2937' : '#ffffff',
        color: darkMode ? 'white' : '#1f2937',
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
      cancelButtonText: "Cancel",
      background: darkMode ? '#1f2937' : '#ffffff',
      color: darkMode ? 'white' : '#1f2937',
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/tags/${tagId}`);
        setTags(tags.filter(tag => tag._id !== tagId));
        Swal.fire({
          title: "Deleted!",
          text: "Tag has been removed",
          icon: "success",
          confirmButtonColor: "#6366f1",
          background: darkMode ? '#1f2937' : '#ffffff',
          color: darkMode ? 'white' : '#1f2937',
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Failed to delete tag",
          icon: "error",
          confirmButtonColor: "#6366f1",
          background: darkMode ? '#1f2937' : '#ffffff',
          color: darkMode ? 'white' : '#1f2937',
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
          confirmButtonColor: "#6366f1",
          background: darkMode ? '#1f2937' : '#ffffff',
          color: darkMode ? 'white' : '#1f2937',
        });
      }
      setEditMode(false);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to update name",
        icon: "error",
        confirmButtonColor: "#6366f1",
        background: darkMode ? '#1f2937' : '#ffffff',
        color: darkMode ? 'white' : '#1f2937',
      });
    }
  };

  if (loading || countLoading) {
    return (
      <div className={`flex justify-center items-center min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="flex flex-col items-center">
          <div className={`animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 ${darkMode ? 'border-indigo-400' : 'border-indigo-600'} mb-4`}></div>
          <p className={`${darkMode ? 'text-indigo-400' : 'text-indigo-600'} font-medium text-lg`}>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!adminData) {
    return (
      <div className={`flex justify-center items-center min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`p-8 rounded-xl shadow-lg text-center max-w-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Admin Profile Not Found</h2>
          <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>We couldn't load your admin profile. Please try again later.</p>
          <button 
            onClick={() => window.location.reload()}
            className={`px-6 py-2 text-white rounded-lg hover:shadow-lg transition ${darkMode ? 'bg-indigo-700 hover:bg-indigo-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}
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
    <div className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Admin Dashboard</h1>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Last updated: {format(new Date(), 'MMMM d, yyyy h:mm a')}
          </div>
        </div>

        {/* Profile Section */}
        <div className={`rounded-xl shadow-md overflow-hidden mb-8 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
          <div className="p-6 sm:p-8 md:flex items-start gap-8">
            <div className="relative mb-6 md:mb-0">
              <img
                src={photo}
                alt="Admin Avatar"
                className={`w-32 h-32 md:w-40 md:h-40 rounded-full border-4 object-cover shadow-lg ${darkMode ? 'border-indigo-600' : 'border-indigo-500'}`}
              />
              <div className={`absolute -bottom-2 -right-2 rounded-full p-3 shadow-md ${darkMode ? 'bg-indigo-700' : 'bg-indigo-600'}`}>
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
                      className={`text-2xl font-bold px-2 py-1 focus:outline-none border-b-2 ${darkMode ? 'text-white bg-transparent border-indigo-500' : 'text-gray-900 border-indigo-500'}`}
                    />
                    <button
                      onClick={handleUpdateName}
                      className="text-green-500 hover:text-green-400"
                      title="Save"
                    >
                      <FaEdit size={18} />
                    </button>
                    <button
                      onClick={() => setEditMode(false)}
                      className="text-red-500 hover:text-red-400"
                      title="Cancel"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{name}</h2>
                    <button
                      onClick={() => setEditMode(true)}
                      className={`${darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'}`}
                      title="Edit name"
                    >
                      <FaEdit size={16} />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <p className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <FaEnvelope className={`${darkMode ? 'text-indigo-400' : 'text-indigo-500'} mr-2`} size={16} />
                  <span className="font-medium">{email}</span>
                </p>

                <div className="flex items-center gap-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    darkMode ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-100 text-indigo-800'
                  }`}>
                    <FaUserShield className="mr-1" /> {role.charAt(0).toUpperCase() + role.slice(1)}
                  </span>

                  <span className={`flex items-center text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-700'
                  }`}>
                    <FaCalendarAlt className={`${darkMode ? 'text-indigo-400' : 'text-indigo-500'} mr-2`} size={14} />
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
            <div key={name} className={`rounded-xl shadow-md overflow-hidden ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{name}</p>
                    <p className={`text-3xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{value.toLocaleString()}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-opacity-20' : 'bg-opacity-10'}`} style={{
                    backgroundColor: `${COLORS[index]}${darkMode ? '33' : '1a'}`
                  }}>
                    {React.cloneElement(icon, { className: `${darkMode ? 'text-white' : `text-[${COLORS[index]}]`}` })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pie Chart */}
          <div className={`rounded-xl shadow-md p-6 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-lg font-bold flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <FaChartPie className={`${darkMode ? 'text-indigo-400' : 'text-indigo-500'} mr-2`} /> Content Distribution
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
                      backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                      border: darkMode ? '1px solid #4b5563' : '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      padding: '0.5rem 1rem',
                      color: darkMode ? 'white' : '#1f2937'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tags Management */}
          <div className={`rounded-xl shadow-md p-6 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-lg font-bold flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <FaTags className={`${darkMode ? 'text-indigo-400' : 'text-indigo-500'} mr-2`} /> Manage Tags
              </h3>
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{tags.length} tags</span>
            </div>

            <form onSubmit={handleAddTag} className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="New tag name"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className={`flex-1 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'border-gray-300 text-gray-900'
                  }`}
                />
                <button
                  type="submit"
                  className={`flex items-center px-4 py-2 text-white rounded-lg hover:shadow-lg transition ${
                    darkMode 
                      ? 'bg-indigo-700 hover:bg-indigo-600'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
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
                    className={`flex items-center rounded-full px-3 py-1 ${
                      darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <span>#{tag.name}</span>
                    <button
                      onClick={() => handleDeleteTag(tag._id)}
                      className={`ml-2 ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-700'}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className={`text-center py-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No tags yet. Add your first tag!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;