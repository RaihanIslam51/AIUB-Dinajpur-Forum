import { useEffect, useState } from "react";
import useAxiosSecure from "../../../Hooks/AxiosSeure/useAxiosSecure";

const AdminProfile = () => {
  const axiosSecure = useAxiosSecure();
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdmin = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosSecure.get("/users/admins");
        // Assume you want the first admin user
        setAdminData(response.data[0] || null);
      } catch (err) {
        console.error("Failed to fetch admin data:", err);
        setError("Failed to load admin profile");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48 text-gray-500">
        Loading admin profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 mt-6 font-semibold">
        {error}
      </div>
    );
  }

  if (!adminData) {
    return (
      <div className="text-center mt-6 text-gray-600">
        No admin profile found.
      </div>
    );
  }

  const {
    name = "Admin User",
    email = "N/A",
    role = "admin",
    payment_status = "Bronze Badge",
    profileImage = "https://i.ibb.co/2Fc7Wp8/avatar.png",
  } = adminData;

  const subscriptionText = payment_status === "Gold Badge" ? "Paid" : "Unpaid";

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6 mt-10">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <img
          src={profileImage}
          alt="Admin Profile"
          className="w-28 h-28 rounded-full object-cover border-4 border-blue-600"
        />
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-bold text-gray-900">{name}</h2>
          <p className="text-gray-600 mt-1">{email}</p>
          <p className="mt-2 inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full font-semibold">
            Role: {role}
          </p>
        </div>
      </div>

      <div className="mt-6 border-t pt-4 text-gray-700 space-y-2">
        <p>
          <span className="font-semibold">Subscription Status:</span>{" "}
          {subscriptionText} ({payment_status})
        </p>
        <p>
          <span className="font-semibold">Joined Date:</span> {adminData.created_at}
        </p>
      </div>
    </div>
  );
};

export default AdminProfile;
