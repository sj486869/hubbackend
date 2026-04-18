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
      whileHover={{ scale: 1.05, y: -8 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
      onClick={() => navigate(`/video/${video._id}`)}
      className="bg-[#0f172a] rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.3)] border border-white/5 hover:border-orange-500/50 cursor-pointer group hover:shadow-[0_20px_40px_rgba(249,115,22,0.15)] transition-all duration-300"
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-video bg-slate-900 overflow-hidden">
        {video.thumbnailUrl ? (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="h-full w-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-slate-800">
            <FaUser className="text-slate-600 text-4xl" />
          </div>
        )}

        {/* Duration Overlay */}
        {video.duration && (
          <span className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded-lg border border-white/10 shadow-xl">
            {formatDuration(video.duration)}
          </span>
        )}
        
        {/* Play Overlay */}
        <div className="absolute inset-0 bg-orange-600/0 group-hover:bg-orange-600/10 transition-colors duration-300 flex items-center justify-center">
           <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-300 shadow-2xl">
              <span className="text-slate-900 text-xl ml-1">▶</span>
           </div>
        </div>
      </div>

      {/* Video Info */}
      <div className="p-3 sm:p-5 flex flex-col gap-2">
        <h3 className="text-white font-bold text-sm sm:text-base line-clamp-2 leading-snug group-hover:text-orange-400 transition-colors">
          {video.title}
        </h3>

        {/* Metadata section */}
        <div className="flex flex-col gap-3 mt-1">
          <div className="flex items-center gap-3">
            {/* Channel Logo */}
            <div className="relative p-[1px] bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl overflow-hidden shadow-lg">
                <img
                  src={video.uploadedBy?.profileImage || "/default-avatar.png"}
                  alt={video.uploadedBy?.name || "Unknown"}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-[11px] object-cover bg-slate-900"
                />
            </div>

            <div className="flex flex-col">
                <span className="text-white text-xs sm:text-sm font-bold truncate max-w-[120px] sm:max-w-none">
                  {video.uploadedBy?.name || "Unknown"}
                </span>
                <span className="text-gray-500 text-[10px] sm:text-xs font-medium">
                  {moment(video.createdAt).fromNow()}
                </span>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center gap-4 py-2 border-t border-white/5">
            <span className="flex items-center gap-1.5 text-pink-500 text-xs font-bold">
              <FaHeart className="w-3.5 h-3.5" /> {video.likesCount || 0}
            </span>
            <span className="flex items-center gap-1.5 text-blue-400 text-xs font-bold">
              <FaEye className="w-3.5 h-3.5" /> {video.views || 0}
            </span>
            <span className="flex items-center gap-1.5 text-green-400 text-xs font-bold">
              <FaCommentDots className="w-3.5 h-3.5" /> {video.commentsCount || 0}
            </span>
          </div>
        </div>

        {/* Tags */}
        {video.tags && video.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1 opacity-80 group-hover:opacity-100 transition-opacity">
            {video.tags.slice(0, 2).map((tag, idx) => (
              <span
                key={idx}
                className="bg-white/5 border border-white/10 text-orange-400 text-[9px] sm:text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default VideoCard;
