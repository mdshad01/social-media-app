import { BASE_API_URL } from "@/server";
import { setAuthUser } from "@/store/authSlice";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import { AiFillHome } from "react-icons/ai";
import { FaBookmark, FaFlag, FaHome, FaShoppingCart, FaStar, FaUserFriends, FaUsers } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const LeftSidebar = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await axios.post(`${BASE_API_URL}/users/logout`, {}, { withCredentials: true });
    dispatch(setAuthUser(null));
    toast.success("Logged out successfully");
    router.push("/auth/login");
  };

  const handleSidebar = (label: string) => {
    if (label === "Home") router.push("/");
    if (label == "Logout") handleLogout();
  };
  const sideBarLinks = [
    {
      icon: <AiFillHome className="text-blue-500 w-5 h-5" />,
      label: "Home",
      bg: "bg-blue-100 group-hover:bg-blue-200 transition-all duration-100",
    },
    {
      icon: <FaUserFriends className="text-green-600 w-5 h-5" />,
      label: "Friends",
      bg: "bg-[#aefecf] group-hover:bg-green-200 transition-all duration-100",
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
      icon: <FaBookmark className="text-rose-500 w-5 h-5" />,
      label: "Saved",
      bg: "bg-rose-200 group-hover:bg-rose-300 transition-all duration-100",
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
    {
      icon: <MdLogout className="text-red-600 w-5 h-5" />,
      label: "Logout",
      bg: "bg-red-100 group-hover:bg-red-200 transition-all duration-100",
    },
  ];

  return (
    <div className="mt-4 py-4 sm:px-3 md:px-3 lg:px-4 flex flex-col item-center justify-start bg-white rounded-lg gap-1 shadow ">
      {sideBarLinks.map((item, index) => (
        <div
          key={index}
          className="group flex items-center justify-start lg:pl-2 xl:pl-2 gap-5 mb-1.5 py-1 cursor-pointer hover:bg-gray-200 rounded-lg transition-all duration-100 hover:scale-103"
          onClick={() => handleSidebar(item.label)}>
          {/* Icon with hover effect controlled by parent group */}
          <span className={`w-9 h-9 flex items-center justify-center rounded-full ${item.bg}`}>{item.icon}</span>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default LeftSidebar;
