import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../redux/slices/userSlice";
import videoReducer from "../redux/slices/videoSlice";
import playlistReducer from "../redux/slices/playlistSlice";
import commentReducer from "../redux/slices/commentSlice"
import subscriptionReducer from "../redux/slices/subscriptionSlice"
export const store = configureStore({
  reducer: {
    user: userReducer,
    video: videoReducer ,
    playlist: playlistReducer,
    comment:commentReducer,
    subscription:subscriptionReducer,
   
  },
});
