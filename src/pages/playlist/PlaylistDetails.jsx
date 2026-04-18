import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  getPlaylistById,
  removeVideoFromPlaylist,
} from "../../redux/slices/playlistSlice";
import { toast } from "react-toastify";
import { FaArrowLeft } from "react-icons/fa";

const PlaylistDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentPlaylist, loading, error } = useSelector(
    (state) => state.playlist
  );
  console.log("currentPlaylist", currentPlaylist);

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getPlaylistById(id));
  }, [dispatch, id]);

  const handleRemoveVideo = (videoId) => {
    if (window.confirm("Are you sure you want to remove this video?")) {
      dispatch(removeVideoFromPlaylist({ playlistId: id, videoId }))
        .unwrap()
        .then(() => toast.success("Video removed successfully"))
        .catch(() => toast.error("Failed to remove Video"));
    }
  };

  // Helper to convert seconds to mm:ss
  const formatDuration = (duration) => {
    if (!duration) return "00:00";
    let totalSeconds = 0;

    if (typeof duration === "string") {
      const parts = duration.split(":");
      if (parts.length === 2) {
        totalSeconds = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
      }
    } else if (typeof duration === "number") {
      totalSeconds = Math.floor(duration); // get rid of decimals
    }

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  if (loading)
    return (
      <p className="text-center mt-6 text-gray-300">Loading playlist...</p>
    );
  if (error) return <p className="text-red-400 text-center mt-6">{error}</p>;
  if (!currentPlaylist)
    return <p className="text-center mt-6 text-gray-300">No playlist found.</p>;

  const isOwner = currentUser?.id === currentPlaylist.owner?._id;

  return (
    <div className="max-w-5xl pb-20 mx-auto mt-8 p-6 bg-[#111827] text-gray-100 rounded-xl shadow-lg">
      {/* Go Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-4 text-gray-200 hover:text-white transition"
      >
        <FaArrowLeft /> Go Back
      </button>

      <h2 className="text-2xl font-bold mb-2">{currentPlaylist.name}</h2>
      <p className="text-gray-400 mb-4">
        {currentPlaylist.description || "No description"}
      </p>
      <p className="text-sm text-gray-500 mb-6">
        Created by: {currentPlaylist.owner?.name}
      </p>

      {currentPlaylist.videos.length === 0 ? (
        <p className="text-gray-500">No videos in this playlist yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentPlaylist.videos.map((video) => (
            <div
              key={video._id}
              className="group relative p-3 rounded-lg border border-gray-700 bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#0f2027] 
                     flex justify-between items-center transition transform hover:scale-[1.02] hover:shadow-xl"
            >
              <Link
                to={`/video/${video._id}`}
                className="flex-1 flex items-center space-x-3"
              >
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-14 h-14 object-cover rounded-md shadow-md group-hover:brightness-90 transition"
                />
                <div>
                  <p className="font-semibold group-hover:text-teal-300 transition">
                    {video.title}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {video.artist} • {formatDuration(video.duration)}
                  </p>
                </div>
              </Link>

              {/* Remove Button */}
              {isOwner && (
                <button
                  onClick={() => handleRemoveVideo(video._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 hover:scale-105 transition transform shadow-md"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlaylistDetails;
