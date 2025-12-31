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
import Image from "next/image";
import { LoginSkeleton } from "@/components/Skeleton";

const Navbar = () => {
  const user = useSelector((state: RootState) => state?.auth.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
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
    setIsLoggingOut(true);
    try {
      await axios.post(`${BASE_API_URL}/users/logout`, {}, { withCredentials: true });
      dispatch(setAuthUser(null));
      toast.success("Logged out successfully");
      router.push("/auth/login");
    } catch (error) {
      toast.error("Failed to logout");
      setIsLoggingOut(false);
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
      icon: <BiSolidMessageDetail className="text-xl sm:text-2xl text-foreground" />,
      label: "messages",
      onClick: () => console.log("Messages clicked"),
    },
    {
      icon: <FaBell className="text-xl sm:text-2xl text-foreground" />,
      label: "notifications",
      onClick: () => console.log("Notifications clicked"),
    },
  ];

  if (isLoggingOut) {
    return <LoginSkeleton />;
  }

  return (
    <nav className="flex lg:h-[10vh] md:px-3 px-2 pt-3 md:pt-0 items-center w-full h-full bg-card">
      {/* Logo */}
      <div
        onClick={() => router.push("/")}
        className="text-foreground cursor-pointer flex items-center gap-0 md:w-[20%] justify-start md:justify-center">
        <BiAperture className="w-8 h-8 sm:w-10 sm:h-10" />
        <span className="hidden sm:block text-xl sm:text-2xl md:text-3xl font-bold">Shadsocial.</span>
      </div>

      {/* Search box - Responsive */}
      <div className="flex relative items-center justify-end flex-1 md:w-1/2 h-full mx-2 sm:mx-4">
        <IoSearch className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground opacity-90 absolute left-3" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-8 sm:px-10 md:px-12 py-1.5 sm:py-2 text-sm sm:text-base rounded-full md:rounded-3xl bg-background text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>

      {/* Nav icons - Responsive */}
      <div className="flex gap-2 sm:gap-4 md:gap-6 lg:gap-8 items-center md:w-[30%] h-full justify-end">
        {/* Messages Icon - Hidden on mobile */}
        <span
          onClick={navIcons[0].onClick}
          className="hidden md:flex cursor-pointer w-10 h-10 sm:w-12 sm:h-12 bg-muted hover:bg-accent items-center justify-center rounded-full transition-colors">
          {navIcons[0].icon}
        </span>

        {/* Notifications Icon - Always visible */}
        <span
          onClick={navIcons[1].onClick}
          className="cursor-pointer w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-muted hover:bg-accent flex items-center justify-center rounded-full transition-colors">
          {navIcons[1].icon}
        </span>

        {/* Avatar with Dropdown */}
        <div className="relative hidden md:block" ref={dropdownRef}>
          <span
            onClick={handleAvatarClick}
            className="cursor-pointer w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-muted hover:bg-accent flex items-center justify-center rounded-full transition-colors">
            <Avatar className="w-8 h-8 sm:w-9 sm:h-9 md:w-11 md:h-11">
              <AvatarImage src={user?.profilePicture} className="w-full h-full" />
              <AvatarFallback>
                <Image src="/noAvatar3.svg" alt="image" width={40} height={40} />
              </AvatarFallback>
            </Avatar>
          </span>

          {/* Dropdown Menu */}
          {user && showDropdown && (
            <div className="absolute right-0 mt-2 w-44 sm:w-48 bg-card rounded-lg shadow-lg border border-border py-2 z-50">
              <button
                onClick={handleViewProfile}
                className="w-full px-4 py-2 text-left hover:bg-accent flex items-center gap-3 text-foreground transition-colors text-sm sm:text-base">
                <FiUser className="text-base sm:text-lg" />
                <span>View Profile</span>
              </button>
              <div className="border-t border-border my-1"></div>
              <button
                onClick={handleLogoutClick}
                className="w-full px-4 py-2 text-left hover:bg-accent flex items-center gap-3 text-red-600 transition-colors text-sm sm:text-base">
                <FiLogOut className="text-base sm:text-lg" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
      {/* ✅ MOBILE: Hamburger Menu (Only on mobile) */}
      <div className="md:hidden">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <button className="p-2 hover:bg-accent rounded-lg">
              <MenuIcon className="w-6 h-6 text-foreground" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] pl-4 bg-background">
            <SheetTitle></SheetTitle>
            <SheetDescription></SheetDescription>
            <div className="text-foreground flex items-center gap-2 justify-start mb-4">
              <BiAperture className="w-10 h-10" />
              <span
                className="text-2xl font-bold"
                onClick={() => {
                  router.push("/");
                  setIsSheetOpen(false); // Close sheet
                }}>
                Shadsocial.
              </span>
            </div>
            <LeftSidebar onItemClick={() => setIsSheetOpen(false)} />
            <div className="h-full pb-10 flex items-end justify-center">
              <p className="text-muted-foreground align-self-bottom">Dev. @mdshad</p>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;
