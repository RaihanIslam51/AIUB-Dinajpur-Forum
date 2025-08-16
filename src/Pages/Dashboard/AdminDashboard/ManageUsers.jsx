import { useEffect, useState, useContext } from "react";
import { FaSearch, FaUserShield, FaUser, FaTrash, FaSyncAlt, FaCrown } from "react-icons/fa";
import { HiBadgeCheck } from "react-icons/hi";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/AxiosSeure/useAxiosSecure";
import { AuthContext } from "../../../Authantication/Context/AuthContext";

const ManageUsers = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const axiosSecure = useAxiosSecure();
  const { darkMode } = useContext(AuthContext);

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
        confirmButtonColor: "#6366f1",
        background: darkMode ? '#1f2937' : '#ffffff',
        color: darkMode ? 'white' : '#1f2937',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [axiosSecure, darkMode]);

  // Search users by email
  const handleSearch = async () => {
    if (!search.trim()) {
      Swal.fire({
        title: "Search Required",
        text: "Please enter a user email to search",
        icon: "warning",
        confirmButtonColor: "#6366f1",
        background: darkMode ? '#1f2937' : '#ffffff',
        color: darkMode ? 'white' : '#1f2937',
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
        confirmButtonColor: "#6366f1",
        background: darkMode ? '#1f2937' : '#ffffff',
        color: darkMode ? 'white' : '#1f2937',
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
      background: darkMode ? '#1f2937' : '#ffffff',
      color: darkMode ? 'white' : '#1f2937',
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
            background: darkMode ? '#1f2937' : '#ffffff',
            color: darkMode ? 'white' : '#1f2937',
          });
          setUsers(prev => prev.map(u => u.email === user.email ? { ...u, role: newRole } : u));
        }
      } catch (error) {
        console.error("Role update error:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to update role",
          icon: "error",
          confirmButtonColor: "#6366f1",
          background: darkMode ? '#1f2937' : '#ffffff',
          color: darkMode ? 'white' : '#1f2937',
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
      background: darkMode ? '#1f2937' : '#ffffff',
      color: darkMode ? 'white' : '#1f2937',
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
            background: darkMode ? '#1f2937' : '#ffffff',
            color: darkMode ? 'white' : '#1f2937',
          });
          setUsers(prev => prev.filter(u => u.email !== email));
        }
      } catch (error) {
        console.error("Delete failed:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to delete user",
          icon: "error",
          confirmButtonColor: "#6366f1",
          background: darkMode ? '#1f2937' : '#ffffff',
          color: darkMode ? 'white' : '#1f2937',
        });
      }
    }
  };

  return (
    <div className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>User Management</h1>
            <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
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
              className={`p-2 rounded-lg shadow border ${darkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-white border-gray-200 hover:bg-gray-50'} disabled:opacity-50`}
              aria-label="Refresh"
            >
              <FaSyncAlt className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by email"
                className={`w-full pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'border-gray-300 text-gray-900'
                }`}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <FaSearch className={`absolute left-3 top-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            
            <button
              onClick={handleSearch}
              disabled={loading}
              className={`px-4 py-2 text-white rounded-lg hover:shadow-lg transition ${
                darkMode 
                  ? 'bg-indigo-700 hover:bg-indigo-600'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              } disabled:opacity-50`}
            >
              Search
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className={`shadow rounded-xl overflow-hidden ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    User
                  </th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Email
                  </th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Membership
                  </th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Role
                  </th>
                  <th scope="col" className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center">
                      <div className="flex justify-center">
                        <div className={`animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 ${darkMode ? 'border-indigo-400' : 'border-indigo-600'}`}></div>
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className={`px-6 py-8 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {search ? 'No matching users found' : 'No users in system'}
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.email} className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                            darkMode ? 'bg-indigo-900/50' : 'bg-indigo-100'
                          }`}>
                            <span className={darkMode ? 'text-indigo-300 font-medium' : 'text-indigo-600 font-medium'}>
                              {user.name?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {user.name || 'Unknown'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.membership === "Paid" 
                            ? darkMode 
                              ? 'bg-green-900/50 text-green-300' 
                              : 'bg-green-100 text-green-800' 
                            : darkMode 
                              ? 'bg-gray-700 text-gray-300' 
                              : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.membership === "Paid" ? (
                            <span className="flex items-center">
                              <HiBadgeCheck className={`mr-1 ${darkMode ? 'text-green-400' : 'text-green-500'}`} /> Premium
                            </span>
                          ) : 'Basic'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === "admin" 
                            ? darkMode 
                              ? 'bg-purple-900/50 text-purple-300' 
                              : 'bg-purple-100 text-purple-800' 
                            : darkMode 
                              ? 'bg-blue-900/50 text-blue-300' 
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
                                ? darkMode
                                  ? 'bg-yellow-900/50 text-yellow-300 hover:bg-yellow-800/50'
                                  : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                : darkMode
                                  ? 'bg-indigo-900/50 text-indigo-300 hover:bg-indigo-800/50'
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
                            className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${
                              darkMode
                                ? 'bg-red-900/50 text-red-300 hover:bg-red-800/50'
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                            }`}
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