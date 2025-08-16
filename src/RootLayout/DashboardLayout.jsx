import { useEffect } from 'react';
import {
  FaArrowLeft,
  FaBullhorn,
  FaChartLine,
  FaClipboardList,
  FaCommentAlt,
  FaHome,
  FaPlusCircle,
  FaUserCircle,
  FaUsersCog
} from 'react-icons/fa';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router';
import useUserRole from '../Hooks/useUserRole';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role, roleLoading } = useUserRole();

  useEffect(() => {
    if (location.pathname === '/dashboard' || location.pathname === '/dashboard/') {
      navigate('/dashboard/MyProfile', { replace: true });
    }
  }, [location.pathname, navigate]);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-6 py-3 rounded-lg text-base font-medium transition-all ${
      isActive
        ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600 font-semibold'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`;

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-sm border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-medium transition-colors"
          >
            <FaArrowLeft className="text-lg" />
            <span>Back to Home</span>
          </button>
        </div>

        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <span className="bg-indigo-100 p-3 rounded-lg text-indigo-600">
              <FaChartLine className="text-lg" />
            </span>
            Dashboard
          </h2>
        </div>
        
        <nav className="flex flex-col gap-1 p-6 flex-1">
          <NavLink to="/dashboard/MyProfile" className={linkClass}>
            <FaUserCircle className="text-indigo-500" size={18} />
            My Profile
          </NavLink>

          <NavLink to="/dashboard/AddPost" className={linkClass}>
            <FaPlusCircle className="text-indigo-500" size={18} />
            Add Post
          </NavLink>

          <NavLink to="/dashboard/MyPosts" className={linkClass}>
            <FaClipboardList className="text-indigo-500" size={18} />
            My Posts
          </NavLink>

          {!roleLoading && role === 'admin' && (
            <>
              <div className="pt-4 mt-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 mb-2">
                  Admin Panel
                </p>
                <NavLink to="/dashboard/AdminProfile" className={linkClass}>
                  <FaUserCircle className="text-purple-500" size={18} />
                  Admin Profile
                </NavLink>

                <NavLink to="/dashboard/ManageUsers" className={linkClass}>
                  <FaUsersCog className="text-purple-500" size={18} />
                  Manage Users
                </NavLink>

                <NavLink to="/dashboard/ReportedComments" className={linkClass}>
                  <FaCommentAlt className="text-purple-500" size={18} />
                  Reported Comments
                </NavLink>

                <NavLink to="/dashboard/MakeAnnouncement" className={linkClass}>
                  <FaBullhorn className="text-purple-500" size={18} />
                  Make Announcement
                </NavLink>
              </div>
            </>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-gray-50">
        <div className="p-8">
          {/* Header with Breadcrumbs */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {location.pathname.split('/').pop()?.replace(/([A-Z])/g, ' $1').trim() || 'Dashboard'}
              </h1>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <FaHome className="mr-2" />
                <span>Home</span>
                <span className="mx-2">/</span>
                <span className="text-indigo-600">Dashboard</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="bg-white p-2 rounded-full shadow-sm border border-gray-200">
                <FaUserCircle className="text-indigo-600" size={20} />
              </div>
            </div>
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Optional Card Header */}
            <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-800">
                {location.pathname.includes('MyProfile') && 'Profile Overview'}
                {location.pathname.includes('AddPost') && 'Create New Post'}
                {location.pathname.includes('MyPosts') && 'Your Posts'}
                {location.pathname.includes('AdminProfile') && 'Admin Dashboard'}
                {location.pathname.includes('ManageUsers') && 'User Management'}
                {location.pathname.includes('ReportedComments') && 'Reported Content'}
                {location.pathname.includes('MakeAnnouncement') && 'Create Announcement'}
              </h2>
            </div>
            
            {/* Main Content Area */}
            <div className="p-6">
              <Outlet />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;