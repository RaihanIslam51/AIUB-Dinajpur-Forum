import { useQuery } from '@tanstack/react-query';

import useAxiosSecure from './AxiosSeure/useAxiosSecure';

import useAuth from './AxiosSeure/useAuth';

const useUserRole = () => {
    const { UserData, loading: authLoading } = useAuth()
    const axiosSecure = useAxiosSecure()

    const {
        data: role = 'user',
        isLoading: roleLoading,
        refetch,
    } = useQuery({
        queryKey: ['userRole', UserData?.email],
        enabled: !authLoading && !!UserData?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/userss/${UserData.email}/role`);
            return res.data.role;
        },
    });

    return { role, roleLoading: authLoading || roleLoading, refetch };
};

export default useUserRole;