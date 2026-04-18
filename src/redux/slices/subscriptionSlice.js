import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api/subscriptionAPI";

// 🎯 Thunk: Toggle Subscription
export const toggleSubscription = createAsyncThunk(
  "subscription/toggleSubscription",
  async (creatorId, { rejectWithValue }) => {
    try {
      const { data } = await api.toggleSubscriptionAPI(creatorId);
      // console.log("🧠 toggleSubscription response:", data);

      return {
        creatorId,
        subscribed: data.subscribed,
        subscriber: data.subscriber,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to toggle subscription."
      );
    }
  }
);

// 🎯 Get subscribed creators list
export const getSubscribedCreatorsThunk = createAsyncThunk(
  "subscription/getSubscribedCreators",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await api.getSubscribedCreators(userId);
      return data.subscribedTo;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch subscribed creators"
      );
    }
  }
);

// 🧍 Fetch one creator
export const fetchCreatorById = createAsyncThunk(
  "creator/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.getCreatorByIdAPI(id);
      console.log("fetchCreatorById data ", data);
  
      return {
        creator: data.creator,
        subscribers: data.subscribers,
        subscriberCount: data.subscriberCount,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch creator"
      );
    }
  }
);

// 👥 Fetch all creators
export const fetchCreators = createAsyncThunk(
  "creator/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.getCreatorsAPI();
      console.log("data res fetchCreators", data.creators);
      return data.creators;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch creators"
      );
    }
  }
);

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState: {
    subscribers: [],
    subscribedCreators: [],
    creators: [],
    currentCreator: null,
    loading: false,
    error: null,
    subscribed: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    // 👥 All Creators
    builder
      .addCase(fetchCreators.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCreators.fulfilled, (state, action) => {
        state.loading = false;
        state.creators = action.payload;
      })
      .addCase(fetchCreators.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 👥 fetchCreatorByI
      .addCase(fetchCreatorById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCreatorById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCreator = action.payload;
      })
      .addCase(fetchCreatorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 👥 toggle Subscription
      .addCase(toggleSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(toggleSubscription.fulfilled, (state, action) => {
        state.loading = false;

        const { creatorId, subscribed, subscriber } = action.payload;

        // 🟢 Update in creators list
        const creatorInList = state.creators.find((c) => c._id === creatorId);
        if (creatorInList) {
          creatorInList.isSubscribed = subscribed;
          creatorInList.subscriberCount += subscribed ? 1 : -1;
        }

        // 🟣 Update in single currentCreator page (nested structure)
        if (
          state.currentCreator &&
          state.currentCreator.creator._id === creatorId
        ) {
          state.currentCreator.creator.isSubscribed = subscribed;

          // ✅ Ensure subscribers is always an array
          if (!Array.isArray(state.currentCreator.subscribers)) {
            state.currentCreator.subscribers = [];
          }

          if (subscribed) {
            // Add new subscriber object if not already present
            const alreadyExists = state.currentCreator.subscribers.some(
              (sub) => sub._id === subscriber._id
            );
            if (!alreadyExists) {
              state.currentCreator.subscribers.push(subscriber);
            }
          } else {
            // Remove subscriber
            state.currentCreator.subscribers =
              state.currentCreator.subscribers.filter(
                (sub) => sub._id !== subscriber._id
              );
          }

          // ✅ Adjust subscriber count safely
          state.currentCreator.subscriberCount = Math.max(
            0,
            (state.currentCreator.subscriberCount || 0) + (subscribed ? 1 : -1)
          );
        }
      })

      // ❌ Rejected
      .addCase(toggleSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

   
      // ✅ Get Subscribed Creators
      .addCase(getSubscribedCreatorsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSubscribedCreatorsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.subscribedCreators = action.payload;
      })
      .addCase(getSubscribedCreatorsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default subscriptionSlice.reducer;
