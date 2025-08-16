import { formatDistanceToNow } from 'date-fns';
import { useContext, useEffect, useState } from "react";
import { FaCommentAlt, FaTrash, FaUserAlt } from "react-icons/fa";
import { MdDelete, MdWarning } from "react-icons/md";
import Swal from "sweetalert2";
import { AuthContext } from "../../../Authantication/Context/AuthContext";
import useAxiosSecure from "../../../Hooks/AxiosSeure/useAxiosSecure";

const ReportedComments = () => {
  const axiosSecure = useAxiosSecure();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const { darkMode } = useContext(AuthContext);

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
        confirmButtonColor: "#6366f1",
        background: darkMode ? '#1f2937' : '#ffffff',
        color: darkMode ? 'white' : '#1f2937',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [darkMode]);

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
      background: darkMode ? '#1f2937' : '#ffffff',
      color: darkMode ? 'white' : '#1f2937',
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
            background: darkMode ? '#1f2937' : '#ffffff',
            color: darkMode ? 'white' : '#1f2937',
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
          confirmButtonColor: "#6366f1",
          background: darkMode ? '#1f2937' : '#ffffff',
          color: darkMode ? 'white' : '#1f2937',
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
      reverseButtons: true,
      background: darkMode ? '#1f2937' : '#ffffff',
      color: darkMode ? 'white' : '#1f2937',
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
            background: darkMode ? '#1f2937' : '#ffffff',
            color: darkMode ? 'white' : '#1f2937',
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
          confirmButtonColor: "#6366f1",
          background: darkMode ? '#1f2937' : '#ffffff',
          color: darkMode ? 'white' : '#1f2937',
        });
      }
    }
  };

  const filteredReports = selectedFilter === 'all' 
    ? reports 
    : reports.filter(report => report.feedback.toLowerCase().includes(selectedFilter));

  if (loading) {
    return (
      <div className={`flex justify-center items-center min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="flex flex-col items-center">
          <div className={`animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 ${darkMode ? 'border-indigo-400' : 'border-indigo-600'} mb-4`}></div>
          <p className={`${darkMode ? 'text-indigo-400' : 'text-indigo-600'} font-medium`}>Loading reported comments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex justify-center items-center min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`p-8 rounded-xl shadow-lg text-center max-w-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Error Loading Reports</h2>
          <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{error}</p>
          <button 
            onClick={fetchReports}
            className={`px-6 py-2 text-white rounded-lg hover:shadow-lg transition ${darkMode ? 'bg-indigo-700 hover:bg-indigo-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className={`text-3xl font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              <MdWarning className="text-yellow-500" /> Reported Comments
            </h1>
            <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {reports.length} {reports.length === 1 ? 'report' : 'reports'} found
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={fetchReports}
              className={`p-2 rounded-lg shadow border ${darkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
              aria-label="Refresh"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} 
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
              className={`px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-gray-900'}`}
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
          <div className={`rounded-xl shadow-md p-8 text-center ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
            <div className={`text-5xl mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-300'}`}>
              <FaCommentAlt className="inline-block" />
            </div>
            <h3 className={`text-xl font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              No reported comments found
            </h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
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
                className={`rounded-xl shadow-md overflow-hidden border-l-4 border-yellow-500 hover:shadow-lg transition ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
              >
                <div className="p-6">
                  {/* Report Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${darkMode ? 'bg-blue-900/50' : 'bg-blue-100'}`}>
                        <FaUserAlt className={`${darkMode ? 'text-blue-300' : 'text-blue-600'}`} />
                      </div>
                      <div>
                        <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{report.email}</h3>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Reported {formatDistanceToNow(new Date(report.reportedAt))} ago
                        </p>
                      </div>
                    </div>
                    
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      report.feedback.toLowerCase().includes('spam') 
                        ? darkMode ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-800' :
                      report.feedback.toLowerCase().includes('abuse') 
                        ? darkMode ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-800' :
                      report.feedback.toLowerCase().includes('hate') 
                        ? darkMode ? 'bg-orange-900/50 text-orange-300' : 'bg-orange-100 text-orange-800' :
                        darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {report.feedback}
                    </span>
                  </div>
                  
                  {/* Comment Content */}
                  <div className={`p-4 rounded-lg mb-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full flex-shrink-0 ${darkMode ? 'bg-indigo-900/50' : 'bg-indigo-100'}`}>
                        <FaCommentAlt className={`${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`} />
                      </div>
                      <div>
                        <p className={darkMode ? 'text-gray-200' : 'text-gray-800'}>{report.comment}</p>
                        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Posted {formatDistanceToNow(new Date(report.date))} ago
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleDeleteComment(report.commentId)}
                      className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg transition ${darkMode ? 'bg-red-700 hover:bg-red-600' : 'bg-red-600 hover:bg-red-700'}`}
                    >
                      <FaTrash /> Delete Comment
                    </button>
                    <button
                      onClick={() => handleDelete(report._id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
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