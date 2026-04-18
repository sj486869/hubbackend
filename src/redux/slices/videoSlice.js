// 📁 src/redux/videoSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api/videoAPI";
import { fetchCurrentUser } from "./userSlice";
// ==============================
// 🔄 Async Thunks
// ==============================

// ➕ Upload new video
export const uploadVideo = createAsyncThunk(
  "videos/upload",
  async ({ formData, onUploadProgress }, { rejectWithValue }) => {
    try {
      const { data } = await api.uploadVideoAPI(formData, onUploadProgress);
       console.log("  data.video res:", data.video);
      return data.video;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 📜 Fetch all videos
export const getAllVideos = createAsyncThunk(
  "videos/getAll",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await api.getAllVideosAPI(params);
      // console.log(" data res from getAllVideos ", data);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 🔍 Get single video
export const getVideoById = createAsyncThunk(
  "videos/getById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.getVideoByIdAPI(id);
      console.log("  data.video res from getAllVideos ",  data.video);
      return data.video;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ✏️ Update video
export const updateVideo = createAsyncThunk(
  "videos/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data } = await api.updateVideoAPI(id, formData);
      return data.updatedVideo;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 🗑️ Delete video
export const deleteVideo = createAsyncThunk(
  "videos/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.deleteVideoAPI(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 👁️ Increment view
export const incrementView = createAsyncThunk(
  "videos/view",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.incrementViewAPI(id);
      console.log("  incrementView data res:", data);
      return { id, views: data.views };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ❤️ Like / Unlike
export const toggleLike = createAsyncThunk(
  "videos/like",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.toggleLikeAPI(id);
      console.log("data :", data);
      return {
        id,
        userId: data.userId,
        liked: data.liked,
        totalLikes: data.totalLikes,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 🔖 Save / Unsave
export const toggleSave = createAsyncThunk(
  "videos/save",
  async (videoId, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await api.toggleSaveAPI(videoId);
      dispatch(fetchCurrentUser());
      console.log(" data from toggleSave ", data);
      return { videoId, saved: data.saved };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 🎞️ Get creator videos
export const getCreatorVideos = createAsyncThunk(
  "videos/creator",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.getCreatorVideosAPI();
      console.log(" data from getCreatorVideos ", data);
      return data.videos;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ✅ Thunk: Get Top Videos
export const getTopVideosThunk = createAsyncThunk(
  "videos/getTopVideos",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.getTopVideos();
      // console.log(" data res from getTopVideosThunk ", data.topVideos);
      return data; 
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch top videos"
      );
    }
  }
);

// ==============================
// 🧠 Slice
// ==============================
const videoSlice = createSlice({
  name: "videos",
  initialState: {
    videos: [],
    creatorVideos: [],
    savedVideos: [],
    currentVideo: null,
    topVideos: [],
    topByLikes: [],
    topByViews: [],
    topByComments: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearVideoState: (state) => {
      state.currentVideo = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload
      .addCase(uploadVideo.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.videos.unshift(action.payload);
      })
      .addCase(uploadVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get all videos
      .addCase(getAllVideos.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.videos = action.payload.videos;
      })
      .addCase(getAllVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get single
      .addCase(getVideoById.fulfilled, (state, action) => {
        state.currentVideo = action.payload;
      })

      // Update
      .addCase(updateVideo.fulfilled, (state, action) => {
        const index = state.videos.findIndex(
          (v) => v._id === action.payload._id
        );
        if (index !== -1) state.videos[index] = action.payload;
      })

      // Delete
      .addCase(deleteVideo.fulfilled, (state, action) => {
        state.videos = state.videos.filter((v) => v._id !== action.payload);
      })

      // Like
      .addCase(toggleLike.fulfilled, (state, action) => {
        const { id, liked, totalLikes, userId } = action.payload;
        const video = state.currentVideo;

        if (video?._id === id) {
          video.likesCount = totalLikes;
          video.likes = video.likes || [];

          const alreadyLiked = video.likes.includes(userId);

          if (liked && !alreadyLiked) {
            video.likes.push(userId);
          } else if (!liked && alreadyLiked) {
            video.likes = video.likes.filter((id) => id !== userId);
          }
        }
      })

      // 🔖 Toggle Save Pending
      .addCase(toggleSave.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // 🔖 Toggle Save Fulfilled
      .addCase(toggleSave.fulfilled, (state, action) => {
        state.loading = false;
        const { videoId, saved } = action.payload;
        // ✅ Update savedVideos array
        if (saved) {
          if (!state.savedVideos.includes(videoId)) {
            state.savedVideos.push(videoId);
          }
        } else {
          state.savedVideos = state.savedVideos.filter((id) => id !== videoId);
        }

        // 🧠 Update videos list for consistency
        const video = state.videos.find((v) => v._id === videoId);

        if (video) {
          video.userSaved = saved;
        }
      })

      // 🔖 Toggle Save Rejected
      .addCase(toggleSave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // View
      .addCase(incrementView.fulfilled, (state, action) => {
        const { id, views } = action.payload;
        const video = state.videos.find((v) => v._id === id);
        if (video) video.views = views;
        if (state.currentVideo && state.currentVideo._id === id)
          state.currentVideo.views = views;
      })

      // Creator videos
      .addCase(getCreatorVideos.fulfilled, (state, action) => {
        state.creatorVideos = action.payload;
      })

       .addCase(getTopVideosThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTopVideosThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.topVideos = action.payload.topVideos;
        state.topByLikes = action.payload.topByLikes;
        state.topByViews = action.payload.topByViews;
        state.topByComments = action.payload.topByComments;
      })
      .addCase(getTopVideosThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      
  },
});

export const { clearVideoState } = videoSlice.actions;
export default videoSlice.reducer;
