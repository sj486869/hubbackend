import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/slices/userSlice";
import { FaSearch, FaUserCircle, FaSignOutAlt, FaBars } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

function Header({ toggleSidebar }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      setIsUserMenuOpen(false);
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedTerm = searchTerm.trim();
    if (!trimmedTerm) return;
    navigate(`/search-video?q=${encodeURIComponent(trimmedTerm)}`);
    setSearchTerm("");
    setIsMobileSearchOpen(false);
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Close dropdown if click is outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/10 p-2 text-gray-100 fixed top-0 z-50 w-full shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14 sm:h-16">
          {/* Menu + Logo */}
          <div className="flex items-center gap-3">
            {/* Large screen menu icon */}
            <button
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
              className="hidden lg:flex p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-orange-500 transition-all duration-300 border border-white/5 group"
            >
              <FaBars className="text-xl group-hover:rotate-180 transition-transform duration-500" />
            </button>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="flex items-center"
            >
              <Link to="/" className="flex items-center group">
                <span className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tighter text-white">
                  My
                </span>
                <span className="ml-1 px-1.5 py-0.5 bg-gradient-to-br from-orange-400 to-orange-600 text-slate-900 text-lg sm:text-xl lg:text-2xl font-black rounded-lg shadow-[0_0_20px_rgba(249,115,22,0.4)] group-hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] transition-all duration-300">
                  HUB
                </span>
              </Link>
            </motion.div>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden sm:flex flex-1 mx-6 lg:mx-12 max-w-3xl">
            <form
              onSubmit={handleSearch}
              className="flex rounded-2xl overflow-hidden border border-white/10 bg-white/5 w-full focus-within:border-orange-500/50 focus-within:bg-white/10 transition-all duration-300 group shadow-inner"
            >
              <input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                placeholder="Search premium videos..."
                className="flex-1 px-5 py-2.5 bg-transparent text-gray-100 placeholder-gray-500 focus:outline-none text-sm font-medium"
              />
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2.5 transition-all duration-300 flex items-center shadow-lg"
              >
                <FaSearch className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Mobile Icons (Search + User) */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile search icon */}
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="sm:hidden p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-orange-500 transition-all duration-300"
            >
              <FaSearch className="w-5 h-5" />
            </button>

            {/* User Menu */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center justify-center rounded-2xl p-0.5 sm:p-1 hover:ring-2 hover:ring-orange-500/50 transition-all duration-300"
              >
                {currentUser?.profileImage ? (
                  <img
                    src={currentUser.profileImage}
                    alt={currentUser.name}
                    className="h-9 w-9 sm:h-11 sm:w-11 rounded-2xl object-cover shadow-xl border border-white/10"
                    onError={(e) => (e.target.src = "/default-profile.png")}
                  />
                ) : (
                  <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg">
                    <FaUserCircle className="w-6 h-6 sm:w-8 h-8 text-slate-900" />
                  </div>
                )}
              </button>

              {/* Dropdown for all screens */}
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-gray-900 text-gray-100 rounded-lg shadow-xl py-2 z-50 border border-gray-700"
                  >
                    {currentUser ? (
                      <>
                        <Link
                          to="/user-account"
                          className="block px-4 py-2 text-sm hover:bg-gray-700 hover:text-orange-500"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Your Account
                        </Link>
                        {currentUser.role !== "creator" && (
                          <Link
                            to="/become-creator"
                            className="block px-4 py-2 text-sm hover:bg-gray-700 hover:text-orange-500"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Become a Creator
                          </Link>
                        )}
                        <button
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700 hover:text-red-400"
                          onClick={handleLogout}
                        >
                          <FaSignOutAlt className="inline mr-2" /> Sign Out
                        </button>
                      </>
                    ) : (
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-sm hover:bg-gray-700 hover:text-orange-500"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Search Bar Below Header */}
      <AnimatePresence>
        {isMobileSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="sm:hidden w-full pt-14 px-2 pb-2 bg-gray-900 border-b border-gray-700"
          >
            <form
              onSubmit={handleSearch}
              className="flex w-full rounded-md overflow-hidden border border-gray-700 bg-gray-800"
            >
              <input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                placeholder="Search by title or category..."
                className="flex-1 min-w-0 px-3 py-2 bg-transparent text-gray-100 placeholder-gray-400 focus:outline-none"
              />
              <button
                type="submit"
                className="flex-shrink-0 bg-gradient-to-r from-orange-500 via-orange-500 to-orange-500 text-white font-semibold px-4 py-2 transition-all duration-300 hover:scale-[1.05] hover:brightness-110"
              >
                <FaSearch className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Header;
