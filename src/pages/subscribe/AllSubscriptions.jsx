import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSubscribedCreatorsThunk } from "../../redux/slices/subscriptionSlice";
import { useNavigate } from "react-router-dom";

const AllSubscriptions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const { subscribedCreators, loading, error } = useSelector(
    (state) => state.subscription
  );
  
  useEffect(() => {
    if (currentUser?.id) {
      dispatch(getSubscribedCreatorsThunk(currentUser.id));
    }
  }, [dispatch, currentUser]);

  if (loading) return <p className="text-gray-300">Loading subscriptions...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen">
      <h1 className="text-3xl font-bold text-gray-100 mb-6">Subscribed Creators</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {subscribedCreators?.map((creator) => (
          <div
            key={creator._id}
            className="bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#0f2027] rounded-lg shadow-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate(`/creator/${creator._id}`)}
          >
            <div className="flex flex-col items-center p-6">
              <img
                src={
                  creator.profileImage ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt={creator.name}
                className="w-20 h-20 rounded-full border-2 border-gray-400 object-cover mb-4"
              />
              <h2 className="text-xl font-semibold text-gray-100">{creator.name}</h2>
              <p className="text-gray-300 text-sm mt-1">
                {creator.subscribersCount} subscribers
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllSubscriptions;
