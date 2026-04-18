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
        className={`hidden h-[calc(100vh-4rem)] lg:block fixed top-16 left-0 bg-[#111827] text-gray-100 border-r border-gray-700 transition-all duration-300 ease-in-out z-40 ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="p-4 flex flex-col h-full">
          <nav className="mt-4 flex-1 flex flex-col space-y-2">
            {navItems().map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 hover:text-amber-400 transition-all duration-300 group relative focus:ring-2 focus:ring-amber-400 focus:outline-none ${
                    isActive
                      ? "bg-gray-800 text-amber-400"
                      : "text-gray-300"
                  } ${isSidebarOpen ? "justify-start" : "justify-center"}`
                }
              >
                {/* Icon */}
                <item.icon className="text-xl" />

                {/* Label when sidebar is expanded */}
                {isSidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm"
                  >
                    {item.text}
                  </motion.span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Bottom Navbar for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#111827] text-gray-100 z-50 shadow-lg border-t border-gray-700">
        <nav className="flex justify-around items-center p-2">
          {navItems().map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center p-2 rounded-lg hover:bg-gray-800 hover:text-amber-400 transition-all duration-300 focus:ring-2 focus:ring-amber-400 focus:outline-none ${
                  isActive ? "text-amber-400" : "text-gray-300"
                }`
              }
            >
              <item.icon className="text-xl" />
              <span className="text-xs">{item.text}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
}

export default SideNavbar;
