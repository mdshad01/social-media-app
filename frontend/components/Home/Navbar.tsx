"use client";
import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { BiAperture } from "react-icons/bi";
import { useRouter } from "next/navigation";
import { IoSearch } from "react-icons/io5";
import { FiLogOut, FiUser } from "react-icons/fi";
import { MenuIcon, Sparkles, MessageCircle, Bell } from "lucide-react";
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
    } catch {
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
      icon: <MessageCircle className="w-5 h-5 text-primary" />,
      label: "messages",
      onClick: () => console.log("Messages clicked"),
    },
    {
      icon: <Bell className="w-5 h-5 text-primary" />,
      label: "notifications",
      onClick: () => console.log("Notifications clicked"),
    },
  ];

  if (isLoggingOut) {
    return <LoginSkeleton />;
  }

  return (
    <nav className="flex lg:h-[10vh] md:px-3 px-2 py-1 md:pt-0 items-center w-full h-full bg-card border-b border-border/30 backdrop-blur-sm sticky top-0 z-40">
      {/* Logo */}
      <div
        onClick={() => router.push("/")}
        className="text-foreground cursor-pointer flex items-center gap-0 md:w-[20%] justify-start md:justify-center group">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
        <span className="hidden sm:block text-xl sm:text-2xl md:text-3xl font-bold ml-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Shadsocial.</span>
      </div>

      {/* Search box - Responsive */}
      <div className="flex relative items-center justify-end flex-1 md:w-1/2 h-full mx-2 sm:mx-4">
        <IoSearch className="w-5 h-5 text-muted-foreground absolute left-3 cursor-pointer" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-9 py-2 text-sm rounded-full bg-muted/90 border border-border/50 text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
        />
      </div>

      {/* Nav icons - Responsive */}
      <div className="flex gap-3 sm:gap-5 items-center md:w-[30%] h-full justify-end">
        {/* Messages Icon - Hidden on mobile */}
        <span
          onClick={navIcons[0].onClick}
          className="hidden md:flex cursor-pointer w-10 h-10 bg-primary/10 hover:bg-primary/20 hover:scale-105 items-center justify-center rounded-xl transition-all duration-200 shadow-sm relative">
          {navIcons[0].icon}
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white text-xs rounded-full flex items-center justify-center font-semibold shadow-md">3</span>
        </span>

        {/* Notifications Icon - Always visible */}
        <span
          onClick={navIcons[1].onClick}
          className="cursor-pointer w-10 h-10 bg-primary/10 hover:bg-primary/20 hover:scale-105 flex items-center justify-center rounded-xl transition-all duration-200 shadow-sm relative">
          {navIcons[1].icon}
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white text-xs rounded-full flex items-center justify-center font-semibold shadow-md">5</span>
        </span>

        {/* Avatar with Dropdown */}
        <div className="relative hidden md:block" ref={dropdownRef}>
          <span
            onClick={handleAvatarClick}
            className="cursor-pointer w-10 h-10 bg-primary/10 hover:bg-primary/20 hover:scale-105 flex items-center justify-center rounded-xl transition-all duration-200 shadow-sm ring-2 ring-transparent hover:ring-primary/30">
            <Avatar className="w-9 h-9">
              <AvatarImage src={user?.profilePicture} className="w-full h-full" />
              <AvatarFallback>
                <Image src="/noAvatar3.svg" alt="image" width={36} height={36} />
              </AvatarFallback>
            </Avatar>
          </span>

          {/* Dropdown Menu */}
          {user && showDropdown && (
            <div className="absolute right-0 mt-3 w-48 bg-card rounded-xl shadow-2xl border border-border/50 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <button
                onClick={handleViewProfile}
                className="w-full px-4 py-2.5 text-left hover:bg-accent flex items-center gap-3 text-foreground transition-colors text-sm group">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <FiUser className="text-base text-primary" />
                </div>
                <span className="font-medium">View Profile</span>
              </button>
              <div className="border-t border-border my-1.5"></div>
              <button
                onClick={handleLogoutClick}
                className="w-full px-4 py-2.5 text-left hover:bg-destructive/10 flex items-center gap-3 text-destructive transition-colors text-sm group">
                <div className="w-8 h-8 bg-destructive/10 rounded-lg flex items-center justify-center group-hover:bg-destructive/20 transition-colors">
                  <FiLogOut className="text-base" />
                </div>
                <span className="font-medium">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
      {/* ✅ MOBILE: Hamburger Menu (Only on mobile) */}
      <div className="md:hidden">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <button className="p-2 hover:bg-accent rounded-xl transition-colors">
              <MenuIcon className="w-6 h-6 text-foreground" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] pl-4 bg-background">
            <SheetTitle></SheetTitle>
            <SheetDescription></SheetDescription>
            <div className="text-foreground flex items-center gap-2 justify-start mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <span
                className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
                onClick={() => {
                  router.push("/");
                  setIsSheetOpen(false);
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
