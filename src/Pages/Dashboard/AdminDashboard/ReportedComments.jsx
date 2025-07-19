import { useEffect, useState } from "react";
import { FaClock, FaCommentAlt, FaUserAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/AxiosSeure/useAxiosSecure";

const ReportedComments = () => {
  const axiosSecure = useAxiosSecure();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/allreport");
      setReports(res.data);
    } catch (err) {
      setError(err.message || "Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this deletion!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/report/${id}`);
        if (res.data.deletedCount > 0) {
          Swal.fire("Deleted!", "The report has been deleted.", "success");
          fetchReports(); // Refresh list
        } else {
          Swal.fire("Failed!", "Could not delete the report.", "error");
        }
      } catch (err) {
        Swal.fire("Error!", err.message || "Delete request failed", "error");
      }
    }
  };

  if (loading)
    return <div className="pt-20 text-center text-lg font-semibold">Loading...</div>;

  if (error)
    return <div className="pt-20 text-center text-red-500 font-semibold">Error: {error}</div>;

  return (
    <div className="pt-20 px-4 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        🚨 Reported Comments
      </h2>

      {reports.length === 0 ? (
        <div className="text-center text-gray-500">No reported comments found.</div>
      ) : (
        <div className="grid gap-6">
          {reports.map((report) => (
            <div
              key={report._id}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex flex-col gap-2 sm:gap-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <FaUserAlt className="text-blue-500" />
                  <span className="font-medium">User:</span>
                  <span className="text-gray-800">{report.email}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-700">
                  <FaCommentAlt className="text-green-500" />
                  <span className="font-medium">Content:</span>
                  <span className="text-gray-800">{report.comment}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-700">
                  <span className="font-medium">Feedback Reason:</span>
                  <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-sm">
                    {report.feedback}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-700 text-sm">
                  <FaClock className="text-purple-500" />
                  <span className="font-medium">Comment Date:</span>
                  <span>{new Date(report.date).toLocaleString()}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-700 text-sm">
                  <FaClock className="text-red-500" />
                  <span className="font-medium">Reported At:</span>
                  <span>{new Date(report.reportedAt).toLocaleString()}</span>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleDelete(report._id)}
                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition"
                  >
                    <MdDelete className="text-lg" />
                    Delete Report
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportedComments;
