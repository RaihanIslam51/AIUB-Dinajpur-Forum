import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
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
import { FacebookShareButton } from "react-share";

import useAuth from "../../Hooks/AxiosSeure/useAuth";
import useAxiosSesure from "../../Hooks/AxiosSeure/useAxiosSecure";

const DetailsPost = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSesure();
  const { UserData } = useAuth();
  const queryClient = useQueryClient();

  const [newComment, setNewComment] = useState("");

  // Fetch post data
  const { data: post, isLoading, isError, error } = useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await axiosSecure.get(`/allpost/${id}`);
      return res.data[0];
    },
    enabled: !!id,
  });

  // Vote mutation
  const voteMutation = useMutation({
    mutationFn: async (type) => {
      if (!post) throw new Error("Post not loaded");
      const res = await axiosSecure.patch(`/allpost/vote/${post._id}`, { type });
      return res.data;
    },
    onSuccess: (updatedPost) => {
      queryClient.setQueryData(["post", id], updatedPost);
    },
    onError: (err) => alert("Vote failed: " + err.message),
  });

  // Comment mutation
  const commentMutation = useMutation({
    mutationFn: async (commentText) => {
      if (!post) throw new Error("Post not loaded");
      const res = await axiosSecure.post(`/comments/${post._id}`, {
        comment: commentText,
        authorName: UserData.name,
        authorEmail: UserData.email,
        date: new Date().toISOString(),
      });
      return res.data;
    },
    onSuccess: (newComment) => {
      queryClient.setQueryData(["post", id], (old) => ({
        ...old,
        comments: [...(old.comments || []), newComment],
      }));
      setNewComment("");
    },
    onError: (err) => alert("Failed to add comment: " + err.message),
  });

  const voteScore = (post?.upVote || 0) - (post?.downVote || 0);
  const shareUrl = `${window.location.origin}/postDetails/${post?._id}`;

  const handleVote = (type) => {
    if (!UserData) return alert("Please log in to vote.");
    if (voteMutation.isLoading) return;
    voteMutation.mutate(type);
  };

  const handleCommentSubmit = () => {
    if (!UserData) return alert("Please log in to comment.");
    if (!newComment.trim()) return alert("Comment cannot be empty.");
    if (commentMutation.isLoading) return;
    commentMutation.mutate(newComment.trim());
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
        {error.message || "Failed to load post."}
      </div>
    );

  if (!post)
    return (
      <div className="text-center py-20 text-gray-600 font-medium">Post not found.</div>
    );

  return (
    <main className="pt-20 px-4 max-w-5xl mx-auto">
      <article className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Post Image */}
        <motion.img
          src={post.authorImage}
          alt={post.title}
          className="w-full h-96 object-cover object-center rounded-t-3xl"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1 }}
          loading="lazy"
        />

        <section className="p-8">
          {/* Post Title and Meta */}
          <header className="mb-6">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-gray-500 text-sm">
              <div className="flex items-center gap-1">
                <FaUser />
                <span>{post.authorName}</span>
              </div>
              <div className="flex items-center gap-1">
                <FaEnvelope />
                <span>{post.authorEmail}</span>
              </div>
              <time
                dateTime={post.date}
                className="ml-auto"
                title={new Date(post.date).toLocaleString()}
              >
                {new Date(post.date).toLocaleString()}
              </time>
            </div>
          </header>

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
            upVote={post.upVote}
            downVote={post.downVote}
            onUpvote={() => handleVote("upvote")}
            onDownvote={() => handleVote("downvote")}
            voting={voteMutation.isLoading}
            canVote={!!UserData}
            shareUrl={shareUrl}
            title={post.title}
            canShare={!!UserData}
          />

          {/* Comments */}
          <CommentsSection
            comments={post.comments || []}
            newComment={newComment}
            setNewComment={setNewComment}
            onSubmit={handleCommentSubmit}
            submitting={commentMutation.isLoading}
            canComment={!!UserData}
          />
        </section>
      </article>
    </main>
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
  onUpvote,
  onDownvote,
  voting,
  canVote,
  shareUrl,
  title,
  canShare,
}) => (
  <section
    className="flex flex-wrap gap-4 justify-between items-center mb-10"
    aria-label="Vote and Share actions"
  >
    <div className="flex gap-4">
      <motion.button
        onClick={onUpvote}
        disabled={voting || !canVote}
        aria-disabled={!canVote}
        aria-label="Upvote post"
        whileTap={{ scale: 0.9 }}
        className={`flex items-center gap-2 px-5 py-3 rounded-xl border border-green-500 text-green-600 font-semibold transition-colors ${
          canVote ? "hover:bg-green-50" : "opacity-50 cursor-not-allowed"
        }`}
      >
        <FaThumbsUp size={20} /> Upvote ({upVote || 0})
      </motion.button>

      <motion.button
        onClick={onDownvote}
        disabled={voting || !canVote}
        aria-disabled={!canVote}
        aria-label="Downvote post"
        whileTap={{ scale: 0.9 }}
        className={`flex items-center gap-2 px-5 py-3 rounded-xl border border-red-500 text-red-600 font-semibold transition-colors ${
          canVote ? "hover:bg-red-50" : "opacity-50 cursor-not-allowed"
        }`}
      >
        <FaThumbsDown size={20} /> Downvote ({downVote || 0})
      </motion.button>
    </div>

    {canShare ? (
      <FacebookShareButton url={shareUrl} quote={title}>
        <motion.div
          role="button"
          tabIndex={0}
          whileTap={{ scale: 0.9 }}
          className="flex items-center gap-2 px-5 py-3 rounded-xl border border-blue-500 text-blue-600 font-semibold cursor-pointer hover:bg-blue-50 select-none"
          title="Share on Facebook"
          onKeyPress={(e) => {
            if (e.key === "Enter") e.currentTarget.click();
          }}
        >
          <FaShareAlt size={20} /> Share
        </motion.div>
      </FacebookShareButton>
    ) : (
      <button
        disabled
        aria-disabled="true"
        className="flex items-center gap-2 px-5 py-3 rounded-xl border border-blue-500 text-blue-600 font-semibold opacity-50 cursor-not-allowed select-none"
        title="Login to share"
      >
        <FaShareAlt size={20} /> Share
      </button>
    )}
  </section>
);

const CommentsSection = ({
  comments,
  newComment,
  setNewComment,
  onSubmit,
  submitting,
  canComment,
}) => (
  <section aria-label="Comments section">
    <h2 className="text-3xl font-bold mb-6 border-b pb-2 border-gray-300 flex items-center gap-3">
      <FaComments className="text-blue-600" /> Comments
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
          aria-label="Write a comment"
          disabled={submitting}
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

    {comments.length === 0 ? (
      <p className="text-gray-500 italic">No comments yet.</p>
    ) : (
      <ul className="space-y-6 max-h-[380px] overflow-y-auto pr-2">
        {comments.map((comment, i) => (
          <motion.li
            key={i}
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
