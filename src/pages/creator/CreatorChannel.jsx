// 📁 src/pages/CreatorChannel.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import React from "react";
import { FaArrowLeft, FaHeart, FaEye, FaCommentDots } from "react-icons/fa";
import { motion } from "framer-motion";
import { fetchCreatorById } from "../../redux/slices/subscriptionSlice";
import SubscribeBtn from "../subscribe/SubscribeBtn";

const CreatorChannel = () => {
  const { creatorId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const { currentCreator, loading, error } = useSelector(
  //   (state) => state.subscription
  // );

    const { currentCreator, loading, error } = useSelector(
      (state) => state.subscription,
      (prev, next) => prev.currentCreator === next.currentCreator
    );

  useEffect(() => {
    dispatch(fetchCreatorById(creatorId));
  }, [dispatch, creatorId]);

  if (loading)
    return (
      <p className="text-center text-lg font-semibold mt-10">Loading...</p>
    );

  if (error)
    return (
      <p className="text-center text-red-500 font-semibold mt-10">{error}</p>
    );

  if (!currentCreator) return null;

  return (
    <div className="max-w-6xl mx-auto pb-20 p-6">
      {/* Go Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-4 text-gray-200 hover:text-white transition"
      >
        <FaArrowLeft /> Go Back
      </button>

      {/* Creator Info */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
        <img
          src={currentCreator?.creator.profileImage}
          alt={currentCreator?.creator.name}
          className="w-28 h-28 rounded-full object-cover ring-2 ring-green-500"
        />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-center sm:text-left">
          {/* Left: Creator info */}
          <div>
            <h2 className="text-3xl font-bold text-white">
              {currentCreator.creator.name}
            </h2>
            <p className="text-gray-400">
              {currentCreator.subscriberCount} subscribers
            </p>
          </div>

          {/* Right: Subscribe button */}
          <div className="flex justify-center sm:justify-end">
            <SubscribeBtn
              creatorId={creatorId}
              className="w-28 sm:w-32" 
            />
          </div>
        </div>
      </div>

      <h3 className="text-2xl font-semibold mb-6 text-white">
        Uploaded Videos
      </h3>
      {currentCreator.creator.uploadedVideos?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentCreator.creator.uploadedVideos.map((video) => (
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

                {/* Stats */}
                <div className="flex justify-between text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <FaHeart className="text-pink-500" /> {video.likesCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaEye className="text-blue-400" /> {video.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaCommentDots className="text-green-400" />{" "}
                    {video.commentsCount || 0}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No videos uploaded yet.</p>
      )}
    </div>
  );
};

export default CreatorChannel;
