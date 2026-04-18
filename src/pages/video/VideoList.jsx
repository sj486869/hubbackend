import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllVideos } from "../../redux/slices/videoSlice"; 
import VideoCard from "./VideoCard";

const VideoList = () => {
  const dispatch = useDispatch();
  const { videos, loading, error } = useSelector((state) => state.video);
  

  useEffect(() => {
    dispatch(getAllVideos());
  }, [dispatch]);

  if (loading)
    return <p className="text-white text-center mt-10">Loading videos...</p>;
  if (error)
    return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!videos || videos.length === 0)
    return (
      <p className="text-gray-400 text-center mt-10">No videos found</p>
    );

  return (
    <div className="min-h-screen pb-20 bg-[#111827] p-6">
      <h2 className="text-2xl text-white font-bold mb-6">All Videos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </div>
  );
};

export default VideoList;
