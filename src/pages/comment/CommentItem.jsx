// 📁 components/Comments/CommentItem.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  deleteComment,
  updateComment,
  likeOrUnlikeComment,
  replyToComment,
} from "../../redux/slices/commentSlice";
import ReplyList from "./ReplyList";
import ReplyInput from "./ReplyInput";
import { FaHeart, FaEdit, FaTrash, FaReply } from "react-icons/fa";
import { motion } from "framer-motion";
import moment from "moment";

const CommentItem = ({ comment }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);

  const handleUpdate = () => {
    if (editText.trim() === "") return;
    dispatch(updateComment({ commentId: comment._id, text: editText }));
    setIsEditing(false);
  };

  const handleDelete = () => {
    dispatch(deleteComment(comment._id));
  };

  const handleLike = () => {
    dispatch(likeOrUnlikeComment(comment._id));
  };

  const handleReply = (text) => {
    dispatch(replyToComment({ commentId: comment._id, text }));
    setShowReplyInput(false);
  };

  return (
    <motion.div
      className="border-b border-gray-800 py-4 flex gap-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 👤 Profile Section */}
      <img
        src={comment.user?.profileImage}
        alt={comment.user?.name}
        className="w-10 h-10 rounded-full object-cover border border-gray-700"
      />

      {/* 💬 Comment Body */}
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-white font-semibold">
              {comment.user?.name || "Unknown User"}
            </h4>
            <p className="text-gray-400 text-xs">
              {moment(comment.createdAt).fromNow()}
            </p>
          </div>

          {/* ✏️ Edit / Delete Buttons */}
          <div className="flex gap-3">
            {isEditing ? (
              <button
                onClick={handleUpdate}
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                Save
              </button>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-yellow-400 hover:text-yellow-300 text-sm flex items-center gap-1"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="text-red-500 hover:text-red-400 text-sm flex items-center gap-1"
                >
                  <FaTrash /> Delete
                </button>
              </>
            )}
          </div>
        </div>

        {/* 📝 Comment Text */}
        <div className="mt-2">
          {isEditing ? (
            <input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="bg-gray-900 text-white px-3 py-2 rounded w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-200 mt-1">{comment.text}</p>
          )}
        </div>

        {/* ❤️ 💬 Action Buttons */}
        <div className="flex items-center gap-5 mt-3 text-gray-400 text-sm">
          <button
            onClick={handleLike}
            className="flex items-center gap-2 hover:text-red-400 transition"
          >
            <FaHeart /> {comment.likesCount || 0}
          </button>

          <button
            onClick={() => setShowReplyInput(!showReplyInput)}
            className="flex items-center gap-2 hover:text-blue-400 transition"
          >
            <FaReply /> Reply
          </button>

          {comment.replies?.length > 0 && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="hover:text-green-400 transition"
            >
              {showReplies
                ? "Hide Replies"
                : `View ${comment.replies.length} Replies`}
            </button>
          )}
        </div>

        {/* ✍️ Reply Input */}
        {showReplyInput && (
          <div className="mt-3">
            <ReplyInput onReply={handleReply} />
          </div>
        )}

        {/* 💬 Replies List */}
        {showReplies && comment.replies?.length > 0 && (
          <div className="mt-4 ml-10">
            <ReplyList replies={comment.replies} />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CommentItem;
