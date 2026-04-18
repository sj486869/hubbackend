import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { deleteUser } from "../../redux/slices/userSlice";
import {
    FaUserCircle,
    FaEnvelope,
    FaTransgender,
    FaTrash,
    FaEdit,
    FaPlusCircle,
    FaChartPie,
    FaRocket
} from "react-icons/fa";

const UserAccount = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentUser, error } = useSelector((state) => state.user);

    const handleDeleteAccount = async () => {
        if (
            !window.confirm(
                "Are you sure you want to delete your account? This action cannot be undone."
            )
        ) {
            return;
        }
        try {
            await dispatch(deleteUser()).unwrap();
            toast.success("Account deleted successfully!");
            navigate("/login");
        } catch (err) {
            toast.error(err || "Failed to delete account");
        }
    };

    const handleUpdateProfile = () => {
        navigate(`/update-profile/${currentUser.id}`);
    };

    const handleCreateProduct = () => {
        navigate("/upload-video");
    };

    const handleDashboard = () => {
        navigate("/creator/dashboard");
    };

    const handleUpgradeSeller = () => {
        navigate("/become-creator");
    };

    if (!currentUser) {
        return (
            <div className="text-center py-12 text-lg font-medium text-gray-400">
                No user data available. Please log in.
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="min-h-screen flex items-center justify-center bg-[#111827]  pt-6 pb-16 px-4 sm:px-6 sm:pb-10 lg:px-8"
        >
            <div className="max-w-3xl w-full space-y-8  bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#2c5364] py-12 p-10 rounded-2xl shadow-2xl border border-[#2f2f2f]">
                {/* Profile Header */}
                <div className="flex flex-col items-center space-y-4">
                    {currentUser.profileImage ? (
                        <img
                            src={currentUser.profileImage}
                            alt="Profile"
                            className="h-28 w-28 rounded-full object-cover shadow-md border-2 border-[#ff7b54]"
                        />
                    ) : (
                        <FaUserCircle className="h-28 w-28 text-gray-500" />
                    )}
                    <h2 className="text-2xl font-bold text-white">
                        {currentUser.name || "Unnamed User"}
                    </h2>
                    <p className="text-gray-400 text-sm">
                        Manage your Video player profile 🎵
                    </p>
                </div>

                {/* User Information */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className=" bg-[#111827] p-4 rounded-xl shadow-sm flex items-center gap-3 border border-[#2f2f2f]">
                        <FaEnvelope className="text-orange-400 text-xl" />
                        <div>
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="text-sm font-medium text-gray-200">
                                {currentUser.email || "Not set"}
                            </p>
                        </div>
                    </div>

                    <div className=" bg-[#111827] p-4 rounded-xl shadow-sm flex items-center gap-3 border border-[#2f2f2f]">
                        <FaTransgender className="text-pink-400 text-xl" />
                        <div>
                            <p className="text-xs text-gray-500">Gender</p>
                            <p className="text-sm font-medium text-gray-200">
                                {currentUser.gender || "Not set"}
                            </p>
                        </div>
                    </div>

                    <div className=" bg-[#111827] p-4 rounded-xl shadow-sm flex items-center gap-3 border border-[#2f2f2f]">
                        <FaUserCircle className="text-green-400 text-xl" />
                        <div>
                            <p className="text-xs text-gray-500">Account ID</p>
                            <p className="text-sm font-medium text-gray-200">
                                {currentUser.id || "Not available"}
                            </p>
                        </div>
                    </div>
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                    <button
                        onClick={handleUpdateProfile}
                        className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-md hover:from-purple-700 hover:to-indigo-700 transition"
                    >
                        <FaEdit /> Update Profile
                    </button>

                    {currentUser.role === "creator" ? (
                        <>
                            <button
                                onClick={handleCreateProduct}
                                className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold shadow-md hover:from-blue-700 hover:to-cyan-700 transition"
                            >
                                <FaPlusCircle /> Upload Video
                            </button>

                            <button
                                onClick={handleDashboard}
                                className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold shadow-md hover:from-teal-700 hover:to-emerald-700 transition"
                            >
                                <FaChartPie /> Dashboard
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleUpgradeSeller}
                            className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold shadow-md hover:from-pink-700 hover:to-purple-700 transition"
                        >
                            <FaRocket /> Become Creator
                        </button>
                    )}

                    <button
                        onClick={handleDeleteAccount}
                        className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold shadow-md hover:from-red-700 hover:to-orange-700 transition"
                    >
                        <FaTrash /> Delete Account
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default UserAccount;
