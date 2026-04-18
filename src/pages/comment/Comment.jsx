// 📁 Comment.jsx
import React, { useState } from "react";
import AddComment from "./AddComment";
import CommentList from "./CommentList";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const Comment = ({ videoId }) => {
  const [showComments, setShowComments] = useState(false); // Default false

  return (
    <div className="mt-6 px-2 border-t border-gray-700 py-6">
      <h3 className="text-white text-lg mb-3">Comments</h3>

      {/* Always visible: AddComment input */}
      <AddComment videoId={videoId} />

      {/* Toggle Button */}
      <div className="mt-3 flex justify-center">
        <button
          onClick={() => setShowComments((prev) => !prev)}
          className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-500 transition"
        >
          {showComments ? "Hide Comments" : "Show Comments"}
          {showComments ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>

      {/* Conditionally render CommentList */}
      {showComments && <CommentList videoId={videoId} />}
    </div>
  );
};

export default Comment;
