import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  FaComments,
  FaEnvelope,
  FaFireAlt,
  FaHashtag,
  FaShareAlt,
  FaThumbsDown,
  FaThumbsUp,
  FaUser,
} from "react-icons/fa";
import { useParams } from "react-router";

import useAuth from "../../Hooks/AxiosSeure/useAuth";
import useAxiosSesure from "../../Hooks/AxiosSeure/useAxiosSecure";

const DetailsPost = () => {
  console.log("Inside the details post")
  const { id } = useParams();
  const axiosSecure = useAxiosSesure();
  const { UserData } = useAuth();
  const queryClient = useQueryClient();

  const [newComment, setNewComment] = useState("");
  const [upvoteEmails, setUpvoteEmails] = useState([]);
  const [downvoteEmails, setDownvoteEmails] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Fetch the post data
  const {
    data: post,
    isLoading,
    isError,
    error,
    refetch: refetchPost,
  } = useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await axiosSecure.get(`/allpost/${id}`);
      return res.data[0];
    },
    enabled: !!id,
  });

  // Fetch comments separately from the comments API
  const {
    data: comments = [],
    isLoading: commentsLoading,
    refetch: refetchComments,
  } = useQuery({
    queryKey: ["comments", id],
    queryFn: async () => {
      if (!id) return [];
      const res = await axiosSecure.get(`/post/comments/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (post) {
      setUpvoteEmails(post.upVote || []);
      setDownvoteEmails(post.downVote || []);
    }
  }, [post]);

  const voteScore = upvoteEmails.length - downvoteEmails.length;
  const shareUrl = `${window.location.origin}/postDetails/${post?._id}`;

  const handleVote = async (type) => {
    if (!UserData) {
      alert("Please log in to vote.");
      return;
    }

    const email = UserData.email;

    try {
      const res = await axiosSecure.patch(`/post/vote/${id}`, {
        email,
        type,
      });

      const updatedPost = res.data;
      setUpvoteEmails(updatedPost.upVote || []);
      setDownvoteEmails(updatedPost.downVote || []);
    } catch (error) {
      console.error("Failed to update vote:", error);
      alert("Failed to update vote, please try again.");
    }
  };

  const handleCommentSubmit = async () => {
    if (!UserData) {
      alert("Please log in to comment.");
      return;
    }
    if (!newComment.trim()) {
      alert("Comment cannot be empty.");
      return;
    }

    setSubmitting(true);
    try {
      await axiosSecure.post(`/post/comment/${id}`, {
        authorName: UserData.displayName || "Anonymous",
        authorEmail: UserData.email,
        comment: newComment.trim(),
      });

      setNewComment("");
      // Refresh comments only (no need to refetch post)
      await refetchComments();

      toast.success("Comment added");
    } catch (error) {
      console.error("Failed to submit comment:", error);
      toast.error("Failed to submit comment, please try again.");
    }
    setSubmitting(false);
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="text-blue-600 text-5xl"
        >
          <FaFireAlt />
        </motion.div>
      </div>
    );

  if (isError)
    return (
      <div className="text-center text-red-600 py-20 font-medium">
        {error?.message || "Failed to load post."}
      </div>
    );

  if (!post)
    return (
      <div className="text-center py-20 text-gray-600 font-medium">Post not found.</div>
    );

  return (
    <>
      <Toaster position="top-right" />
      <main className="pt-20 px-4 max-w-5xl mx-auto">
        <article className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Redesigned Post Image + Author Info Section */}
          <section className="relative rounded-t-3xl overflow-hidden">
            {/* Blurred background */}
            <motion.img
              src={post.authorImage}
              alt={post.authorName}
              className="absolute inset-0 w-full h-full object-cover filter blur-3xl brightness-75 scale-110"
              aria-hidden="true"
            />
            
            {/* Overlay to darken for contrast */}
            <div className="absolute inset-0 bg-black/30" />

            {/* Author avatar and info container */}
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 sm:gap-10 p-8">
              {/* Circular avatar with ring and shadow */}
              <motion.img
                src={post.authorImage}
                alt={post.authorName}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1 }}
                loading="lazy"
              />
              
              {/* Author details */}
              <div className="text-white max-w-xl">
                <h1 className="text-4xl font-extrabold drop-shadow-md">{post.title}</h1>
                <p className="mt-2 text-lg drop-shadow-md flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <span className="flex items-center gap-2">
                    <FaUser /> <span>{post.authorName}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <FaEnvelope /> <span>{post.authorEmail}</span>
                  </span>
                </p>
                <time
                  dateTime={post.date}
                  className="block mt-2 text-sm italic drop-shadow-md"
                  title={new Date(post.date).toLocaleString()}
                >
                  {new Date(post.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </time>
              </div>
            </div>
          </section>

          <section className="p-8">
            {/* Post Description */}
            <section className="text-gray-700 leading-relaxed mb-8 whitespace-pre-wrap">
              {post.description}
            </section>

            {/* Tags and Vote Score */}
            <section className="flex flex-wrap items-center gap-4 mb-8">
              <Tag label={post.tag} icon={<FaHashtag />} />
              <div className="flex items-center gap-1 text-orange-500 font-semibold">
                <FaFireAlt /> <span>{voteScore} Votes</span>
              </div>
            </section>

            {/* Vote and Share Buttons */}
            <VoteButtons
              upVote={upvoteEmails.length}
              downVote={downvoteEmails.length}
              canVote={!!UserData}
              shareUrl={shareUrl}
              title={post.title}
              canShare={!!UserData}
              onVote={handleVote}
            />

            {/* Comments Section */}
            <CommentsSection
              comments={comments}
              commentsLoading={commentsLoading}
              newComment={newComment}
              setNewComment={setNewComment}
              onSubmit={handleCommentSubmit}
              submitting={submitting}
              canComment={!!UserData}
            />
          </section>
        </article>
      </main>
    </>
  );
};

const Tag = ({ label, icon }) => (
  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-2 select-none font-semibold text-sm">
    {icon} {label}
  </span>
);

const VoteButtons = ({
  upVote,
  downVote,
  canVote,
  shareUrl,
  title,
  canShare,
  onVote,
}) => {
  // Custom share handler
  const handleShare = async () => {
    if (!canShare) {
      toast.error("Please login to share.");
      return;
    }

    if (navigator.share) {
      // Use native share if available (mobile mostly)
      try {
        await navigator.share({
          title,
          url: shareUrl,
        });
        toast.success("Shared successfully!");
      } catch (error) {
        toast.error("Share cancelled or failed.");
      }
    } else if (navigator.clipboard) {
      // Fallback: copy link to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard!");
      } catch {
        toast.error("Failed to copy link.");
      }
    } else {
      toast.error("Sharing not supported in this browser.");
    }
  };

  return (
    <section
      className="flex pt-5 flex-wrap gap-4 justify-between items-center mb-10"
      aria-label="Vote and Share actions"
    >
      <div className="flex gap-4">
        <motion.button
          onClick={() => onVote("up")}
          disabled={!canVote}
          aria-label="Upvote post"
          whileTap={{ scale: 0.9 }}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl border border-green-500 text-green-600 font-semibold transition-colors ${
            canVote ? "hover:bg-green-50" : "opacity-50 cursor-not-allowed"
          }`}
        >
          <FaThumbsUp size={20} /> Upvote ({upVote})
        </motion.button>

        <motion.button
          onClick={() => onVote("down")}
          disabled={!canVote}
          aria-label="Downvote post"
          whileTap={{ scale: 0.9 }}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl border border-red-500 text-red-600 font-semibold transition-colors ${
            canVote ? "hover:bg-red-50" : "opacity-50 cursor-not-allowed"
          }`}
        >
          <FaThumbsDown size={20} /> Downvote ({downVote})
        </motion.button>
      </div>

      <motion.button
        onClick={handleShare}
        disabled={!canShare}
        aria-label="Share post"
        whileTap={{ scale: 0.9 }}
        className={`flex items-center gap-2 px-5 py-3 rounded-xl border border-blue-500 text-blue-600 font-semibold transition-colors ${
          canShare ? "hover:bg-blue-50 cursor-pointer" : "opacity-50 cursor-not-allowed"
        }`}
        title={canShare ? "Share this post" : "Login to share"}
      >
        <FaShareAlt size={20} /> Share
      </motion.button>
    </section>
  );
};

const CommentsSection = ({
  comments,
  commentsLoading,
  newComment,
  setNewComment,
  onSubmit,
  submitting,
  canComment,
}) => (
  <section aria-label="Comments section">
    <h2 className="flex items-center gap-3 mb-6 border-b border-gray-300 pb-2 text-3xl font-extrabold text-gray-900 select-none">
      <FaComments className="text-blue-600 text-4xl drop-shadow-sm" />
      <span>Comments</span>
      <span className="ml-2 inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1.5 shadow-md select-text">
        {comments.length}
      </span>
    </h2>

    {canComment ? (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="mb-8"
      >
        <textarea
          className="w-full p-4 border border-gray-300 rounded-xl resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          rows={5}
          placeholder="Write your comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          required
          disabled={submitting}
          aria-label="Write a comment"
        />
        <button
          type="submit"
          disabled={submitting}
          className="mt-4 px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {submitting ? "Submitting..." : "Submit Comment"}
        </button>
      </form>
    ) : (
      <p className="text-gray-500 italic mb-8">Please log in to comment.</p>
    )}

    {commentsLoading ? (
      <p className="text-gray-500 italic">Loading comments...</p>
    ) : comments.length === 0 ? (
      <p className="text-gray-500 italic">No comments yet.</p>
    ) : (
      <ul className="space-y-6 max-h-[380px] overflow-y-auto pr-2">
        {comments.map((comment, i) => (
          <motion.li
            key={comment._id || i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-gray-50 p-5 rounded-2xl shadow-sm border border-gray-200"
            aria-label={`Comment by ${comment.authorName}`}
          >
            <div className="flex justify-between items-center mb-3">
              <p className="font-semibold text-gray-800">{comment.authorName}</p>
              <time
                dateTime={comment.date}
                className="text-xs text-gray-400"
                title={new Date(comment.date).toLocaleString()}
              >
                {new Date(comment.date).toLocaleString()}
              </time>
            </div>
            <p className="whitespace-pre-wrap text-gray-700">{comment.comment}</p>
          </motion.li>
        ))}
      </ul>
    )}
  </section>
);

export default DetailsPost;
