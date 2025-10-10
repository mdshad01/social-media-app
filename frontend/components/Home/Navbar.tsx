"use client";
import React, { useState, useRef, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { BiAperture, BiSolidMessageDetail } from "react-icons/bi";
import { useRouter } from "next/navigation";
import { IoSearch } from "react-icons/io5";
import { FiLogOut, FiUser } from "react-icons/fi";
import axios from "axios";
import { BASE_API_URL } from "@/server";
import { setAuthUser } from "@/store/authSlice";
import { toast } from "sonner";

const Navbar = () => {
  const user = useSelector((state: RootState) => state?.auth.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_API_URL}/users/logout`, {}, { withCredentials: true });
      dispatch(setAuthUser(null));
      toast.success("Logged out successfully");
      router.push("/auth/login");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  const handleViewProfile = () => {
    setShowDropdown(false);
    router.push(`/profile/${user?._id}`);
  };

  const handleLogoutClick = () => {
    setShowDropdown(false);
    handleLogout();
  };
  const handleAvatarClick = () => {
    // If user is not logged in, redirect to login page
    if (!user) {
      router.push("/auth/login");
    } else {
      // If user is logged in, toggle dropdown
      setShowDropdown(!showDropdown);
    }
  };


  const navIcons = [
    {
      icon: <BiSolidMessageDetail className="text-2xl text-[#1a2254]" />,
      label: "messages",
      onClick: () => console.log("Messages clicked"),
    },
    {
      icon: <FaBell className="text-2xl text-[#1a2254]" />,
      label: "notifications",
      onClick: () => console.log("Notifications clicked"),
    },
  ];

  return (
    <nav className="flex px-4 items-center w-full h-full">
      {/* Logo */}
      <div
        onClick={() => router.push("/")}
        className="text-[#1b2356] cursor-pointer flex items-center gap-0 w-[20%] justify-center">
        <BiAperture className="w-10 h-10" />
        <span className="text-2xl sm:text-3xl font-bold">Shadsocial.</span>
      </div>

      {/* Search box */}
      <div className="flex relative items-center justify-end w-1/2 h-full">
        <IoSearch className="w-5 h-5 text-[#12133c] opacity-90 absolute left-21" />
        <input
          type="text"
          name=""
          placeholder="Search for friends, groups, pages "
          className="w-[90%] px-12 py-2 rounded-3xl bg-[#f3f5f7] place-color outline-none"
        />
      </div>

      {/* nav icons */}
      <div className="flex gap-8 items-center pl-20 w-[30%] h-full">
        {navIcons.map((item, index) => (
          <span
            onClick={item.onClick}
            key={index}
            className="cursor-pointer w-12 h-12 bg-[#f3f5f7] hover:bg-[#eff7fe] flex items-center justify-center rounded-full">
            {item.icon}
          </span>
        ))}

        {/* Avatar with Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <span
            onClick={handleAvatarClick}
            className="cursor-pointer w-12 h-12 bg-[#f3f5f7] hover:bg-[#eff7fe] flex items-center justify-center rounded-full">
            <Avatar className="w-11 h-11">
              <AvatarImage src={user?.profilePicture} className="w-full h-full" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </span>

          {/* Dropdown Menu */}
          {user && showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <button
                onClick={handleViewProfile}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3 text-gray-700 transition-colors">
                <FiUser className="text-lg" />
                <span>View Profile</span>
              </button>
              <div className="border-t border-gray-200 my-1"></div>
              <button
                onClick={handleLogoutClick}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3 text-red-600 transition-colors">
                <FiLogOut className="text-lg" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
