import React from "react";
import { Routes, Route } from "react-router-dom";
import AppAuthLayout from "./AppAuthLayout";
import AppMainLayout from "./AppMainLayout";

import Home from "../pages/home/Home";
import Signup from "../pages/register/Signup";
import Login from "../pages/register/Login";
import UploadVideo from "../pages/video/UploadVideo";
import VideoList from "../pages/video/VideoList";
import VideoPlayer from "../pages/video/VideoPlayer";
import BecomeCreator from "../pages/creator/BecomeCreator";
import UserAccount from "../pages/user/UserAccount";
import UpdateUser from "../pages/user/UpdateUser";

import CreatePlaylist from "../pages/playlist/CreatePlaylist";
import PlaylistDetails from "../pages/playlist/PlaylistDetails";

import UpdateVideo from "../pages/creator/UpdateVideo";
import VideoSearchPage from "../pages/search/VideoSearchPage";

import AllCreators from "../pages/creator/AllCreators";
import CreatorChannel from "../pages/creator/CreatorChannel";
import CreatorDashboard from "../pages/creator/CreatorDashboard";
import AllSubscriptions from "../pages/subscribe/AllSubscriptions";
import MyLibrary from "../pages/playlist/MyLibrary";

export default function AppRoutes() {
  return (
    <Routes>
      {/* AUTH ROUTES */}
      <Route element={<AppAuthLayout />}>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Route>

      {/* MAIN APP ROUTES */}
      <Route element={<AppMainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/upload-video" element={<UploadVideo />} />
        <Route path="/video-lists" element={<VideoList />} />
        <Route path="/video/:id" element={<VideoPlayer />} />
        <Route path="/become-creator" element={<BecomeCreator />} />
        <Route path="/user-account" element={<UserAccount />} />
        <Route path="/update-profile/:id" element={<UpdateUser />} />
        <Route path="/my-library" element={<MyLibrary />} />
        <Route path="/create-playlist" element={<CreatePlaylist />} />
        <Route path="/playlist/:id" element={<PlaylistDetails />} />

        <Route path="/creator/dashboard" element={< CreatorDashboard />} />
        <Route path="/creator/video/:id" element={<UpdateVideo />} />
        <Route path="/search-video" element={<VideoSearchPage />} />

        <Route path="/creators" element={<AllCreators />} />
        <Route path="/AllSubscriptions" element={<AllSubscriptions />} />
        <Route path="/creator/:creatorId" element={<CreatorChannel />} />
      </Route>
    </Routes>
  );
}
