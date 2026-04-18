import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { toggleSubscription } from "../../redux/slices/subscriptionSlice";

const SubscribeBtn = ({ creatorId }) => {
  const dispatch = useDispatch();
  const { currentCreator, loading } = useSelector(
    (state) => state.subscription
  );
  console.log("currentCreator",currentCreator)
  const { currentUser } = useSelector((state) => state.user);

  // Local state for optimistic updates
  const [subscribed, setSubscribed] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [localLoading, setLocalLoading] = useState(false);

  // Initialize local state from Redux

  useEffect(() => {
    if (!currentCreator || !currentUser) return;
    if (!Array.isArray(currentCreator.subscribers)) return; // wait until subscribers exist

    const isSubscribed = currentCreator.subscribers.some(
      (sub) => sub?._id?.toString() === currentUser.id?.toString()
    );

    setSubscribed(isSubscribed);
    setSubscriberCount(currentCreator.subscriberCount || 0);
  }, [
    currentCreator?.subscribers?.length, // re-run when subscribers change length
    currentUser?.id,
  ]);

  const handleToggleSubscribe = async () => {
    if (!currentUser) {
      toast.error("Please log in to subscribe.");
      return;
    }
    if (!creatorId) {
      toast.error("Creator not found.");
      return;
    }

    const wasSubscribed = subscribed;

    // Optimistic UI update
    setSubscribed(!subscribed);
    setSubscriberCount((prev) => prev + (subscribed ? -1 : 1));
    setLocalLoading(true);

    try {
      await dispatch(toggleSubscription(creatorId)).unwrap();
    } catch (error) {
      // Revert on failure
      setSubscribed(wasSubscribed);
      setSubscriberCount((prev) => prev + (wasSubscribed ? 1 : -1));
      toast.error(error?.message || "Failed to toggle subscription.");
    } finally {
      setLocalLoading(false);
    }
  };

  if (!currentCreator || !currentUser) return null;

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      onClick={handleToggleSubscribe}
      disabled={localLoading || loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-colors duration-200 shadow-md
        ${
          subscribed
            ? "bg-gray-300 text-gray-900 hover:bg-gray-400"
            : "bg-red-600 text-white hover:bg-red-700"
        } ${localLoading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <span>{subscribed ? "Subscribed" : "Subscribe"}</span>
    </motion.button>
  );
};

export default SubscribeBtn;
