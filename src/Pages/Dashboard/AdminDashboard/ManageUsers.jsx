import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/AxiosSeure/useAxiosSecure";

const ManageUsers = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const axiosSecure = useAxiosSecure();

  // Load all users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axiosSecure.get("/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error loading users:", error);
        Swal.fire("Error", "Failed to load users.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [axiosSecure]);

  // Search users by email
  const handleSearch = async () => {
    if (!search.trim()) {
      Swal.fire("Oops!", "Please enter a user email to search.", "warning");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosSecure.get(`/users?email=${encodeURIComponent(search)}`);
      setUsers(response.data);
    } catch (error) {
      console.error("Search failed:", error);
      Swal.fire("Error", "Failed to search users.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Toggle user role between 'admin' and 'user' with SweetAlert confirm
  const toggleAdminStatus = async (user) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    const actionText = newRole === "admin" ? "Promote to Admin" : "Demote to User";

    const result = await Swal.fire({
      title: `Are you sure?`,
      text: `${actionText} (${user.email})`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: actionText,
      cancelButtonText: "Cancel",
      reverseButtons: true,
      focusCancel: true,
      confirmButtonColor: newRole === "admin" ? "#16a34a" : "#ca8a04", // green/yellow
    });

    if (result.isConfirmed) {
      try {
        const response = await axiosSecure.put("/users/admin", { email: user.email, role: newRole });
        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: `User role updated to "${newRole}" successfully!`,
            timer: 1800,
            showConfirmButton: false,
          });
          setUsers((prev) =>
            prev.map((u) => (u.email === user.email ? { ...u, role: newRole } : u))
          );
        } else {
          Swal.fire("Failed", "Failed to update role.", "error");
        }
      } catch (error) {
        console.error("Role update error:", error);
        Swal.fire("Error", "Error updating user role.", "error");
      }
    }
  };

  // Delete user with SweetAlert confirm
  const handleDelete = async (email) => {
    const result = await Swal.fire({
      title: `Delete User?`,
      text: `Are you sure you want to delete user (${email})? This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      focusCancel: true,
      confirmButtonColor: "#dc2626", // red
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/users/${email}`);
        if (res.data.success) {
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "User deleted successfully.",
            timer: 1500,
            showConfirmButton: false,
          });
          setUsers((prev) => prev.filter((u) => u.email !== email));
        } else {
          Swal.fire("Not found", "User not found.", "error");
        }
      } catch (error) {
        console.error("Delete failed:", error);
        Swal.fire("Error", "Failed to delete user.", "error");
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white rounded-xl shadow-xl">
      <h2 className="text-4xl font-extrabold mb-8 text-center text-indigo-700 select-none">
        Manage Users
      </h2>

      <div className="mb-8 flex gap-4 justify-center max-w-md mx-auto">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by user email"
          className="border border-indigo-300 p-3 flex-grow rounded-lg shadow-md placeholder-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-indigo-600 text-white px-8 rounded-lg shadow-lg hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-indigo-300 shadow-lg">
        <table className="w-full border-collapse text-left text-gray-800">
          <thead className="bg-indigo-50">
            <tr>
              {["User Name", "User Email", "Subscription Status", "Role", "Actions"].map((header) => (
                <th
                  key={header}
                  className="border border-indigo-300 p-4 font-semibold text-indigo-700 uppercase tracking-wide select-none"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center p-8 text-indigo-600 font-bold text-xl animate-pulse">
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-8 text-gray-500 font-medium text-lg select-none">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.email}
                  className="hover:bg-indigo-100 transition cursor-default"
                >
                  <td className="border border-indigo-300 p-4 font-semibold">{user.name || "-"}</td>
                  <td className="border border-indigo-300 p-4">{user.email}</td>
                  <td className="border border-indigo-300 p-4">
                    {user.membership === "Paid" ? (
                      <span className="text-green-600 font-semibold">Paid</span>
                    ) : (
                      <span className="text-red-600 font-semibold">Unpaid</span>
                    )}
                  </td>
                  <td className="border border-indigo-300 p-4 capitalize font-semibold">{user.role || "user"}</td>
                  <td className="border border-indigo-300 p-4 flex justify-center gap-4">
                    <button
                      onClick={() => toggleAdminStatus(user)}
                      className={`px-5 py-2 rounded-full font-semibold shadow-md transition
                        ${
                          user.role === "admin"
                            ? "bg-yellow-400 hover:bg-yellow-500 text-gray-900"
                            : "bg-green-600 hover:bg-green-700 text-white"
                        }`}
                      aria-label={user.role === "admin" ? "Make User" : "Make Admin"}
                    >
                      {user.role === "admin" ? "Make User" : "Make Admin"}
                    </button>
                    <button
                      onClick={() => handleDelete(user.email)}
                      className="bg-red-600 px-5 py-2 rounded-full text-white font-semibold shadow-md hover:bg-red-700 transition"
                      aria-label="Delete User"
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
    </div>
  );
};

export default ManageUsers;
