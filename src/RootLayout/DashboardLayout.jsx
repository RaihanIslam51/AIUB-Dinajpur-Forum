import { FaArrowLeft } from 'react-icons/fa';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const DashboardLayout = () => {
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-md text-base font-medium transition ${
      isActive ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-indigo-100'
    }`;

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4 space-y-4 hidden md:block">
        <h2 className="text-2xl font-bold text-indigo-600 mb-6">Dashboard</h2>
        <nav className="space-y-2">
          <NavLink to="/dashboard/MyProfile" className={linkClass}>
            My Profile
          </NavLink>
          <NavLink to="/dashboard/AddPost" className={linkClass}>
            Add Post
          </NavLink>
          <NavLink to="/dashboard/MyPosts" className={linkClass}>
            My Posts
          </NavLink>
          <NavLink to="/dashboard/AdminProfile" className={linkClass}>
            Admin Profile
          </NavLink>
          <NavLink to="/dashboard/ManageUsers" className={linkClass}>
            Manage Users
          </NavLink>
          <NavLink to="/dashboard/ReportedComments" className={linkClass}>
           Reported Comments
          </NavLink>
           <NavLink to="/dashboard/MakeAnnouncement" className={linkClass}>
           Make Announcement
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="mb-4 inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition"
        >
          <FaArrowLeft className="mr-2" /> Back to Home
        </button>

        <h2 className="text-3xl font-semibold text-indigo-700 mb-4">Dashboard</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
