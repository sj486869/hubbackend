import React from "react";
import { motion } from "framer-motion";
import { FaUser, FaEye, FaClock, FaHeart, FaCommentDots } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const VideoCard = ({ video }) => {
  const navigate = useNavigate();

  const formatDuration = (duration) => {
    if (!duration) return "00:00";

    let totalSeconds = 0;

    if (typeof duration === "string") {
      const parts = duration.split(":");
      if (parts.length === 2) {
        totalSeconds = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
      }
    } else if (typeof duration === "number") {
      totalSeconds = Math.floor(duration);
    }

    const dur = moment.duration(totalSeconds, "seconds");
    const minutes = Math.floor(dur.asMinutes());
    const seconds = dur.seconds();

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -3 }}
      transition={{ duration: 0.3 }}
      onClick={() => navigate(`/video/${video._id}`)}
      className="bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#0f2027] rounded-xl overflow-hidden shadow-lg border border-gray-800 hover:border-indigo-500 cursor-pointer group"
    >
      {/* Thumbnail */}
      <div className="relative w-full h-48 bg-gray-700 overflow-hidden">
        {video.thumbnailUrl ? (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <FaUser className="text-gray-400 text-4xl" />
          </div>
        )}

        {/* Duration */}
        {video.duration && (
          <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
            {formatDuration(video.duration)}
          </span>
        )}
      </div>

      {/* Video Info */}
      <div className="p-3 flex flex-col gap-1">
        <h3 className="text-white font-semibold text-sm md:text-base line-clamp-2">
          {video.title}
        </h3>
        <p className="text-gray-400 text-xs truncate">{video.description}</p>

        {/* Metadata */}
        <div className="flex items-center justify-between mt-2 text-gray-400 text-xs">
          <div className="flex items-center gap-2 mt-2">
            {/* Channel Logo */}
            <img
              src={video.uploadedBy?.profileImage || "/default-avatar.png"}
              alt={video.uploadedBy?.name || "Unknown"}
              className="w-6 h-6 rounded-full object-cover"
            />

            {/* Channel Name */}
            <span className="text-gray-200 text-xs font-medium">
              {video.uploadedBy?.name || "Unknown"}
            </span>
          </div>

          {/* Stats */}
          <div className="flex justify-between text-sm gap-4 text-gray-400">
            <span className="flex items-center gap-1">
              <FaHeart className="text-pink-500" /> {video.likesCount || 0}
            </span>
            <span className="flex items-center gap-1">
              <FaEye className="text-blue-400" /> {video.views || 0}
            </span>
            <span className="flex items-center gap-1">
              <FaCommentDots className="text-green-400" />{" "}
              {video.commentsCount || 0}
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex justify-between items-center">
          {video.tags && video.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {video.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-indigo-500/30 text-indigo-200 text-xs px-2 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <FaClock className="text-[10px]" />{" "}
            {moment(video.createdAt).fromNow()}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VideoCard;
