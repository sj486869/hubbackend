// 📁 components/Comments/ReplyInput.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaPaperPlane } from "react-icons/fa";

const ReplyInput = ({ onReply, user }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onReply(text);
    setText("");
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="ml-10 mt-3 flex items-center gap-3 sm:gap-2"
    >
      {/* 🧑 User Avatar */}
      {user?.profileImage && (
        <img
          src={user.profileImage}
          alt={user.name}
          className="w-8 h-8 sm:w-7 sm:h-7 rounded-full object-cover border border-gray-700"
        />
      )}

      {/* 💬 Input Field */}
      <div className="flex-1 flex items-center bg-gray-800/80 rounded-full border border-gray-700 px-4 py-2 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a reply..."
          className="flex-1 bg-transparent text-white placeholder-gray-400 text-sm focus:outline-none"
        />

        {/* 📤 Send Button */}
        <button
          type="submit"
          disabled={!text.trim()}
          className={`p-2 rounded-full transition ${
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

export default ReplyInput;