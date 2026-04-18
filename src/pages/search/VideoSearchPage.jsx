import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import VideoSearch from "./VideoSearch";
import VideoSearchResult from "./VideoSearchResult";

const VideoSearchPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const queryFromUrl = queryParams.get("q") || "";

  const [query, setQuery] = useState(queryFromUrl);

  useEffect(() => {
    setQuery(queryFromUrl);
  }, [queryFromUrl]);

  return (
    <div className="min-h-screen bg-[#111827]">
      <VideoSearch query={query} setQuery={setQuery} />
      <VideoSearchResult query={query} />
    </div>
  );
};

export default VideoSearchPage;
