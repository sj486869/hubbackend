import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import moment from "moment";
import {
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaExpand,
  FaCompress,
} from "react-icons/fa";
import { getVideoById, incrementView, getAllVideos } from "../../redux/slices/videoSlice";
import VideoCard from "./VideoCard";
import AddToPlaylistButton from "../playlist/AddToPlaylistButton";
import Comment from "../comment/Comment";
import LikeBtn from "./LikeBtn";
import SaveBtn from "./SaveBtn";

export default function VideoPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const { loading, currentVideo, error } = useSelector((state) => state.video);

  const { currentVideo, loading, error, videos: allVideos } = useSelector(
    (state) => state.video,
    (prev, next) => prev.currentVideo === next.currentVideo && prev.videos === next.videos
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
  const [ripples, setRipples] = useState([]);

  useEffect(() => {
    if (id) {
      dispatch(getVideoById(id));
      dispatch(incrementView(id));
      // Fetch more videos for the "Recommended" section
      dispatch(getAllVideos({ limit: 12 }));
    }
  }, [id, dispatch]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    const handleKeyDown = (e) => {
      if (!videoRef.current) return;
      if (e.key === "ArrowLeft") {
        handleSkip("backward");
      } else if (e.key === "ArrowRight") {
        handleSkip("forward");
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

  const [lastTap, setLastTap] = useState({ time: 0, side: null });
  const tapTimer = useRef(null);

  const triggerSkipFeedback = (type) => {
    setShowSkip({ type, visible: true });
    
    // Add multiple ripples for a "premium" feel
    const id = Date.now();
    setRipples(prev => [...prev, { id, type }]);
    
    setTimeout(() => {
      setShowSkip({ type: null, visible: false });
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 800);
  };

  const handleTap = (side) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (lastTap.side === side && now - lastTap.time < DOUBLE_TAP_DELAY) {
      // Double tap detected
      if (tapTimer.current) {
        clearTimeout(tapTimer.current);
        tapTimer.current = null;
      }
      handleSkip(side === "left" ? "backward" : "forward");
      setLastTap({ time: 0, side: null }); // Reset
    } else {
      // First tap detected
      setLastTap({ time: now, side });
      
      // Delay single tap action (Play/Pause)
      if (tapTimer.current) clearTimeout(tapTimer.current);
      tapTimer.current = setTimeout(() => {
        togglePlay();
        setLastTap({ time: 0, side: null });
        tapTimer.current = null;
      }, DOUBLE_TAP_DELAY);
    }
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
    const skipAmount = 10;
    if (type === "backward") {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - skipAmount);
      triggerSkipFeedback("backward");
    } else {
      videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + skipAmount);
      triggerSkipFeedback("forward");
    }
  };

  const formatTime = (sec = 0) => {
    const minutes = Math.floor(sec / 60).toString().padStart(2, "0");
    const seconds = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  if (loading && !currentVideo) {
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

  // Filter out the current video from recommendations
  const relatedVideos = allVideos?.filter(v => v._id !== currentVideo._id).slice(0, 10) || [];

  return (
    <div className="min-h-screen pb-24 bg-[#0f172a] sm:bg-gradient-to-br sm:from-slate-800 sm:to-gray-900 py-0 sm:py-6 sm:px-4 md:px-6 lg:px-8">
      {/* Top bar */}
      <div className="max-w-6xl mx-auto flex items-center mb-2 sm:mb-6 p-4 sm:p-0">
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
        className={`w-full max-w-4xl mx-auto bg-gray-900 sm:bg-[#0f172a]/80 sm:backdrop-blur-2xl shadow-2xl overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 max-w-none rounded-none' : 'rounded-none sm:rounded-2xl'}`}
      >
        {/* Video Container */}
        <div ref={containerRef} className={`relative bg-black group/player ${isFullscreen ? 'w-full h-full flex items-center justify-center' : 'w-full aspect-video flex items-center justify-center'}`}>
          <video
            ref={videoRef}
            src={currentVideo.videoUrl}
            poster={currentVideo.thumbnailUrl}
            className={`cursor-pointer ${isFullscreen ? 'h-full w-full object-contain' : 'w-full object-cover'}`}
            onTimeUpdate={onTimeUpdate}
            onLoadedMetadata={onLoadedMetadata}
          />

          {/* New Tap & Skip Hotzones */}
          <div className="absolute inset-0 flex items-stretch">
            {/* Left Skip Zone */}
            <div className="w-1/3 group relative overflow-hidden" onClick={() => handleTap("left")}>
               {/* Ripples */}
               <AnimatePresence>
                 {ripples.filter(r => r.type === "backward").map(r => (
                   <motion.div
                     key={r.id}
                     initial={{ scale: 0, opacity: 0.5 }}
                     animate={{ scale: 2.5, opacity: 0 }}
                     exit={{ opacity: 0 }}
                     transition={{ duration: 0.6, ease: "easeOut" }}
                     className="absolute top-1/2 left-0 -translate-y-1/2 w-48 h-48 bg-white/10 rounded-full"
                   />
                 ))}
               </AnimatePresence>
            </div>

            {/* Center Toggle Zone */}
            <div className="flex-1" onClick={togglePlay} />

            {/* Right Skip Zone */}
            <div className="w-1/3 group relative overflow-hidden text-right" onClick={() => handleTap("right")}>
               {/* Ripples */}
               <AnimatePresence>
                 {ripples.filter(r => r.type === "forward").map(r => (
                   <motion.div
                     key={r.id}
                     initial={{ scale: 0, opacity: 0.5 }}
                     animate={{ scale: 2.5, opacity: 0 }}
                     exit={{ opacity: 0 }}
                     transition={{ duration: 0.6, ease: "easeOut" }}
                     className="absolute top-1/2 right-0 -translate-y-1/2 w-48 h-48 bg-white/10 rounded-full"
                   />
                 ))}
               </AnimatePresence>
            </div>
          </div>

          {/* Skip Visual Feedback Overlay (YouTube Style) */}
          <AnimatePresence>
            {showSkip.visible && (
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none z-30">
                 <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: showSkip.type === "forward" ? 40 : -40 }}
                  animate={{ opacity: 1, scale: 1.1, x: showSkip.type === "forward" ? 60 : -60 }}
                  exit={{ opacity: 0, scale: 1.5 }}
                  className="bg-black/60 text-white rounded-full p-8 flex flex-col items-center backdrop-blur-md border border-white/10 shadow-2xl"
                >
                  <div className="text-4xl mb-1">
                    {showSkip.type === "forward" ? "⏩" : "⏪"}
                  </div>
                  <div className="text-lg font-black uppercase tracking-widest text-orange-500">
                    {showSkip.type === "forward" ? "+10s" : "-10s"}
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Controls Overlay */}
          <div className={`absolute left-2 right-2 bg-black/40 backdrop-blur-md p-2 rounded-xl flex flex-col gap-2 transition-opacity duration-300 ${isPlaying && !isFullscreen ? 'opacity-0 hover:opacity-100 group-hover/player:opacity-100' : 'opacity-100'} ${isFullscreen ? 'bottom-8 mx-auto max-w-4xl z-[60]' : 'bottom-2'}`}>
            <input
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={progress}
              onChange={handleSeek}
              className="w-full h-1.5 bg-gray-700/50 rounded-full cursor-pointer accent-orange-500 hover:h-2 transition-all"
            />
            <div className="flex justify-between items-center text-white text-[10px] sm:text-xs font-medium">
              <span>{formatTime((progress / 100) * duration)}</span>
              <div className="flex items-center gap-3">
                <button onClick={togglePlay} className="p-2 transition-transform active:scale-95">
                  {isPlaying ? <FaPause className="text-sm" /> : <FaPlay className="text-sm" />}
                </button>

                <div className="hidden sm:flex items-center gap-2 group/volume">
                  <button onClick={toggleMute} className="p-1">
                    {volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
                  </button>
                  <input
                    type="range"
                    min="0" max="1" step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-0 group-hover/volume:w-20 transition-all h-1 rounded-full accent-orange-500"
                  />
                </div>

                <select
                  value={playbackRate}
                  onChange={handlePlaybackRateChange}
                  className="bg-transparent border border-white/20 text-white rounded px-2 py-0.5"
                >
                  {[0.5, 1, 1.25, 1.5, 2].map(r => <option key={r} value={r} className="bg-gray-900">{r}x</option>)}
                </select>

                <button onClick={toggleFullscreen} className="p-2">
                  {isFullscreen ? <FaCompress /> : <FaExpand />}
                </button>
              </div>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        {/* Video Details */}
        <div className="p-4 sm:p-6 md:p-8 border-t border-gray-800/50">
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-tight">
            {currentVideo.title}
          </h1>
          
          <div className="flex items-center gap-3 mb-6 text-xs text-gray-400">
             <span className="bg-white/5 px-2 py-1 rounded-full">{currentVideo.views?.toLocaleString()} views</span>
             <span className="bg-white/5 px-2 py-1 rounded-full">{moment(currentVideo.createdAt).fromNow()}</span>
          </div>

          {/* Description Box */}
          <div className="bg-white/5 rounded-2xl p-4 mb-8 border border-white/5">
             <p className="text-gray-300 text-sm leading-relaxed line-clamp-3 hover:line-clamp-none transition-all cursor-pointer">
               {currentVideo.description}
             </p>
          </div>

          {/* Channel Info & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t border-white/5 pt-6">
            <div className="flex items-center gap-4">
              <img
                src={currentVideo.uploadedBy?.profileImage || "/default-avatar.png"}
                alt={currentVideo.uploadedBy?.name}
                className="w-12 h-12 rounded-full ring-2 ring-orange-500/20"
              />
              <div>
                <h3 className="text-white font-bold">{currentVideo.uploadedBy?.name}</h3>
                <p className="text-gray-400 text-xs">{currentVideo.uploadedBy?.subscribersCount || 0} subscribers</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
               <LikeBtn videoId={currentVideo._id} />
               <SaveBtn videoId={currentVideo._id} />
               <AddToPlaylistButton videoId={currentVideo._id} />
            </div>
          </div>
        </div>

        {/* 💬 Comment Section */}
        <div className="bg-black/20 border-t border-white/5">
           <Comment videoId={currentVideo._id} />
        </div>

        {/* 🎞️ Recommended Videos Section */}
        <div className="p-4 sm:p-8 border-t border-white/10 bg-gradient-to-b from-transparent to-black/20">
           <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                 <span className="w-1.5 h-6 bg-orange-500 rounded-full" />
                 Recommended for You
              </h2>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedVideos.map((video) => (
                 <VideoCard key={video._id} video={video} />
              ))}
           </div>
           
           {relatedVideos.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                 No other videos found at the moment.
              </div>
           )}
        </div>
      </motion.div>
    </div>
  );
}
