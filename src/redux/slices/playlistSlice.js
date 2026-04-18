// 📁 src/redux/playlistSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api/playlistAPI";

// 🎥 Create Playlist
export const createPlaylist = createAsyncThunk(
  "playlists/create",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.createPlaylistAPI(formData);
      return data.playlist;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 🎥 Get All User Playlists
export const getUserPlaylists = createAsyncThunk(
  "playlists/getUserPlaylists",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.getUserPlaylistsAPI();
      return data.playlists;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 🎥 Get Playlist by ID
export const getPlaylistById = createAsyncThunk(
  "playlists/getPlaylistById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.getPlaylistByIdAPI(id);
      return data.playlist;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 🎥 Update Playlist
export const updatePlaylist = createAsyncThunk(
  "playlists/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data } = await api.updatePlaylistAPI(id, formData);
      console.log("data res: updatePlaylist",data.updatedPlaylist)
      return data.updatedPlaylist;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 🎥 Delete Playlist
export const deletePlaylist = createAsyncThunk(
  "playlists/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.deletePlaylistAPI(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 🎥 Add Video to Playlist
export const addVideoToPlaylist = createAsyncThunk(
  "playlists/addVideo",
  async ({ playlistId, videoId }, { rejectWithValue }) => {
    try {
      const { data } = await api.addVideoToPlaylistAPI(playlistId, videoId);
      return data.playlist;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 🎥 Remove Video from Playlist
export const removeVideoFromPlaylist = createAsyncThunk(
  "playlists/removeVideo",
  async ({ playlistId, videoId }, { rejectWithValue }) => {
    try {
      const { data } = await api.removeVideoFromPlaylistAPI(playlistId, videoId);
      return data.playlist;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 🧩 Slice
const playlistSlice = createSlice({
  name: "playlists",
  initialState: {
    playlists: [],
    currentPlaylist: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearPlaylistError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 Create Playlist
      .addCase(createPlaylist.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPlaylist.fulfilled, (state, action) => {
        state.loading = false;
        state.playlists.unshift(action.payload);
      })
      .addCase(createPlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Get All Playlists
      .addCase(getUserPlaylists.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserPlaylists.fulfilled, (state, action) => {
        state.loading = false;
        state.playlists = action.payload;
      })
      .addCase(getUserPlaylists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Get Playlist by ID
      .addCase(getPlaylistById.fulfilled, (state, action) => {
        state.currentPlaylist = action.payload;
      })

      // 🔹 Update Playlist
      .addCase(updatePlaylist.fulfilled, (state, action) => {
        state.playlists = state.playlists.map((p) =>
          p._id === action.payload._id ? action.payload : p
        );
        if (state.currentPlaylist?._id === action.payload._id) {
          state.currentPlaylist = action.payload;
        }
      })

      // 🔹 Delete Playlist
      .addCase(deletePlaylist.fulfilled, (state, action) => {
        state.playlists = state.playlists.filter(
          (p) => p._id !== action.payload
        );
      })

      // 🔹 Add Video / Remove Video
      .addCase(addVideoToPlaylist.fulfilled, (state, action) => {
        if (state.currentPlaylist?._id === action.payload._id) {
          state.currentPlaylist = action.payload;
        }
      })
      .addCase(removeVideoFromPlaylist.fulfilled, (state, action) => {
        if (state.currentPlaylist?._id === action.payload._id) {
          state.currentPlaylist = action.payload;
        }
      });
  },
});

export const { clearPlaylistError } = playlistSlice.actions;
export default playlistSlice.reducer;
