import React from "react";
import { FaBookmark, FaFlag, FaHome, FaShoppingCart, FaStar, FaUserFriends, FaUsers } from "react-icons/fa";

const LeftSidebar = () => {
  const sideBarLinks = [
    {
      icon: <FaHome className="text-blue-500 w-5 h-5" />,
      label: "Home",
      bg: "bg-blue-100 group-hover:bg-blue-200 transition-all duration-100",
    },
    {
      icon: <FaUserFriends className="text-[#209855] w-5 h-5" />,
      label: "Friends",
      bg: "bg-[#aeeecf] group-hover:bg-green-200 transition-all duration-100",
    },
    {
      icon: <FaUsers className="text-orange-500 w-5 h-5" />,
      label: "Groups",
      bg: "bg-orange-100 group-hover:bg-orange-200 transition-all duration-100",
    },
    {
      icon: <FaShoppingCart className="text-purple-500 w-5 h-5" />,
      label: "Marketplace",
      bg: "bg-purple-200 group-hover:bg-purple-300 transition-all duration-100",
    },
    {
      icon: <FaBookmark className="text-red-500 w-5 h-5" />,
      label: "Saved",
      bg: "bg-red-200 group-hover:bg-red-300 transition-all duration-100",
    },
    {
      icon: <FaFlag className="text-cyan-500 w-5 h-5" />,
      label: "Pages",
      bg: "bg-cyan-100 group-hover:bg-cyan-200 transition-all duration-100",
    },
    {
      icon: <FaStar className="text-gray-600 w-5 h-5" />,
      label: "Favourites",
      bg: "bg-gray-300 group-hover:bg-gray-400 transition-all duration-100",
    },
  ];

  return (
    <div className="mt-6 h-full w-full sm:px-3 md:px-3 lg:px-8 flex flex-col item-center justify-start">
      {sideBarLinks.map((item, index) => (
        <div
          key={index}
          className="group flex items-center justify-start lg:pl-4 xl:pl-6 gap-4 mb-1.5 py-1 cursor-pointer hover:bg-gray-200 rounded-lg transition-all duration-100 hover:scale-103">
          {/* Icon with hover effect controlled by parent group */}
          <span className={`w-10 h-10 flex items-center justify-center rounded-full ${item.bg}`}>{item.icon}</span>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default LeftSidebar;
