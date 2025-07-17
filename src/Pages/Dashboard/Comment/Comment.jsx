import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosSesure from "../../../Hooks/AxiosSeure/useAxiosSecure";


const feedbackOptions = [
  "Spam or misleading",
  "Offensive language",
  "Not relevant",
];

const Comment= () => {
  const { postId } = useParams();
  const axiosSecure = useAxiosSesure()

  const [selectedFeedbacks, setSelectedFeedbacks] = useState({});
  const [reportedComments, setReportedComments] = useState({});
  const [modalContent, setModalContent] = useState(null);

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/comments/${postId}`);
      return res.data;
    },
  });

  const handleFeedbackChange = (commentId, feedback) => {
    setSelectedFeedbacks((prev) => ({ ...prev, [commentId]: feedback }));
  };

  const handleReport = async (commentId) => {
    try {
      await axiosSecure.patch(`/comments/report/${commentId}`, {
        feedback: selectedFeedbacks[commentId],
      });

      setReportedComments((prev) => ({ ...prev, [commentId]: true }));
      Swal.fire("Reported!", "Comment has been reported.", "success");
    } catch (err) {
      Swal.fire("Error!", "Failed to report comment.", "error");
    }
  };

  const handleReadMore = (fullComment) => {
    setModalContent(fullComment);
  };

  const closeModal = () => setModalContent(null);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Comments</h2>

      {isLoading ? (
        <p>Loading...</p>
      ) : comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full table-zebra">
            <thead className="bg-base-200">
              <tr>
                <th>#</th>
                <th>Email</th>
                <th>Comment</th>
                <th>Feedback</th>
                <th>Report</th>
              </tr>
            </thead>
            <tbody>
              {comments.map((comment, idx) => (
                <tr key={comment._id}>
                  <td>{idx + 1}</td>
                  <td>{comment.email}</td>
                  <td>
                    {comment.text.length > 20 ? (
                      <>
                        {comment.text.slice(0, 20)}...
                        <button
                          onClick={() => handleReadMore(comment.text)}
                          className="text-blue-600 ml-1 underline"
                        >
                          Read More
                        </button>
                      </>
                    ) : (
                      comment.text
                    )}
                  </td>
                  <td>
                    <select
                      className="select select-bordered select-sm"
                      value={selectedFeedbacks[comment._id] || ""}
                      onChange={(e) =>
                        handleFeedbackChange(comment._id, e.target.value)
                      }
                    >
                      <option value="" disabled>
                        Select feedback
                      </option>
                      {feedbackOptions.map((opt, i) => (
                        <option key={i} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button
                      className="btn btn-error btn-sm text-white"
                      disabled={
                        !selectedFeedbacks[comment._id] ||
                        reportedComments[comment._id]
                      }
                      onClick={() => handleReport(comment._id)}
                    >
                      {reportedComments[comment._id] ? "Reported" : "Report"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalContent && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full relative">
            <h3 className="text-lg font-semibold mb-2">Full Comment</h3>
            <p>{modalContent}</p>
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-xl font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comment;
