import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaUserShield } from "react-icons/fa";
import { upgradeCreator } from "../../redux/slices/userSlice";

const BecomeCreator = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, upgradeCreatorLoading, error } = useSelector((state) => state.user);

  const handleUpgrade = async () => {
    if (currentUser?.role === "creator") {
      toast.info("You are already a creator!");
      return;
    }

    try {
      await dispatch(upgradeCreator()).unwrap();
      toast.success("Successfully upgraded to creator!");
      navigate("/user-account");
    } catch (err) {
      toast.error(err || "Failed to upgrade to creator");
    }
  };

  return (
    <div className="min-h-screen bg-[#111827] flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#2c5364] p-8 sm:p-10 rounded-3xl shadow-2xl max-w-md w-full border border-gray-700"
      >
        {/* Heading */}
        <h2 className="text-xl sm:text-3xl font-bold text-center text-white mb-8 flex items-center justify-center gap-2">
          <FaUserShield /> Become a Creator
        </h2>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-center mb-4 font-medium">{error}</p>
        )}

        {/* Description */}
        <div className="text-center text-gray-300 mb-6">
          <p>Upgrade your account to start uploading on our platform!</p>
        </div>

        {/* Upgrade Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleUpgrade}
          disabled={upgradeCreatorLoading || currentUser?.role === "creator"}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {upgradeCreatorLoading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Upgrading...
            </span>
          ) : (
            "Upgrade to Creator"
          )}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default BecomeCreator;
