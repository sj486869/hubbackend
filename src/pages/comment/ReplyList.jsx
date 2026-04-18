// 📁 components/Comments/ReplyList.jsx
import React from "react";
import { motion } from "framer-motion";

import moment from "moment";

const ReplyList = ({ replies }) => {
  if (!replies?.length) return null;

  return (
    <div className="ml-10 mt-3 space-y-3 border-l border-gray-800 pl-4">
      {replies.map((reply, index) => (
        <motion.div
          key={reply._id || index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-900/60 hover:bg-gray-900 transition-colors duration-200 rounded-xl p-3 shadow-sm"
        >
          {/* 👤 User Info */}
          <div className="flex items-center gap-3 mb-1">
            <img
              src={reply.user?.profileImage}
              alt={reply.user?.name}
              className="w-8 h-8 rounded-full border border-gray-700 object-cover"
            />
            <div>
              <h5 className="text-sm text-white font-semibold">
                {reply.user?.name || "User"}
              </h5>
              <p className="text-xs text-gray-400">
                {moment(reply.createdAt).fromNow()}
              </p>
            </div>
          </div>

          {/* 💬 Reply Text */}
          <p className="text-gray-200 text-sm ml-11">{reply.text}</p>

          
        </motion.div>
      ))}
    </div>
  );
};

export default ReplyList;
