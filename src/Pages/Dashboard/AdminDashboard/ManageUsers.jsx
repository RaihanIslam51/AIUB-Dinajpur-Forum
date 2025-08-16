import { useEffect, useState } from "react";
import { FaSearch, FaUserShield, FaUser, FaTrash, FaSyncAlt, FaCrown } from "react-icons/fa";
import { HiBadgeCheck } from "react-icons/hi";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/AxiosSeure/useAxiosSecure";

const ManageUsers = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const axiosSecure = useAxiosSecure();

  // Load all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosSecure.get("/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error loading users:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to load users",
        icon: "error",
        confirmButtonColor: "#6366f1"
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [axiosSecure]);

  // Search users by email
  const handleSearch = async () => {
    if (!search.trim()) {
      Swal.fire({
        title: "Search Required",
        text: "Please enter a user email to search",
        icon: "warning",
        confirmButtonColor: "#6366f1"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axiosSecure.get(`/users?email=${encodeURIComponent(search)}`);
      setUsers(response.data);
    } catch (error) {
      console.error("Search failed:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to search users",
        icon: "error",
        confirmButtonColor: "#6366f1"
      });
    } finally {
      setLoading(false);
    }
  };

  // Toggle user role
  const toggleAdminStatus = async (user) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    const actionText = newRole === "admin" ? "Promote to Admin" : "Demote to User";

    const result = await Swal.fire({
      title: `Change User Role?`,
      text: `${actionText}: ${user.email}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: actionText,
      cancelButtonText: "Cancel",
      reverseButtons: true,
      confirmButtonColor: newRole === "admin" ? "#10b981" : "#f59e0b",
      background: "#ffffff",
      backdrop: `
        rgba(79, 70, 229, 0.1)
        left top
        no-repeat
      `,
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    });

    if (result.isConfirmed) {
      try {
        const response = await axiosSecure.put("/users/admin", { 
          email: user.email, 
          role: newRole 
        });
        
        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: `User role updated to ${newRole}`,
            timer: 1500,
            showConfirmButton: false,
          });
          setUsers(prev => prev.map(u => u.email === user.email ? { ...u, role: newRole } : u));
        }
      } catch (error) {
        console.error("Role update error:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to update role",
          icon: "error",
          confirmButtonColor: "#6366f1"
        });
      }
    }
  };

  // Delete user
  const handleDelete = async (email) => {
    const result = await Swal.fire({
      title: "Delete User?",
      text: `This will permanently delete ${email}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6366f1",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/users/${email}`);
        if (res.data.success) {
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "User removed successfully",
            timer: 1500,
            showConfirmButton: false,
          });
          setUsers(prev => prev.filter(u => u.email !== email));
        }
      } catch (error) {
        console.error("Delete failed:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to delete user",
          icon: "error",
          confirmButtonColor: "#6366f1"
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-2">
              {users.length} {users.length === 1 ? 'user' : 'users'} in system
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                setRefreshing(true);
                fetchUsers();
              }}
              disabled={refreshing}
              className="p-2 bg-white rounded-lg shadow border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
              aria-label="Refresh"
            >
              <FaSyncAlt className={`text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by email"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              Search
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white shadow rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Membership
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      {search ? 'No matching users found' : 'No users in system'}
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.email} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-indigo-600 font-medium">
                              {user.name?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name || 'Unknown'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.membership === "Paid" 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.membership === "Paid" ? (
                            <span className="flex items-center">
                              <HiBadgeCheck className="mr-1 text-green-500" /> Premium
                            </span>
                          ) : 'Basic'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === "admin" 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role === "admin" ? (
                            <span className="flex items-center">
                              <FaUserShield className="mr-1" /> Admin
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <FaUser className="mr-1" /> User
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => toggleAdminStatus(user)}
                            className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${
                              user.role === "admin"
                                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                : 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'
                            }`}
                          >
                            {user.role === "admin" ? (
                              <>
                                <FaUser className="mr-1" /> Make User
                              </>
                            ) : (
                              <>
                                <FaUserShield className="mr-1" /> Make Admin
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(user.email)}
                            className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-red-100 text-red-800 hover:bg-red-200"
                          >
                            <FaTrash className="mr-1" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;