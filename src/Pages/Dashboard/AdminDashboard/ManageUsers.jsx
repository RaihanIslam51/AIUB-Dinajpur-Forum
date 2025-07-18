import { useEffect, useState } from "react";
import useAxiosSecure from "../../../Hooks/AxiosSeure/useAxiosSecure";

const ManageUsers = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const axiosSecure = useAxiosSecure();

  // ✅ Load all users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axiosSecure.get("/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error loading users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // ✅ Search users by email
  const handleSearch = async () => {
    if (!search.trim()) {
      alert("Please enter a user email to search");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosSecure.get(`/users?email=${encodeURIComponent(search)}`);
      setUsers(response.data);
    } catch (error) {
      console.error("Search failed:", error);
      alert("Failed to search users");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Make user admin
  const makeAdmin = async (email) => {
    if (!window.confirm(`Make user (${email}) an admin?`)) return;

    try {
      const response = await axiosSecure.put("/users/admin", { email });
      if (response.status === 200) {
        alert("User promoted to admin successfully!");
        setUsers((prev) =>
          prev.map((u) => (u.email === email ? { ...u, role: "admin" } : u))
        );
      } else {
        alert("Failed to make admin");
      }
    } catch (error) {
      console.error("Admin update error:", error);
      alert("Error making user admin");
    }
  };

  // ✅ Delete user
  const handleDelete = async (email) => {
    if (!window.confirm(`Delete user (${email})?`)) return;

    try {
      const res = await axiosSecure.delete(`/users/${email}`);
      if (res.data.success) {
        alert("User deleted successfully.");
        setUsers((prev) => prev.filter((u) => u.email !== email));
      } else {
        alert("User not found.");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete user");
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by user email"
          className="border p-2 flex-grow rounded"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">User Name</th>
            <th className="border border-gray-300 p-2">User Email</th>
            <th className="border border-gray-300 p-2">Subscription Status</th>
            <th className="border border-gray-300 p-2">Role</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={5} className="text-center p-4">Loading...</td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center p-4">No users found.</td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.email} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2">{user.name || "-"}</td>
                <td className="border border-gray-300 p-2">{user.email}</td>
                <td className="border border-gray-300 p-2">
                  {user.membership === "Paid" ? (
                    <span className="text-green-600 font-semibold">Paid</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Unpaid</span>
                  )}
                </td>
                <td className="border border-gray-300 p-2 capitalize">
                  {user.role || "user"}
                </td>
                <td className="border border-gray-300 p-2 flex gap-2 justify-center">
                  {user.role === "admin" ? (
                    <span className="text-green-600 font-semibold">Admin</span>
                  ) : (
                    <button
                      onClick={() => makeAdmin(user.email)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Make Admin
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(user.email)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
