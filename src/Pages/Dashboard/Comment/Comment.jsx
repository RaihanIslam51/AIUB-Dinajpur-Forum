import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/AxiosSeure/useAxiosSecure";

const CommentPage = () => {
  const axiosSecure = useAxiosSecure();

  const [feedbackStates, setFeedbackStates] = useState({});
  const [reportedStates, setReportedStates] = useState({});
  const [expandedComments, setExpandedComments] = useState({});

  // Fetch comments
  const {
    data: comments = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["comments"],
    queryFn: async () => {
      const response = await axiosSecure.get("/comment");
      return response.data;
    },
  });

  // Fetch already reported comments by this user (to persist reported state after reload)
  useEffect(() => {
    const fetchReported = async () => {
      try {
        const res = await axiosSecure.get("/reported-comments");
        // Assuming backend returns array of reports with email and comment
        const reportedIds = {};
        res.data.forEach((report) => {
          // Find comment that matches email & comment text and mark reported
          const matchedComment = comments.find(
            (c) => c.authorEmail === report.email && c.comment === report.comment
          );
          if (matchedComment) {
            reportedIds[matchedComment._id] = true;
          }
        });
        setReportedStates(reportedIds);
      } catch (err) {
        console.error("Failed to fetch reported comments:", err);
      }
    };

    if (comments.length) fetchReported();
  }, [comments, axiosSecure]);

  const handleFeedbackChange = (commentId, value) => {
    setFeedbackStates((prev) => ({
      ...prev,
      [commentId]: value,
    }));
  };

  const handleReport = async (commentId) => {
    const selectedComment = comments.find((c) => c._id === commentId);
    const feedback = feedbackStates[commentId];

    if (!selectedComment || !feedback) return;

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to report this comment for "${feedback}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, report it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const reportData = {
          email: selectedComment.authorEmail,
          comment: selectedComment.comment,
          date: selectedComment.date,
          feedback,
        };

        await axiosSecure.post("/reported-comments", reportData);

        setReportedStates((prev) => ({
          ...prev,
          [commentId]: true,
        }));

        Swal.fire({
          icon: "success",
          title: "Reported!",
          text: "Thank you for your feedback.",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Error reporting comment:", error);

        Swal.fire({
          icon: "error",
          title: "Oops...",
          text:
            error.response?.data?.message ||
            "Failed to submit report. You may have already reported this comment.",
        });
      }
    }
  };

  const toggleExpandComment = (commentId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  if (isLoading) {
    return (
      <p className="pt-20 text-center text-indigo-600 text-lg font-semibold animate-pulse">
        Loading comments...
      </p>
    );
  }

  if (isError) {
    return (
      <p className="pt-20 text-center text-red-600 text-lg font-semibold">
        Error loading comments: {error.message}
      </p>
    );
  }

  return (
    <div className="pt-20 px-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-extrabold mb-6 border-b border-indigo-300 pb-3 text-gray-900 select-none">
        All Comments for Post ({comments.length})
      </h2>

      <div className="overflow-x-auto rounded-lg border border-indigo-200 shadow-md bg-white">
        <table className="min-w-full">
          <thead className="bg-indigo-50 border-b border-indigo-300">
            <tr>
              {["Email", "Comment", "Feedback", "Report", "Date"].map((label, i) => (
                <th
                  key={i}
                  className={`${
                    i < 2 ? "text-left" : "text-center"
                  } text-indigo-700 font-semibold uppercase text-sm px-6 py-3 tracking-wider select-none`}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {comments.map((comment, idx) => {
              const commentText = comment.comment || "";
              const isLong = commentText.length > 80;
              const isExpanded = expandedComments[comment._id] || false;
              const displayText =
                isExpanded || !isLong
                  ? commentText
                  : commentText.slice(0, 80) + "...";

              const feedback = feedbackStates[comment._id] || "";
              const isReported = reportedStates[comment._id] || false;

              return (
                <tr
                  key={comment._id}
                  className={`${
                    idx % 2 === 0 ? "bg-indigo-50" : "bg-white"
                  } hover:bg-indigo-100 transition-colors cursor-default`}
                >
                  <td className="px-6 py-4 text-gray-800 font-medium max-w-xs truncate">
                    {comment.authorEmail}
                  </td>

                  <td className="px-6 py-4 max-w-xl text-gray-700 break-words">
                    <p className="inline">{displayText}</p>
                    {isLong && (
                      <button
                        onClick={() => toggleExpandComment(comment._id)}
                        className="ml-3 text-indigo-600 font-semibold hover:underline"
                        aria-label={isExpanded ? "Show less" : "Read more"}
                      >
                        {isExpanded ? "Show Less" : "Read More"}
                      </button>
                    )}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <select
                      className="border border-indigo-300 rounded-md px-3 py-1 w-full max-w-[180px]"
                      value={feedback}
                      onChange={(e) =>
                        handleFeedbackChange(comment._id, e.target.value)
                      }
                      disabled={isReported}
                      aria-label="Select feedback reason"
                    >
                      <option value="">Select Feedback</option>
                      <option value="Offensive Language">
                        Offensive Language
                      </option>
                      <option value="Spam/Advertisement">
                        Spam/Advertisement
                      </option>
                      <option value="Harassment or Bullying">
                        Harassment or Bullying
                      </option>
                    </select>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <button
                      disabled={!feedback || isReported}
                      onClick={() => handleReport(comment._id)}
                      className={`px-5 py-2 rounded-md font-semibold transition ${
                        !feedback || isReported
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : "bg-red-600 text-white hover:bg-red-700"
                      }`}
                      aria-disabled={!feedback || isReported}
                      aria-label={isReported ? "Comment already reported" : "Report comment"}
                    >
                      {isReported ? "Reported" : "Report"}
                    </button>
                  </td>

                  <td className="px-6 py-4 text-center text-indigo-600 text-sm font-mono">
                    {new Date(comment.date).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CommentPage;
