import { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaCommentAlt,
  FaEnvelope,
  FaPenFancy,
  FaTags,
  FaUserShield,
  FaUsers,
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

  useEffect(() => {
    if (!UserData?.email) return;

    const fetchAdminData = async () => {
      setLoading(true);
      try {
        const res = await axiosSecure.get(`/users/${UserData.email}/role`);
        setAdminData(res.data);
      } catch (error) {
        Swal.fire("Error", "Failed to load admin profile", "error");
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
      Swal.fire("Warning", "Please enter a tag name", "warning");
      return;
    }
    try {
      const tagToSend = { name: newTag.trim(), value: newTag.trim() };
      const response = await axiosSecure.post("/tags", tagToSend);
      if (response.status === 201) {
        Swal.fire("Success", "Tag added successfully", "success");
        setNewTag("");
        const res = await axiosSecure.get("/tags");
        setTags(res.data);
      } else {
        Swal.fire("Error", "Failed to add tag", "error");
      }
    } catch (error) {
      console.error("Error posting tag:", error.response || error.message);
      Swal.fire("Error", "Failed to add tag", "error");
    }
  };

  if (loading || countLoading) {
    return (
      <div className="flex justify-center items-center h-60">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 border-solid"></div>
      </div>
    );
  }

  if (!adminData) {
    return (
      <div className="text-center text-red-600 font-semibold mt-12 select-none">
        No admin profile found.
      </div>
    );
  }

  const {
    email = "Not Provided",
    role = "admin",
    name = "Admin User",
    photo = "https://i.ibb.co/2Fc7Wp8/avatar.png",
    created_at = "Unknown",
  } = adminData;

  const pieData = [
    { name: "Users", value: counts.users },
    { name: "Posts", value: counts.posts },
    { name: "Comments", value: counts.comments },
  ];

  return (
    <section className="max-w-7xl mx-auto mt-20 px-6 sm:px-10">
      <div className="bg-white dark:bg-gray-900 shadow-3xl rounded-3xl p-10 sm:p-14">
        {/* Profile Info */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-12 text-center md:text-left">
          <div className="relative group">
            <img
              src={photo}
              alt="Admin Avatar"
              className="w-40 h-40 rounded-full border-8 border-indigo-600 object-cover shadow-xl transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute -bottom-3 -right-3 bg-indigo-700 rounded-full p-4 shadow-lg animate-pulse">
              <FaUserShield className="text-white text-2xl" title="Admin Role" />
            </div>
          </div>

          <div className="flex-1 space-y-5">
            <h2 className="text-4xl font-extrabold text-indigo-700 dark:text-indigo-400 tracking-wide drop-shadow-lg">
              {name}
            </h2>

            <p className="flex items-center justify-center md:justify-start gap-3 text-gray-700 dark:text-gray-300 text-lg font-semibold tracking-wide">
              <FaEnvelope className="text-indigo-500" size={22} />
              {email}
            </p>

            <span className="inline-flex items-center gap-3 bg-indigo-100 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200 px-6 py-3 rounded-full font-semibold text-lg shadow-inner tracking-wide select-none">
              <FaUserShield size={20} /> Role: <span className="capitalize">{role}</span>
            </span>

            <div className="flex items-center gap-3 text-lg font-semibold text-gray-700 dark:text-gray-400 tracking-wide">
              <FaCalendarAlt className="text-indigo-500" size={22} />
              Joined on:{" "}
              <span className="text-indigo-600 dark:text-indigo-300 ml-2 font-medium">
                {created_at}
              </span>
            </div>
          </div>
        </div>

        {/* Counts Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16 text-center">
          {[
            {
              icon: FaUsers,
              label: "Total Users",
              count: counts.users,
              color: "text-indigo-700",
              bgColor: "bg-indigo-100 dark:bg-indigo-800",
            },
            {
              icon: FaPenFancy,
              label: "Total Posts",
              count: counts.posts,
              color: "text-green-600",
              bgColor: "bg-green-100 dark:bg-green-900",
            },
            {
              icon: FaCommentAlt,
              label: "Total Comments",
              count: counts.comments,
              color: "text-yellow-500",
              bgColor: "bg-yellow-100 dark:bg-yellow-900",
            },
          ].map(({ icon: Icon, label, count, color, bgColor }, idx) => (
            <div
              key={idx}
              className={`${bgColor} p-8 rounded-3xl shadow-lg flex flex-col items-center space-y-4 transform transition-transform hover:scale-105`}
            >
              <Icon className={`${color} text-5xl drop-shadow-lg`} />
              <p className={`text-3xl font-extrabold ${color}`}>{count}</p>
              <p className="text-gray-700 dark:text-gray-300 text-lg font-semibold">{label}</p>
            </div>
          ))}
        </div>

        {/* Pie Chart */}
        <div className="mt-20 max-w-lg mx-auto">
          <h3 className="text-2xl font-bold mb-6 text-center text-indigo-700 dark:text-indigo-300 tracking-wide">
            Site Overview
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
                fill="#8884d8"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
                animationDuration={800}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="#ffffff"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#4c51bf",
                  borderRadius: "10px",
                  border: "none",
                  color: "#fff",
                  fontWeight: "600",
                }}
                formatter={(value, name) => [`${value}`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Tags Section */}
        <div className="mt-20 max-w-xl mx-auto">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-indigo-700 dark:text-indigo-300 tracking-wide">
            <FaTags className="text-indigo-500" size={26} /> Manage Tags
          </h3>
          <form
            onSubmit={handleAddTag}
            className="flex gap-4 items-center bg-indigo-50 dark:bg-indigo-900 p-6 rounded-3xl shadow-lg"
          >
            <input
              type="text"
              placeholder="Enter new tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="flex-1 px-5 py-3 rounded-xl border border-indigo-300 dark:border-indigo-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-lg font-semibold placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
            <button
              type="submit"
              className="bg-indigo-700 hover:bg-indigo-800 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-xl transition-transform transform hover:scale-105"
            >
              Add Tag
            </button>
          </form>

          {tags.length > 0 && (
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {tags.map((tag) => (
                <span
                  key={tag._id}
                  className="bg-indigo-100 dark:bg-indigo-800 text-indigo-900 dark:text-indigo-300 px-4 py-2 rounded-2xl text-base font-semibold text-center select-none shadow-inner"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminProfile;
