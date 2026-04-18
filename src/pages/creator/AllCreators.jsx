import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCreators } from "../../redux/slices/subscriptionSlice";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
const AllCreators = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { creators, loading, error } = useSelector(
    (state) => state.subscription
  );

  useEffect(() => {
    dispatch(fetchCreators());
  }, [dispatch]);

  if (loading)
    return (
      <p className="text-center text-lg font-semibold mt-10">Loading...</p>
    );

  if (error)
    return (
      <p className="text-center text-red-500 font-semibold mt-10">{error}</p>
    );

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Go Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-4 text-gray-200 hover:text-white transition"
      >
        <FaArrowLeft /> Go Back
      </button>
      <h1 className="text-4xl font-bold mb-8 text-center text-white">
        All Creators
      </h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {creators.map((creator) => (
          <Link
            key={creator._id}
            to={`/creator/${creator._id}`}
            className="bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 transition-transform transform hover:scale-105 rounded-3xl shadow-lg hover:shadow-xl p-6 flex flex-col items-center text-center"
          >
            <div className="relative w-24 h-24 mb-4">
              <img
                src={
                  creator.profileImage ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt={creator.name}
                className="w-full h-full rounded-full object-cover ring-2 ring-green-500"
              />
            </div>
            <h3 className="text-xl font-semibold text-white mb-1">
              {creator.name}
            </h3>
            <p className="text-gray-400 text-sm mb-3">
              {creator.subscribersCount} subscribers
            </p>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-full text-sm font-medium transition">
              View Profile
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AllCreators;
