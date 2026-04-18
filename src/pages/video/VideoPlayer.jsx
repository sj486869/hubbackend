import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaExpand,
  FaCompress,
} from "react-icons/fa";
import { getVideoById, incrementView } from "../../redux/slices/videoSlice";
import AddToPlaylistButton from "../playlist/AddToPlaylistButton";
import Comment from "../comment/Comment";
import LikeBtn from "./LikeBtn";
import SaveBtn from "./SaveBtn";

export default function VideoPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const { loading, currentVideo, error } = useSelector((state) => state.video);

  const { currentVideo, loading, error } = useSelector(
    (state) => state.video,
    (prev, next) => prev.currentVideo === next.currentVideo
  );

  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSkip, setShowSkip] = useState({ type: null, visible: false });

  useEffect(() => {
    if (id) {
      dispatch(getVideoById(id));
      dispatch(incrementView(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    const handleKeyDown = (e) => {
      if (!videoRef.current) return;
      if (e.key === "ArrowLeft") {
        videoRef.current.currentTime -= 10;
        triggerSkipFeedback("backward");
      } else if (e.key === "ArrowRight") {
        videoRef.current.currentTime += 10;
        triggerSkipFeedback("forward");
      } else if (e.key === " ") {
        e.preventDefault();
        togglePlay();
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPlaying]);

  const triggerSkipFeedback = (type) => {
    setShowSkip({ type, visible: true });
    setTimeout(() => setShowSkip({ type: null, visible: false }), 700);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) videoRef.current.pause();
    else videoRef.current.play().catch((err) => console.error(err));
    setIsPlaying((prev) => !prev);
  };

  const onTimeUpdate = () => {
    if (!videoRef.current) return;
    setProgress((videoRef.current.currentTime / duration) * 100);
  };

  const onLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
    videoRef.current.volume = volume;
    videoRef.current.playbackRate = playbackRate;
  };

  const handleSeek = (e) => {
    if (!videoRef.current) return;
    const value = e.target.value;
    videoRef.current.currentTime = (value / 100) * duration;
    setProgress(value);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) videoRef.current.volume = newVolume;
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    if (volume > 0) {
      setVolume(0);
      videoRef.current.volume = 0;
    } else {
      setVolume(1);
      videoRef.current.volume = 1;
    }
  };

  const handlePlaybackRateChange = (e) => {
    const newRate = parseFloat(e.target.value);
    setPlaybackRate(newRate);
    if (videoRef.current) videoRef.current.playbackRate = newRate;
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen?.();
    }
  };

  const handleSkip = (type) => {
    if (!videoRef.current) return;
    if (type === "backward") {
      videoRef.current.currentTime -= 10;
    } else {
      videoRef.current.currentTime += 10;
    }
    triggerSkipFeedback(type);
  };

  const formatTime = (sec = 0) => {
    const minutes = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor(sec % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4 p-4 sm:p-6 max-w-4xl mx-auto w-full">
        <Skeleton height={400} className="rounded-2xl" />
        <Skeleton height={24} width="60%" className="rounded-lg" />
        <Skeleton height={16} width="40%" className="rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 sm:p-6 max-w-4xl mx-auto w-full bg-red-200 border-l-4 border-red-700 text-red-900 rounded-lg shadow-md"
      >
        <p className="font-medium text-center">Error: {error}</p>
      </motion.div>
    );
  }

  if (!currentVideo) return null;

  return (
    <div
      ref={containerRef}
      className="min-h-screen pb-20 bg-gradient-to-br from-slate-800 to-gray-900 py-6 px-4 sm:px-6 lg:px-8"
    >
      {/* Top bar */}
      <div className="max-w-6xl mx-auto flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-300 hover:text-white flex items-center space-x-1 font-medium transition-colors"
        >
          <span className="text-lg">←</span>
          <span>Back</span>
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-4xl bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#0f2027] backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Video */}
        <div className="relative bg-black">
          <video
            ref={videoRef}
            src={currentVideo.videoUrl}
            poster={currentVideo.thumbnailUrl}
            className="w-full object-cover cursor-pointer"
            onTimeUpdate={onTimeUpdate}
            onLoadedMetadata={onLoadedMetadata}
            onClick={togglePlay}
          />

          {/* Double Click Hotzones */}
          <div className="absolute inset-x-0 inset-y-16 flex items-stretch pointer-events-none">
            <div 
              className="w-1/2 pointer-events-auto" 
              onDoubleClick={() => handleSkip("backward")}
              onClick={togglePlay}
            />
            <div 
              className="w-1/2 pointer-events-auto" 
              onDoubleClick={() => handleSkip("forward")}
              onClick={togglePlay}
            />
          </div>

          {/* Skip Visual Feedback */}
          {showSkip.visible && (
            <div className={`absolute inset-0 flex items-center justify-center pointer-events-none`}>
               <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1.2 }}
                exit={{ opacity: 0 }}
                className="bg-black/50 text-white rounded-full p-6 flex flex-col items-center backdrop-blur-sm"
              >
                {showSkip.type === "forward" ? (
                  <>
                    <span className="text-4xl">⏩</span>
                    <span className="text-xl font-bold">+10s</span>
                  </>
                ) : (
                  <>
                    <span className="text-4xl">⏪</span>
                    <span className="text-xl font-bold">-10s</span>
                  </>
                )}
              </motion.div>
            </div>
          )}

          {/* Controls Overlay */}
          <div className="absolute bottom-2 left-2 right-2 bg-black/40 backdrop-blur-md p-2 rounded-md flex flex-col gap-2">
            {/* Progress Bar */}
            <input
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={progress}
              onChange={handleSeek}
              className="w-full h-2 bg-gray-700 rounded-full cursor-pointer accent-yellow-500"
            />
            <div className="flex justify-between items-center text-white text-sm">
              <span>{formatTime((progress / 100) * duration)}</span>
              <div className="flex items-center gap-2">
                {/* Play / Pause */}
                <button
                  onClick={togglePlay}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20"
                >
                  {isPlaying ? <FaPause /> : <FaPlay />}
                </button>

                {/* Volume */}
                <button
                  onClick={toggleMute}
                  className="p-2 rounded-full hover:bg-white/10"
                >
                  {volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 rounded-full accent-yellow-500"
                />

                {/* Playback Speed */}
                <select
                  value={playbackRate}
                  onChange={handlePlaybackRateChange}
                  className="bg-gray-800 text-white rounded px-2 py-1 text-xs"
                >
                  <option value="0.5">0.5x</option>
                  <option value="1">1x</option>
                  <option value="1.25">1.25x</option>
                  <option value="1.5">1.5x</option>
                  <option value="2">2x</option>
                  <option value="2.5">2.5x</option>
                </select>

                {/* Fullscreen */}
                <button
                  onClick={toggleFullscreen}
                  className="p-2 rounded-full hover:bg-white/10"
                >
                  {isFullscreen ? <FaCompress /> : <FaExpand />}
                </button>
              </div>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        {/* Video Details */}
        <div className="p-4 sm:p-6 md:p-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 line-clamp-2">
            {currentVideo.title}
          </h1>
          <p className="text-gray-400 text-sm mb-4">
            {currentVideo.description}
          </p>

          {/* Channel Info */}
          <div className="flex items-center justify-between mt-2">
            {/* Left: Creator avatar + name */}
            <div className="flex items-center gap-2">
              <img
                src={
                  currentVideo.uploadedBy?.profileImage || "/default-avatar.png"
                }
                alt={currentVideo.uploadedBy?.name || "Unknown"}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="text-gray-200 text-xs font-medium">
                {currentVideo.uploadedBy?.name || "Unknown"}
              </span>
            </div>

            {/* Right: Like + Save buttons */}
            <div className="flex items-center gap-3">
              <LikeBtn videoId={currentVideo._id} />
              <SaveBtn videoId={currentVideo._id} />
            </div>
          </div>
        </div>
        <AddToPlaylistButton videoId={currentVideo._id} />

        {/* 💬 Comment Section */}
        <Comment videoId={currentVideo._id} />
      </motion.div>
    </div>
  );
}
