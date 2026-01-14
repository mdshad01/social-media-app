import { BASE_API_URL } from "@/server";
import { setAuthUser } from "@/store/authSlice";
import { RootState } from "@/store/store";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AiFillHome } from "react-icons/ai";
import {
  FaBookmark,
  FaPoll,
  FaUser,
} from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { MdLogout } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { useState } from "react";
import { LoginSkeleton } from "@/components/Skeleton";

const LeftSidebar = ({ onItemClick }: { onItemClick?: () => void }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await axios.post(
      `${BASE_API_URL}/users/logout`,
      {},
      { withCredentials: true }
    );
    dispatch(setAuthUser(null));
    toast.success("Logged out successfully");
    router.push("/auth/login");
  };

  const handleSidebar = (label: string) => {
    if (label === "Home") router.push("/");
    if (label == "Logout") handleLogout();
    onItemClick?.();
  };
  const sideBarLinks = [
    {
      icon: <AiFillHome className="text-primary w-5 h-5" />,
      label: "Home",
      bg: "bg-primary/10 group-hover:bg-primary/20 dark:bg-primary/20 dark:group-hover:bg-primary/30 transition-all duration-100",
      href: "/",
    },
    {
      icon: <FaUser className="text-primary w-5 h-5" />,
      label: "My profile",
      bg: "bg-primary/10 group-hover:bg-primary/20 dark:bg-primary/20 dark:group-hover:bg-primary/30 transition-all duration-100",
      href: `/profile/${user?._id}`,
    },
    {
      icon: <FaPoll className="text-primary w-5 h-5" />,
      label: "Activity",
      bg: "bg-primary/10 group-hover:bg-primary/20 dark:bg-primary/20 dark:group-hover:bg-primary/30 transition-all duration-100",
      href: "/activity",
    },
    {
      icon: <FaBookmark className="text-primary w-5 h-5" />,
      label: "Saved",
      bg: "bg-primary/10 group-hover:bg-primary/20 dark:bg-primary/20 dark:group-hover:bg-primary/30 transition-all duration-100",
      href: `/profile/${user?._id}/saved-posts`,
    },
    {
      icon: <FaGear className="text-primary w-5 h-5" />,
      label: "Settings",
      bg: "bg-primary/10 group-hover:bg-primary/20 dark:bg-primary/20 dark:group-hover:bg-primary/30 transition-all duration-100",
      href: "/settings",
    },
    {
      icon: <MdLogout className="text-destructive w-5 h-5" />,
      label: "Logout",
      bg: "bg-destructive/10 group-hover:bg-destructive/20 dark:bg-destructive/20 dark:group-hover:bg-destructive/30 transition-all duration-100",
      href: "/",
    },
  ];

  if (isLoggingOut) {
    return <LoginSkeleton />;
  }

  return (
    <div className="py-2 px-2 flex flex-col item-center justify-start bg-transparent gap-1">
      {sideBarLinks.map((item, index) => (
        <Link
          href={item.href!}
          key={index}
          className="group flex items-center justify-start gap-3 py-2 px-2 cursor-pointer hover:bg-accent/50 rounded-lg transition-all duration-200 hover:scale-[1.01]"
          onClick={() => handleSidebar(item.label)}
        >
          {/* Icon with hover effect controlled by parent group */}
          <span
            className={`w-8 h-8 flex items-center justify-center rounded-lg ${item.bg} shadow-sm`}
          >
            {item.icon}
          </span>
          <span className="text-foreground text-sm font-medium group-hover:text-primary transition-colors">{item.label}</span>
        </Link>
      ))}
    </div>
  );
};

export default LeftSidebar;
