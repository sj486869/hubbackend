import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import * as api from "../api/userAPI";

// --- Thunks ---

export const signupUser = createAsyncThunk(
  "user/signupUser",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.signupUser(formData);

      console.log("Signup data", res.data.user);

      return { user: res.data.user, token: res.data.token };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Signup failed ");
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.loginUser(data);
      console.log("login data", res.data.user);
      return { user: res.data.user, token: res.data.token };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

export const upgradeCreator = createAsyncThunk(
  "user/upgradeCreator",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.upgradeCreator();

      // console.log("🔍 res.data.user", res.data.user);
      return res.data.user;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to upgrade to seller"
      );
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  "user/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.fetchCurrentUser();

      console.log("CurrentUser", res.data.user);
      return res.data.user;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Auth check failed"
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await api.logoutUser();
      return null;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Logout failed");
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({ userId, formData }, { rejectWithValue }) => {
    try {
      const res = await api.updateUser(userId, formData);

      // console.log("🔍 updateUser res.data.user", res.data.user);
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Update failed");
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.deleteUser();
      console.log("res.data.message",res.data.message)
      return res.data.message; // or nothing
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Delete failed");
    }
  }
);

// --- Slice ---

const userSlice = createSlice({
  name: "authUser",
  initialState: {
    currentUser: null,
    token: null,
    loading: false,
    loginLoading: false,
    fetchUserLoading: false,
    updateUserLoading: false,
    upgradeCreatorLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    reset: (state) => {
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.currentUser = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //Login
      .addCase(loginUser.pending, (state) => {
        state.loginLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.currentUser = action.payload.user;
        state.token = action.payload.token;
        state.loginLoading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload;
        state.loginLoading = false;
      })

      // Auth Check
      .addCase(fetchCurrentUser.pending, (state) => {
        state.fetchUserLoading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.currentUser = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.error = action.payload;
         state.fetchUserLoading = false;

      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.currentUser = null;
        state.token = null;
      })

      // upgradeCreator
      .addCase(upgradeCreator.pending, (state) => {
        state.upgradeCreatorLoading = true;
        state.error = null;
      })
      .addCase(upgradeCreator.fulfilled, (state, action) => {
        state.currentUser = action.payload;

        state.upgradeCreatorLoading = false;
      })
      .addCase(upgradeCreator.rejected, (state, action) => {
        state.upgradeCreatorLoading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateUser.pending, (state) => {
        state.updateUserLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.updateUserLoading = false;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteUser.fulfilled, (state) => {
        state.currentUser = null;
        state.token = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});
export const { clearError, reset } = userSlice.actions;
export default userSlice.reducer;
