import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPlaylist } from "../../redux/slices/playlistSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CreatePlaylist = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null); 
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.playlist);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Playlist title is required.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      if (thumbnail) formData.append("thumbnail", thumbnail); 

      await dispatch(createPlaylist(formData)).unwrap();
      toast.success("Playlist created successfully!");
      setTitle("");
      setDescription("");
      setThumbnail(null);
    } catch (err) {
      toast.error(err || "Failed to create playlist.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#0f2027] text-gray-100 rounded-xl shadow-xl border border-gray-700">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-gray-300 hover:text-white flex items-center space-x-1 font-medium transition-colors"
      >
        <span className="text-lg">←</span>
        <span>Back</span>
      </button>

      <h2 className="text-2xl font-bold mb-6 text-gray-100">
        Create New Playlist
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Playlist Title */}
        <div>
          <label className="block text-gray-300 font-medium mb-1">
            Playlist Title
          </label>
          <input
            type="text"
            className="w-full border border-gray-600 bg-[#1f2937] text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
            placeholder="Enter playlist title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Playlist Description */}
        <div>
          <label className="block text-gray-300 font-medium mb-1">
            Description (optional)
          </label>
          <textarea
            className="w-full border border-gray-600 bg-[#1f2937] text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
            placeholder="Add a short description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Thumbnail Upload */}
        <div className="flex flex-col gap-2">
          <label className="block text-gray-300 font-medium mb-1">
            Thumbnail (optional)
          </label>

          <div
            className="flex items-center justify-center border-2 border-dashed border-gray-600 rounded-lg p-4 cursor-pointer hover:border-teal-500 transition-colors"
            onClick={() => document.getElementById("thumbnailInput").click()}
          >
            {thumbnail ? (
              <img
                src={URL.createObjectURL(thumbnail)}
                alt="Thumbnail Preview"
                className="w-32 h-32 object-cover rounded-md"
              />
            ) : (
              <span className="text-gray-400 text-sm">
                Click or drag & drop to upload thumbnail
              </span>
            )}
          </div>

          <input
            type="file"
            id="thumbnailInput"
            accept="image/*"
            name="thumbnail"
            className="hidden"
            onChange={(e) =>
              e.target.files[0] && setThumbnail(e.target.files[0])
            }
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full bg-gradient-to-r from-cyan-500 to-teal-400 text-gray-900 py-2 rounded-lg 
          shadow-md transition-transform duration-300 ease-in-out transform 
          hover:scale-105 hover:from-cyan-400 hover:to-teal-300 
          hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Playlist"}
        </button>

        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
      </form>
    </div>
  );
};

export default CreatePlaylist;
