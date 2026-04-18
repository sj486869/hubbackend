import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCreatorVideos, deleteVideo } from "../../redux/slices/videoSlice";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaHeart,
  FaClock,
  FaEllipsisV,
} from "react-icons/fa";
import { motion } from "framer-motion";
import moment from "moment";

const CreatorDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);
  const { creatorVideos, loading } = useSelector((state) => state.video);

  const [openMenuId, setOpenMenuId] = useState(null); // Track which video's menu is open

  useEffect(() => {
    if (currentUser?.id) {
      dispatch(getCreatorVideos(currentUser.id));
    }
  }, [dispatch, currentUser]);

  const handleDelete = (videoId) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      dispatch(deleteVideo(videoId));
      setOpenMenuId(null);
    }
  };

  const handleEdit = (videoId) => {
    navigate(`/creator/video/${videoId}`);
    setOpenMenuId(null);
  };

  const toggleMenu = (videoId) => {
    setOpenMenuId(openMenuId === videoId ? null : videoId);
  };

  const totalViews = creatorVideos.reduce((acc, v) => acc + v.views, 0);
  const totalLikes = creatorVideos.reduce((acc, v) => acc + v.likesCount, 0);

  // Sidebar buttons
  const navLinks = [
    { name: "Stats", path: "/creator/dashboard" },
    { name: "Upload", path: "/upload-video" },
    { name: "Explore", path: "/" },
  ];

  return (
    <div className="min-h-screen pb-20 flex flex-col md:flex-row bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-800 shadow-md p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <img
            src={
              currentUser?.profileImage ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt={currentUser?.name}
            className="w-12 h-12 rounded-full object-cover border border-gray-700"
          />
          <div>
            <h2 className="font-bold text-lg">{currentUser?.name}</h2>
            <p className="text-gray-400 text-sm">{currentUser?.email}</p>
          </div>
        </div>

        {/* Sidebar links: vertical on md+, horizontal on small screens */}
        <div className="flex  md:flex-col sm:flex-row gap-2 md:gap-3 flex-wrap mb-4">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <button
                key={link.name}
                onClick={() => navigate(link.path)}
                className={`px-2 py-1 rounded hover:bg-gray-700 transition-colors text-left flex-1
                  ${isActive ? "bg-blue-600 text-white" : "text-gray-300"}`}
              >
                {link.name}
              </button>
            );
          })}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow flex flex-col items-center">
            <h3 className="text-gray-400 font-medium">Videos</h3>
            <p className="text-2xl font-bold">{creatorVideos.length}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow flex flex-col items-center">
            <h3 className="text-gray-400 font-medium">Total Views</h3>
            <p className="text-2xl font-bold">{totalViews}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow flex flex-col items-center">
            <h3 className="text-gray-400 font-medium">Total Likes</h3>
            <p className="text-2xl font-bold">{totalLikes}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow flex flex-col items-center">
            <h3 className="text-gray-400 font-medium">Total Subs</h3>
            <p className="text-2xl font-bold">{currentUser?.subscribersCount}</p>
          </div>
        </div>

        {/* Videos Grid */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Your Videos</h2>
          {loading && <p className="text-gray-400">Loading videos...</p>}
          {!loading && creatorVideos.length === 0 && (
            <p className="text-gray-400">No videos uploaded yet.</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {creatorVideos.map((video) => (
              <motion.div
                key={video.id}
                whileHover={{ scale: 1.03 }}
                className="relative rounded-xl overflow-hidden bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#0f2027] border border-gray-800 shadow-md hover:shadow-2xl hover:border-blue-500 transition-all duration-300 cursor-pointer"
              >
                {/* Thumbnail */}
                <div className="relative w-full aspect-video bg-black flex items-center justify-center">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    {Math.floor(video.duration / 60)}:
                    {Math.floor(video.duration % 60)
                      .toString()
                      .padStart(2, "0")}
                  </span>
                </div>

                {/* Video Info */}
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-[16px] font-semibold mb-2 text-white line-clamp-2 hover:text-blue-400 transition-colors">
                      {video.title}
                    </h3>
                    <button
                      className="text-gray-400 hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMenu(video.id);
                      }}
                    >
                      <FaEllipsisV />
                    </button>
                  </div>

                  {/* Stats */}
                  <div className="flex justify-between text-xs text-gray-400 mb-2">
                    <span className="flex items-center gap-1">
                      <FaEye className="text-blue-400 text-[10px]" />{" "}
                      {video.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaHeart className="text-pink-500 text-[10px]" />{" "}
                      {video.likesCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaClock className="text-gray-400 text-[10px]" />{" "}
                      {moment(video.createdAt).fromNow()}
                    </span>
                  </div>

                  {/* Conditional Edit/Delete Buttons */}
                  {openMenuId === video.id && (
                    <div
                      className="flex gap-2 mt-2 justify-end"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => handleEdit(video.id)}
                        className="flex flex-1 items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(video.id)}
                        className="flex flex-1 items-center gap-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreatorDashboard;
