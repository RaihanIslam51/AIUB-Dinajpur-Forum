import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FaBell } from "react-icons/fa";
import useAxiosSesure from "../../Hooks/AxiosSeure/useAxiosSecure";

const Notification = () => {
  const axiosSecure = useAxiosSesure();

  const {
    data: admins,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["adminsNotifications"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users/admins");
      return res.data;
    },
  });

  console.log("notification",admins);
  

  if (isLoading)
    return (
      <div className="pt-24 max-w-2xl mx-auto px-4 space-y-3 animate-pulse">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="bg-gray-100 rounded-lg p-4 flex space-x-4 items-center shadow-sm"
          >
            <div className="w-12 h-12 bg-gray-300 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );

  if (error)
    return (
      <div className="pt-24 text-center text-red-500 text-lg font-medium">
        ⚠️ Failed to load notifications.
      </div>
    );

  return (
    <div className="pt-24 px-4 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <FaBell className="text-2xl text-indigo-500" />
          <h2 className="text-2xl font-semibold text-gray-800">Notifications</h2>
        </div>

        {/* Notification List */}
        <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-2">
          {admins?.length === 0 ? (
            <div className="bg-gray-50 text-gray-500 p-6 text-center rounded-lg shadow-inner text-base">
              💤 No notifications at the moment.
            </div>
          ) : (
            admins.map((admin, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-indigo-50 p-4 rounded-lg shadow hover:shadow-md transition duration-200 border border-indigo-100 flex gap-4 items-start"
              >
                <img
                  src={admin.photo || "/default-avatar.png"}
                  alt={admin.name}
                  className="w-12 h-12 rounded-full object-cover border border-indigo-300"
                  onError={(e) => {
                    e.currentTarget.src = "/default-avatar.png";
                  }}
                />
                <div className="flex-1">
                  <h4 className="text-md font-semibold text-gray-800">
                    {admin.name}
                  </h4>
                  <p className="text-sm text-gray-600">{admin.email}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Role: <span className="font-medium">{admin.role}</span>
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Notification;
