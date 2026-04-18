import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { updateVideo, getCreatorVideos } from "../../redux/slices/videoSlice";

const UpdateVideo = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { creatorVideos } = useSelector((state) => state.video);

  const [currentVideo, setCurrentVideo] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    tags: "",
    isPublic: false,
  });
  const [previewThumbnail, setPreviewThumbnail] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);

  // Load currentVideo from Redux
  useEffect(() => {
    const video = creatorVideos.find((v) => v.id === id);
    if (video) setCurrentVideo(video);
    else dispatch(getCreatorVideos());
  }, [creatorVideos, id, dispatch]);

  // Pre-fill form when currentVideo is loaded
  useEffect(() => {
    if (currentVideo) {
      setFormData({
        title: currentVideo.title || "",
        description: currentVideo.description || "",
        category: currentVideo.category || "",
        tags: currentVideo.tags ? currentVideo.tags.join(", ") : "",
        isPublic: currentVideo.isPublic || false,
      });
      setPreviewThumbnail(currentVideo.thumbnailUrl || null);
    }
  }, [currentVideo]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleVideoFile = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleThumbnailFile = (e) => {
    setThumbnailFile(e.target.files[0]);
    setPreviewThumbnail(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formPayload = new FormData();
    formPayload.append("title", formData.title);
    formPayload.append("description", formData.description);
    formPayload.append("category", formData.category);
    formPayload.append("tags", formData.tags);
    formPayload.append("isPublic", formData.isPublic);
    if (videoFile) formPayload.append("video", videoFile);
    if (thumbnailFile) formPayload.append("thumbnail", thumbnailFile);

    await dispatch(updateVideo({ id, formData: formPayload }));
    navigate("/creator/dashboard");
  };

  if (!currentVideo) return <p>Loading video...</p>;

  return (
    <div className="max-w-md w-full space-y-4 bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#2c5364] p-6 sm:p-8 rounded-2xl shadow-xl border border-[#374151] mx-auto mt-10 text-white">
      <h2 className="text-2xl font-bold mb-2 text-center">Update Video</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          className="p-3 rounded-lg border border-gray-600 bg-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          rows={4}
          className="p-3 rounded-lg border border-gray-600 bg-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Category"
          className="p-3 rounded-lg border border-gray-600 bg-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="Tags (comma separated)"
          className="p-3 rounded-lg border border-gray-600 bg-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isPublic"
            checked={formData.isPublic}
            onChange={handleChange}
            className="w-5 h-5 accent-blue-500"
          />
          Public
        </label>

        {/* Preview thumbnail */}
        {previewThumbnail && (
          <img
            src={previewThumbnail}
            alt="Thumbnail Preview"
            className="w-full h-40 object-cover rounded"
          />
        )}

        <div className="flex flex-col gap-3">
          {/* Video Upload */}
          <label className="flex flex-col">
            <span className="mb-1 text-gray-300">Upload Video</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                onClick={() => document.getElementById("videoFile").click()}
              >
                Choose Video
              </button>
              <span className="text-gray-200">
                {videoFile?.name || "No file selected"}
              </span>
            </div>
            <input
              id="videoFile"
              type="file"
              onChange={handleVideoFile}
              className="hidden"
              accept="video/*"
            />
          </label>

          {/* Thumbnail Upload */}
          <label className="flex flex-col">
            <span className="mb-1 text-gray-300">Upload Thumbnail</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                onClick={() => document.getElementById("thumbnailFile").click()}
              >
                Choose Thumbnail
              </button>
              <span className="text-gray-200">
                {thumbnailFile?.name || "No file selected"}
              </span>
            </div>
            <input
              id="thumbnailFile"
              type="file"
              onChange={handleThumbnailFile}
              className="hidden"
              accept="image/*"
            />
          </label>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={() => navigate("/creator/dashboard")}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateVideo;
