import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { getAllVideos } from "../../redux/slices/videoSlice";
import { useNavigate, Link } from "react-router-dom";
import { FaHeart, FaEye, FaCommentDots } from "react-icons/fa";
import VideoCard from "../video/VideoCard";

const VideoSearchResult = ({ query }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { videos, loading, error } = useSelector((state) => state.video);

  useEffect(() => {
    if (query && query.trim() !== "") {
      dispatch(getAllVideos({ search: query, limit: 12, page: 1 }));
    }
  }, [query, dispatch]);

  if (loading) return <div className="text-center text-gray-400 py-6">Searching videos...</div>;
  if (error) return <div className="text-center text-red-400 py-6">{error}</div>;
  if (!videos || videos.length === 0) return <div className="text-center text-gray-400 py-6">No videos found. Try another search.</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid gap-6 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    >
      {Array.isArray(videos) && videos.length > 0 ? (
        videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))
      ) : (
        <div className="col-span-full py-20 text-center">
            <p className="text-gray-500 text-lg">No videos found. Try another search.</p>
        </div>
      )}
    </motion.div>
  );
};

export default VideoSearchResult;
