import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTopVideosThunk } from "../../redux/slices/videoSlice";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaHeart, FaEye, FaCommentDots } from "react-icons/fa";
import VideoCard from "../video/VideoCard";

const TopVideos = () => {
  const dispatch = useDispatch();
  const { topVideos, topByLikes, topByViews, topByComments, loading, error } =
    useSelector((state) => state.video);



  useEffect(() => {
    dispatch(getTopVideosThunk());
  }, [dispatch]);

  if (loading)
    return (
      <div className="text-center text-gray-400 mt-10">Loading videos...</div>
    );
  if (error)
    return <div className="text-center text-red-500 mt-10">{error}</div>;

  const sections = [
    { title: "🔥 Top Videos", data: topVideos },
    { title: "❤️ Most Liked", data: topByLikes },
    { title: "👀 Most Viewed", data: topByViews },
    { title: "💬 Most Commented", data: topByComments },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-3 sm:px-6 py-10">
     

      {sections.map(
        (section, index) =>
          section.data?.length > 0 && (
            <div key={index} className="mb-20">
              {/* Section Title */}
              <div className="flex items-center gap-4 mb-8 group cursor-default">
                <div className="w-1.5 h-10 bg-gradient-to-b from-orange-400 to-orange-600 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.5)] group-hover:h-12 transition-all duration-300" />
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase italic">
                  {section.title}
                </h2>
              </div>

              {/* Video Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {section.data.map((video) => (
                  <VideoCard key={video._id} video={video} />
                ))}
              </div>
            </div>
          )
      )}
    </div>
  );
};

export default TopVideos;
