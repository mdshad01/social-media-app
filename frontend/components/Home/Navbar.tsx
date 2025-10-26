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
import { MenuIcon } from "lucide-react";
import axios from "axios";
import { BASE_API_URL } from "@/server";
import { setAuthUser } from "@/store/authSlice";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "../ui/sheet";
import LeftSidebar from "../Home/LeftSidebar";

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
    if (!user) {
      router.push("/auth/login");
    } else {
      setShowDropdown(!showDropdown);
    }
  };

  const navIcons = [
    {
      icon: <BiSolidMessageDetail className="text-xl sm:text-2xl text-[#1a2254]" />,
      label: "messages",
      onClick: () => console.log("Messages clicked"),
    },
    {
      icon: <FaBell className="text-xl sm:text-2xl text-[#1a2254]" />,
      label: "notifications",
      onClick: () => console.log("Notifications clicked"),
    },
  ];

  return (
    <nav className="flex md:px-3 px-2 items-center w-full h-full bg-white">
      {/* Logo */}
      <div
        onClick={() => router.push("/")}
        className="text-[#1b2356] cursor-pointer flex items-center gap-0 md:w-[20%] justify-start md:justify-center">
        <BiAperture className="w-8 h-8 sm:w-10 sm:h-10" />
        <span className="hidden sm:block text-xl sm:text-2xl md:text-3xl font-bold">Shadsocial.</span>
      </div>

      {/* Search box - Responsive */}
      <div className="flex relative items-center justify-end flex-1 md:w-1/2 h-full mx-2 sm:mx-4">
        <IoSearch className="w-4 h-4 sm:w-5 sm:h-5 text-[#12133c] opacity-90 absolute left-3" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-8 sm:px-10 md:px-12 py-1.5 sm:py-2 text-sm sm:text-base rounded-full md:rounded-3xl bg-[#f3f5f7] outline-none"
        />
      </div>

      {/* Nav icons - Responsive */}
      <div className="flex gap-2 sm:gap-4 md:gap-6 lg:gap-8 items-center md:w-[30%] h-full justify-end">
        {/* Messages Icon - Hidden on mobile */}
        <span
          onClick={navIcons[0].onClick}
          className="hidden md:flex cursor-pointer w-10 h-10 sm:w-12 sm:h-12 bg-[#f3f5f7] hover:bg-[#eff7fe] items-center justify-center rounded-full transition-colors">
          {navIcons[0].icon}
        </span>

        {/* Notifications Icon - Always visible */}
        <span
          onClick={navIcons[1].onClick}
          className="cursor-pointer w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-[#f3f5f7] hover:bg-[#eff7fe] flex items-center justify-center rounded-full transition-colors">
          {navIcons[1].icon}
        </span>

        {/* Avatar with Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <span
            onClick={handleAvatarClick}
            className="cursor-pointer w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-[#f3f5f7] hover:bg-[#eff7fe] flex items-center justify-center rounded-full transition-colors">
            <Avatar className="w-8 h-8 sm:w-9 sm:h-9 md:w-11 md:h-11">
              <AvatarImage src={user?.profilePicture} className="w-full h-full" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </span>

          {/* Dropdown Menu */}
          {user && showDropdown && (
            <div className="absolute right-0 mt-2 w-44 sm:w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <button
                onClick={handleViewProfile}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3 text-gray-700 transition-colors text-sm sm:text-base">
                <FiUser className="text-base sm:text-lg" />
                <span>View Profile</span>
              </button>
              <div className="border-t border-gray-200 my-1"></div>
              <button
                onClick={handleLogoutClick}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3 text-red-600 transition-colors text-sm sm:text-base">
                <FiLogOut className="text-base sm:text-lg" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
      {/* ✅ MOBILE: Hamburger Menu (Only on mobile) */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <MenuIcon className="w-6 h-6 text-[#1a2254]" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] pl-4">
            <SheetTitle></SheetTitle>
            <SheetDescription></SheetDescription>
            <div className="text-[#1b2356] flex items-center gap-2 justify-start mb-4">
              <BiAperture className="w-10 h-10" />
              <span className="text-2xl font-bold" onClick={() => router.push("/")}>
                Shadsocial.
              </span>
            </div>
            <LeftSidebar />
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;
