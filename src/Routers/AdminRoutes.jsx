import { Navigate, useLocation } from 'react-router';
import useAuth from '../Hooks/AxiosSeure/useAuth';
import useUserRole from '../Hooks/useUserRole';
import WebsiteLoading from '../Loader/WebsiteLoading';

const AdminRoute = ({ children }) => {
  const location = useLocation();
  const { UserData, Loading } = useAuth();
  const { role, roleLoading } = useUserRole();

  // Show loader while auth or role is loading
  if (Loading || roleLoading) {
    return <WebsiteLoading />;
  }

  // Check for admin role
  if (!UserData || role !== 'admin') {
    return <Navigate to="/forbidden" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminRoute;
