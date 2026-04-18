import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as commentAPI from "../api/commentAPI";

// 💬 Add a comment to video
export const addComment = createAsyncThunk(
  "comments/addComment",
  async ({ videoId, text }, { rejectWithValue }) => {
    try {
      const { data } = await commentAPI.addCommentAPI(videoId, text);
      return data.comment;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to add comment"
      );
    }
  }
);

// 💭 Fetch comments for video
export const getVideoComments = createAsyncThunk(
  "comments/getVideoComments",
  async (videoId, { rejectWithValue }) => {
    try {
      const { data } = await commentAPI.getVideoCommentsAPI(videoId);
      return data.comments;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load comments"
      );
    }
  }
);

// ✏️ Update a comment
export const updateComment = createAsyncThunk(
  "comments/updateComment",
  async ({ commentId, text }, { rejectWithValue }) => {
    try {
      const { data } = await commentAPI.updateCommentAPI(commentId, text);
      return data.comment;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update comment"
      );
    }
  }
);

// 🗑️ Delete comment
export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async (commentId, { rejectWithValue }) => {
    try {
      await commentAPI.deleteCommentAPI(commentId);
      return commentId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete comment"
      );
    }
  }
);

// 💬 Reply to a comment
export const replyToComment = createAsyncThunk(
  "comments/replyToComment",
  async ({ commentId, text }, { rejectWithValue }) => {
    try {
      const { data } = await commentAPI.replyToCommentAPI(commentId, text);
      return { parentId: commentId, reply: data.reply };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to add reply"
      );
    }
  }
);

// ❤️ Like or unlike
export const likeOrUnlikeComment = createAsyncThunk(
  "comments/likeOrUnlikeComment",
  async (commentId, { rejectWithValue }) => {
    try {
      const { data } = await commentAPI.likeOrUnlikeCommentAPI(commentId);
      return { commentId, likesCount: data.likesCount };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to like/unlike"
      );
    }
  }
);

// 🧩 Slice
const commentSlice = createSlice({
  name: "comments",
  initialState: {
    comments: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Add comment
      .addCase(addComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments.unshift(action.payload);
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch comments
      .addCase(getVideoComments.pending, (state) => {
        state.loading = true;
      })
      .addCase(getVideoComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(getVideoComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      
      .addCase(updateComment.fulfilled, (state, action) => {
        const index = state.comments.findIndex(
          (c) => c._id === action.payload._id
        );
        if (index !== -1) {
          state.comments[index] = {
            ...state.comments[index], // keep old replies, likes, etc.
            ...action.payload, // update changed fields
          };
        }
      })

      // Delete comment
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter((c) => c._id !== action.payload);
      })

      // Reply to comment
      .addCase(replyToComment.fulfilled, (state, action) => {
        const parent = state.comments.find(
          (c) => c._id === action.payload.parentId
        );
        if (parent) {
          parent.replies = parent.replies || [];
          parent.replies.push(action.payload.reply);
        }
      })

      // Like/Unlike comment
      .addCase(likeOrUnlikeComment.fulfilled, (state, action) => {
        const comment = state.comments.find(
          (c) => c._id === action.payload.commentId
        );
        if (comment) comment.likesCount = action.payload.likesCount;
      });
  },
});

export default commentSlice.reducer;
