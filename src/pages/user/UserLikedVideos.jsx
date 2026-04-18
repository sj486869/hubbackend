import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHeart, FaEye, FaCommentDots } from "react-icons/fa";

const UserLikedVideos = () => {
  const { currentUser } = useSelector((state) => state.user);

  if (!currentUser || !currentUser.likedVideos.length) {
    return <p className="text-gray-400 text-center mt-6">No liked videos yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {currentUser.likedVideos.map((video) => (
        <motion.div
          key={video._id}
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.3 }}
          className="rounded-xl overflow-hidden bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#0f2027] border border-gray-800 shadow-md hover:shadow-2xl hover:border-blue-500 transition-all duration-300 cursor-pointer"
        >
          {/* Thumbnail */}
          <Link to={`/video/${video._id}`}>
            <div className="relative w-full aspect-video bg-black flex items-center justify-center">
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="absolute inset-0 w-full h-full object-contain"
              />
            </div>
          </Link>

          {/* Video Info */}
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2 text-white line-clamp-2 hover:text-blue-400 transition-colors">
              {video.title}
            </h3>

            {/* Creator */}
            <div className="flex items-center gap-3 mb-4">
              <Link to={`/creator/${video.uploadedBy?._id}`}>
                <img
                  src={
                    video.uploadedBy?.profileImage ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt={video.uploadedBy?.name}
                  className="w-8 h-8 rounded-full border border-gray-700"
                />
              </Link>
              <span className="text-sm text-gray-300 truncate">
                {video.uploadedBy?.name}
              </span>
            </div>

            {/* Stats */}
            <div className="flex justify-between text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <FaHeart className="text-pink-500" /> {video.likesCount || 0}
              </span>
              <span className="flex items-center gap-1">
                <FaEye className="text-blue-400" /> {video.views || 0}
              </span>
              <span className="flex items-center gap-1">
                <FaCommentDots className="text-green-400" /> {video.commentsCount || 0}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default UserLikedVideos;
