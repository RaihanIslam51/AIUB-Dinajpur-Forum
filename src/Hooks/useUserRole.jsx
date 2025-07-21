import { useEffect, useState } from 'react';
import useAuth from './AxiosSeure/useAuth';
import useAxiosSecure from './AxiosSeure/useAxiosSecure';

const useUserRole = () => {
  const { UserData, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [role, setRole] = useState('user');
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (UserData?.email) {
        try {
          setRoleLoading(true);
          const res = await axiosSecure.get(`/users/${UserData.email}/role`);
          setRole(res.data.role || 'user');
        } catch (error) {
          console.error('Failed to fetch user role:', error);
          setRole('user');
        } finally {
          setRoleLoading(false);
        }
      }
    };

    if (!authLoading && UserData?.email) {
      fetchRole();
    }
  }, [UserData, authLoading, axiosSecure]);

  return { role, roleLoading };
};

export default useUserRole;
