import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import useAxiosSecure from "../../../Hooks/AxiosSeure/useAxiosSecure";

const CommentPage = () => {
  const axiosSecure = useAxiosSecure();

  const [feedbackStates, setFeedbackStates] = useState({});
  const [reportedStates, setReportedStates] = useState({});
  const [expandedComments, setExpandedComments] = useState({});

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

  const handleFeedbackChange = (commentId, value) => {
    setFeedbackStates((prev) => ({
      ...prev,
      [commentId]: value,
    }));
  };

  const handleReport = (commentId) => {
    alert(`Reported comment ID: ${commentId}`);
    setReportedStates((prev) => ({
      ...prev,
      [commentId]: true,
    }));
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
              {[
                { label: "Email", align: "text-left" },
                { label: "Comment", align: "text-left" },
                { label: "Feedback", align: "text-center" },
                { label: "Report", align: "text-center" },
                { label: "Date", align: "text-center" },
              ].map(({ label, align }) => (
                <th
                  key={label}
                  scope="col"
                  className={`${align} text-indigo-700 font-semibold uppercase text-sm px-6 py-3 tracking-wider select-none`}
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
              const displayText = isExpanded || !isLong ? commentText : commentText.slice(0, 80) + "...";

              const feedback = feedbackStates[comment._id] || "";
              const isReported = reportedStates[comment._id] || false;

              return (
                <tr
                  key={comment._id}
                  className={`${
                    idx % 2 === 0 ? "bg-indigo-50" : "bg-white"
                  } hover:bg-indigo-100 transition-colors cursor-default`}
                  tabIndex={0}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium max-w-xs truncate">
                    {comment.authorEmail}
                  </td>

                  <td className="px-6 py-4 max-w-xl whitespace-normal text-gray-700 break-words">
                    <p className="inline">{displayText}</p>
                    {isLong && (
                      <button
                        onClick={() => toggleExpandComment(comment._id)}
                        className="ml-3 text-indigo-600 font-semibold hover:underline focus:outline-none"
                        aria-label={isExpanded ? "Show less" : "Read more"}
                      >
                        {isExpanded ? "Show Less" : "Read More"}
                      </button>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <select
                      className="border border-indigo-300 rounded-md px-3 py-1 w-full max-w-[180px] focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                      value={feedback}
                      onChange={(e) => handleFeedbackChange(comment._id, e.target.value)}
                      aria-label="Select feedback reason"
                    >
                      <option value="">Select Feedback</option>
                      <option value="Offensive Language">Offensive Language</option>
                      <option value="Spam/Advertisement">Spam/Advertisement</option>
                      <option value="Harassment or Bullying">Harassment or Bullying</option>
                    </select>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      className={`px-5 py-2 rounded-md font-semibold transition
                        ${
                          !feedback || isReported
                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                            : "bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-400"
                        }`}
                      disabled={!feedback || isReported}
                      onClick={() => handleReport(comment._id)}
                      aria-disabled={!feedback || isReported}
                      aria-label={isReported ? "Comment already reported" : "Report comment"}
                    >
                      {isReported ? "Reported" : "Report"}
                    </button>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-center text-indigo-600 text-sm font-mono">
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
