import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from "react";
import { FaCommentAlt, FaTrash, FaUserAlt } from "react-icons/fa";
import { MdDelete, MdWarning } from "react-icons/md";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/AxiosSeure/useAxiosSecure";

const ReportedComments = () => {
  const axiosSecure = useAxiosSecure();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/allreport");
      setReports(res.data);
    } catch (err) {
      setError(err.message || "Failed to fetch reports");
      Swal.fire({
        title: "Error",
        text: "Failed to load reported comments",
        icon: "error",
        confirmButtonColor: "#6366f1"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete Report?",
      text: "This will permanently remove the reported comment",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6366f1",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      backdrop: `
        rgba(79, 70, 229, 0.1)
        left top
        no-repeat
      `,
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/report/${id}`);
        if (res.data.deletedCount > 0) {
          Swal.fire({
            title: "Deleted!",
            text: "Report has been removed",
            icon: "success",
            confirmButtonColor: "#6366f1",
            timer: 1500,
            showConfirmButton: false
          });
          fetchReports();
        }
      } catch (err) {
        Swal.fire({
          title: "Error",
          text: err.message || "Delete request failed",
          icon: "error",
          confirmButtonColor: "#6366f1"
        });
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    const confirm = await Swal.fire({
      title: "Delete Comment?",
      text: "This will remove the original comment from the system",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6366f1",
      confirmButtonText: "Delete Comment",
      cancelButtonText: "Cancel",
      reverseButtons: true
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/comments/${commentId}`);
        if (res.data.deletedCount > 0) {
          Swal.fire({
            title: "Deleted!",
            text: "Comment removed from system",
            icon: "success",
            confirmButtonColor: "#6366f1",
            timer: 1500,
            showConfirmButton: false
          });
          fetchReports();
        }
      } catch (err) {
        Swal.fire({
          title: "Error",
          text: err.message || "Failed to delete comment",
          icon: "error",
          confirmButtonColor: "#6366f1"
        });
      }
    }
  };

  const filteredReports = selectedFilter === 'all' 
    ? reports 
    : reports.filter(report => report.feedback.toLowerCase().includes(selectedFilter));

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
          <p className="text-indigo-600 font-medium">Loading reported comments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Reports</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={fetchReports}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <MdWarning className="text-yellow-500" /> Reported Comments
            </h1>
            <p className="text-gray-600 mt-2">
              {reports.length} {reports.length === 1 ? 'report' : 'reports'} found
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={fetchReports}
              className="p-2 bg-white rounded-lg shadow border border-gray-200 hover:bg-gray-50"
              aria-label="Refresh"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 text-gray-600" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                />
              </svg>
            </button>
            
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Reports</option>
              <option value="spam">Spam</option>
              <option value="abuse">Abuse</option>
              <option value="hate">Hate Speech</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Reports List */}
        {filteredReports.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="text-gray-400 text-5xl mb-4">
              <FaCommentAlt className="inline-block" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No reported comments found
            </h3>
            <p className="text-gray-500">
              {selectedFilter === 'all' 
                ? "There are currently no reported comments to review" 
                : `No reports match the "${selectedFilter}" filter`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div 
                key={report._id} 
                className="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-yellow-500 hover:shadow-lg transition"
              >
                <div className="p-6">
                  {/* Report Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <FaUserAlt className="text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{report.email}</h3>
                        <p className="text-sm text-gray-500">
                          Reported {formatDistanceToNow(new Date(report.reportedAt))} ago
                        </p>
                      </div>
                    </div>
                    
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      report.feedback.toLowerCase().includes('spam') ? 'bg-purple-100 text-purple-800' :
                      report.feedback.toLowerCase().includes('abuse') ? 'bg-red-100 text-red-800' :
                      report.feedback.toLowerCase().includes('hate') ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {report.feedback}
                    </span>
                  </div>
                  
                  {/* Comment Content */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-indigo-100 p-2 rounded-full flex-shrink-0">
                        <FaCommentAlt className="text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-gray-800">{report.comment}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Posted {formatDistanceToNow(new Date(report.date))} ago
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleDeleteComment(report.commentId)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                    >
                      <FaTrash /> Delete Comment
                    </button>
                    <button
                      onClick={() => handleDelete(report._id)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition"
                    >
                      <MdDelete /> Dismiss Report
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportedComments;