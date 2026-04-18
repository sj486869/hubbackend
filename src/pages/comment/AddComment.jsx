// 📁 AddComment.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addComment } from "../../redux/slices/commentSlice";
import { motion } from "framer-motion";
import { FaPaperPlane } from "react-icons/fa";

const AddComment = ({ videoId, user }) => {
  const [text, setText] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    dispatch(addComment({ videoId, text }));
    setText("");
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-3 mt-4 sm:mt-3"
    >
      {/* 🧑 User Avatar */}
      {user?.profileImage && (
        <img
          src={user.profileImage}
          alt={user.name}
          className="w-10 h-10 sm:w-8 sm:h-8 rounded-full object-cover border border-gray-700"
        />
      )}

      {/* 💬 Input + Button */}
      <div className="flex-1 flex items-center bg-gray-800/80 rounded-full border border-gray-700 px-4 py-2 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
        <input
          type="text"
          className="flex-1 bg-transparent text-white placeholder-gray-400 text-sm focus:outline-none"
          placeholder="Add a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          type="submit"
          disabled={!text.trim()}
          className={`ml-2 p-2 rounded-full transition ${
            text.trim()
              ? "bg-blue-600 hover:bg-blue-500 text-white"
              : "bg-gray-700 text-gray-400 cursor-not-allowed"
          }`}
        >
          <FaPaperPlane className="text-sm" />
        </button>
      </div>
    </motion.form>
  );
};

export default AddComment;
