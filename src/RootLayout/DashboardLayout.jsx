import { useEffect } from 'react';
import {
  FaArrowLeft,
  FaBullhorn,
  FaClipboardList,
  FaCommentAlt,
  FaPlusCircle,
  FaUserCircle,
  FaUsersCog,
} from 'react-icons/fa';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router';
import useUserRole from '../Hooks/useUserRole';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
    const { role, roleLoading } = useUserRole()
    console.log("role show", role);


  useEffect(() => {
    // jokhon path /dashboard or /dashboard/ thakbe tokhon redirect korbe /dashboard/MyProfile e
    if (location.pathname === '/dashboard' || location.pathname === '/dashboard/') {
      navigate('/dashboard/MyProfile', { replace: true });
    }
  }, [location.pathname, navigate]);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-md text-base font-semibold transition ${
      isActive
        ? 'bg-indigo-600 text-white shadow-lg'
        : 'text-gray-700 hover:bg-indigo-100 hover:text-indigo-700'
    }`;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-50 via-white to-indigo-50">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-lg p-6 flex flex-col">
        <h2 className="text-3xl font-extrabold text-indigo-600 mb-8 select-none">
          Dashboard
        </h2>
        <nav className="flex flex-col space-y-3 flex-1">
          <NavLink to="/dashboard/MyProfile" className={linkClass}>
            <FaUserCircle size={20} />
            My Profile
          </NavLink>

          <NavLink to="/dashboard/AddPost" className={linkClass}>
            <FaPlusCircle size={20} />
            Add Post
          </NavLink>

          <NavLink to="/dashboard/MyPosts" className={linkClass}>
            <FaClipboardList size={20} />
            My Posts
          </NavLink>
           {!roleLoading && role === 'admin' &&
         <>
          <NavLink to="/dashboard/AdminProfile" className={linkClass}>
            <FaUserCircle size={20} />
            Admin Profile
          </NavLink>

          <NavLink to="/dashboard/ManageUsers" className={linkClass}>
            <FaUsersCog size={20} />
            Manage Users
          </NavLink>

          <NavLink to="/dashboard/ReportedComments" className={linkClass}>
            <FaCommentAlt size={20} />
            Reported Comments
          </NavLink>

          <NavLink to="/dashboard/MakeAnnouncement" className={linkClass}>
            <FaBullhorn size={20} />
            Make Announcement
          </NavLink>
          </>
            }

        </nav>

        {/* Back to Home Button */}
        <button
          onClick={() => navigate('/')}
          className="mt-auto text-indigo-600 hover:text-indigo-900 font-semibold flex items-center gap-2"
        >
          <FaArrowLeft />
          Back to Home
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 bg-white rounded-tl-3xl shadow-lg">
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-6 select-none">
          Welcome to Your Dashboard
        </h1>

        <div className="bg-indigo-50 rounded-xl p-8 shadow-inner min-h-[70vh]">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
