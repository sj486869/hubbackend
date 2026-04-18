import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadVideo } from "../../redux/slices/videoSlice";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const categories = [
  "Music",
  "Education",
  "Gaming",
  "Technology",
  "Vlogs",
  "Comedy",
  "Other",
];

const UploadVideo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.video);

  const [form, setForm] = useState({
    title: "",
    description: "",
    tags: "",
    category: "",
    isPublic: true,
    video: null,
    thumbnail: null,
  });

  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
     
    if (files) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  const { title, video, thumbnail } = form;

  if (!title || !video || !thumbnail) {
    toast.error("Please fill all required fields and upload files!");
    return;
  }

  const formData = new FormData();
  Object.entries(form).forEach(([key, value]) => formData.append(key, value));

  try {
    // ✅ Pass FormData directly and track progress in the API
    await dispatch(
      uploadVideo({
        formData,
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percent);
        },
      })
    ).unwrap();

    toast.success("Video uploaded successfully!");
    setForm({
      title: "",
      description: "",
      tags: "",
      category: "",
      isPublic: true,
      video: null,
      thumbnail: null,
    });
    setProgress(0);
  } catch (error) {
    console.error("Failed to upload video:", error);
    toast.error(error || "Failed to upload video.");
    setProgress(0);
  }
};

  return (
    <div className="min-h-screen bg-[#111827] flex pb-20 items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#0f2027] p-8 rounded-3xl shadow-2xl border border-gray-700"
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-4 text-gray-200 hover:text-white transition"
        >
          <FaArrowLeft /> Go Back
        </button>

        <h2
          className="text-3xl font-bold mb-6 text-center 
               bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-500 
               bg-clip-text text-transparent drop-shadow-[0_0_12px_#fbbf24]"
        >
          Upload New Video
        </h2>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-gray-300 font-medium mb-1">
              Title*
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter video title"
              required
              className="w-full rounded-lg border border-gray-600 bg-[#1f2937] p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-300 font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter video description"
              rows={3}
              className="w-full rounded-lg border border-gray-600 bg-[#1f2937] p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-gray-300 font-medium mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="e.g., tutorial, tech, react"
              className="w-full rounded-lg border border-gray-600 bg-[#1f2937] p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-300 font-medium mb-1">
              Category*
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-600 bg-[#1f2937] p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Public/Private */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isPublic"
              checked={form.isPublic}
              onChange={handleChange}
              className="accent-indigo-500"
            />
            <label className="text-gray-300 font-medium">Public</label>
          </div>

          {/* Video File */}
          <div>
            <label className="block text-gray-200 font-semibold mb-2">
              🎬 Video File*
            </label>
            <input
              type="file"
              name="video"
              accept="video/*"
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm text-gray-300 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-green-600 file:text-white hover:file:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-gray-200 font-semibold mb-2">
              🖼 Thumbnail*
            </label>
            <input
              type="file"
              name="thumbnail"
              accept="image/*"
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm text-gray-300 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {form.thumbnail && (
              <img
                src={URL.createObjectURL(form.thumbnail)}
                alt="Thumbnail Preview"
                className="mt-3 w-full h-48 object-cover rounded-lg border border-gray-700 shadow-md"
              />
            )}
          </div>

          {/* Progress */}
          {loading && (
            <div className="w-full mt-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-indigo-400">
                  Uploading...
                </span>
                <span className="text-sm font-medium text-indigo-400">
                  {progress}%
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden shadow-inner">
                <div
                  className="h-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300 ease-in-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-medium bg-gradient-to-r from-cyan-500 to-teal-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 shadow-md ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Uploading..." : "Upload Video"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default UploadVideo;
