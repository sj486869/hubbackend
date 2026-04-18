import React from "react";
import { NavLink } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { IoSearchSharp } from "react-icons/io5";
import { BiSolidPlaylist } from "react-icons/bi";
import { RiFileVideoFill } from "react-icons/ri";
import { FaUserFriends } from "react-icons/fa";

import { motion } from "framer-motion";

const navItems = () => [
  { to: "/", icon: FaHome, text: "Home" },
  { to: "/search-video", icon:  IoSearchSharp, text: "Discover" },
  { to: "/video-lists", icon: RiFileVideoFill, text: "Videos" },
  { to: "/my-library", icon:  BiSolidPlaylist, text: "Library" },
  { to: "/creators", icon:  FaUserFriends, text: "Channels" },
  
];

function SideNavbar({ isSidebarOpen }) {
  return (
    <>
      {/* Sidebar for Desktop */}
      <div
        className={`hidden h-[calc(100vh-4rem)] lg:block fixed top-16 left-0 bg-[#0f172a]/95 backdrop-blur-xl border-r border-white/10 transition-all duration-500 ease-in-out z-40 shadow-2xl ${
          isSidebarOpen ? "w-64" : "w-24"
        }`}
      >
        <div className="p-4 flex flex-col h-full">
          <nav className="mt-4 flex-1 flex flex-col space-y-3">
            {navItems().map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-4 p-3.5 rounded-2xl transition-all duration-300 group relative ${
                    isActive
                      ? "bg-orange-500/10 text-orange-500 shadow-[inset_0_0_20px_rgba(249,115,22,0.1)] border border-orange-500/20"
                      : "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent"
                  } ${isSidebarOpen ? "justify-start px-5" : "justify-center"}`
                }
              >
                {/* Icon */}
                <item.icon className={`text-xl transition-transform duration-300 group-hover:scale-125 ${isSidebarOpen ? "" : "mx-auto"}`} />

                {/* Label when sidebar is expanded */}
                {isSidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm font-bold tracking-wide"
                  >
                    {item.text}
                  </motion.span>
                )}
                
                {/* Hover indicator */}
                {!isSidebarOpen && (
                  <div className="absolute left-full ml-4 px-2 py-1 bg-orange-600 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl">
                    {item.text}
                  </div>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Bottom Navbar for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0f172a]/90 backdrop-blur-2xl text-gray-100 z-50 shadow-[0_-8px_30px_rgba(0,0,0,0.5)] border-t border-white/10 pb-safe">
        <nav className="flex justify-around items-center h-20 px-2">
          {navItems().map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 relative ${
                  isActive ? "text-orange-500" : "text-gray-500"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-2 rounded-2xl transition-all duration-300 ${isActive ? "bg-orange-500/10 scale-110" : ""}`}>
                     <item.icon className="text-2xl" />
                  </div>
                  <span className={`text-[9px] font-black tracking-widest uppercase mt-1 transition-all duration-300 ${isActive ? "opacity-100 translate-y-0" : "opacity-60 translate-y-0"}`}>
                    {item.text}
                  </span>
                  {isActive && (
                    <motion.div 
                      layoutId="bottomNav"
                      className="absolute -top-1 w-12 h-1 bg-orange-500 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.8)]"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
}

export default SideNavbar;
