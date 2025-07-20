import 
{ Navigate } from 'react-router';
import useAuth from '../Hooks/AxiosSeure/useAuth';
import useUserRole from '../Hooks/useUserRole';

const AdminRoute = ({ children }) => {
    const { UserData, loading } = useAuth()
    const { role, roleLoading } = useUserRole()

    if (loading || roleLoading) {
        return <span className="loading loading-spinner loading-xl"></span>
    }

    if (!UserData || role !== 'admin') {
        return <Navigate state={{ from: location.pathname }} to="/forbidden"></Navigate>
    }

    return children;
};

export default AdminRoute;