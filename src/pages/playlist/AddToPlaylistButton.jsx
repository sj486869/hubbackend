import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserPlaylists, addVideoToPlaylist } from "../../redux/slices/playlistSlice";
import { toast } from "react-toastify";

const AddToPlaylistButton = ({ videoId }) => {
  const dispatch = useDispatch();
  const { playlists, loading } = useSelector((state) => state.playlist);
  const [selectedPlaylist, setSelectedPlaylist] = useState("");

  useEffect(() => {
    dispatch(getUserPlaylists());
  }, [dispatch]);

  const handleAddVideo = () => {
    if (!selectedPlaylist) return toast.error("Please select a playlist");

    dispatch(addVideoToPlaylist({ playlistId: selectedPlaylist, videoId }))
      .unwrap()
      .then(() => toast.success("Video added to playlist!"))
      .catch((err) => toast.error(err || "Failed to add video"));
  };

  if (loading) return <p className="text-gray-400">Loading playlists...</p>;

  return (
    <div className="flex items-center space-x-3 mt-4">
      <select
        value={selectedPlaylist}
        onChange={(e) => setSelectedPlaylist(e.target.value)}
        className="bg-gray-800 text-gray-200 border border-amber-50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        <option value="" className="bg-gray-800 text-gray-200">
          Select playlist
        </option>
        {playlists.map((playlist) => (
          <option
            key={playlist._id}
            value={playlist._id}
            className="bg-gray-800 text-gray-200"
          >
            {playlist.title}
          </option>
        ))}
      </select>
      <button
        onClick={handleAddVideo}
        className="bg-gray-800 hover:bg-gray-700 text-white font-medium px-5 py-2 rounded-lg transition-colors shadow-md border border-amber-50 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Add to Playlist
      </button>
    </div>
  );
};

export default AddToPlaylistButton;
