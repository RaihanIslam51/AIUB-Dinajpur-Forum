import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/AxiosSeure/useAxiosSecure";



const ReportedComments = () => {
  const axiosSecure = useAxiosSecure()
  const queryClient = useQueryClient();

  // Fetch reported comments
  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["reportedComments"],
    queryFn: async () => {
      const res = await axiosSecure.get("/reports");
      return res.data;
    },
  });

  // Admin Actions
  const deleteMutation = useMutation({
    mutationFn: async (commentId) => {
      return await axiosSecure.delete(`/comments/${commentId}`);
    },
    onSuccess: () => {
      Swal.fire("Deleted!", "The comment has been deleted.", "success");
      queryClient.invalidateQueries(["reportedComments"]);
    },
  });

  const resolveMutation = useMutation({
    mutationFn: async (reportId) => {
      return await axiosSecure.patch(`/reports/resolve/${reportId}`);
    },
    onSuccess: () => {
      Swal.fire("Resolved!", "The report has been marked as resolved.", "success");
      queryClient.invalidateQueries(["reportedComments"]);
    },
  });

  const handleDelete = (commentId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the comment.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(commentId);
      }
    });
  };

  const handleResolve = (reportId) => {
    resolveMutation.mutate(reportId);
  };

  if (isLoading) return <div className="text-center pt-20">Loading...</div>;

  return (
    <div className="pt-20 px-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6">Reported Comments & Activities</h2>

      {reports.length === 0 ? (
        <p className="text-gray-500 text-center">No reports available.</p>
      ) : (
        <div className="grid gap-6">
          {reports.map((report) => (
            <div
              key={report._id}
              className="bg-white shadow-md rounded-xl p-5 border border-gray-200"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-lg font-semibold text-gray-800">{report.title}</p>
                  <p className="text-sm text-gray-600 mb-2">Reported by: {report.reportedBy}</p>
                  <p className="text-gray-700 mb-2">{report.description}</p>
                  <p className="text-sm text-gray-500">Date: {new Date(report.date).toLocaleString()}</p>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleDelete(report.commentId)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded text-sm"
                  >
                    Delete Comment
                  </button>
                  <button
                    onClick={() => handleResolve(report._id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded text-sm"
                  >
                    Mark Resolved
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
