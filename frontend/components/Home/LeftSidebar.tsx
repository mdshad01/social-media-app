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
      icon: <FaUser className="text-chart-5 w-5 h-5" />,
      label: "My profile",
      bg: "bg-chart-5/15 group-hover:bg-chart-5/25 dark:bg-chart-5/20 dark:group-hover:bg-chart-5/30 transition-all duration-100",
      href: `/profile/${user?._id}`,
    },
    {
      icon: <FaPoll className="text-chart-4 w-5 h-5" />,
      label: "Activity",
      bg: "bg-chart-4/15 group-hover:bg-chart-4/25 dark:bg-chart-4/20 dark:group-hover:bg-chart-4/30 transition-all duration-100",
      href: "/activity",
    },
    {
      icon: <FaBookmark className="text-destructive w-5 h-5" />,
      label: "Saved",
      bg: "bg-destructive/10 group-hover:bg-destructive/20 dark:bg-destructive/20 dark:group-hover:bg-destructive/30 transition-all duration-100",
      href: `/profile/${user?._id}/saved-posts`,
    },
    {
      icon: <FaGear className="text-muted-foreground w-5 h-5" />,
      label: "Settings",
      bg: "bg-muted group-hover:bg-accent dark:bg-muted dark:group-hover:bg-accent transition-all duration-100",
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
    <div className="mt-4 py-4 sm:px-3 md:px-3 lg:px-4 flex flex-col item-center justify-start bg-transparent gap-2">
      {sideBarLinks.map((item, index) => (
        <Link
          href={item.href!}
          key={index}
          className="group flex items-center justify-start lg:pl-2 xl:pl-2 gap-5 mb-1.5 py-1 cursor-pointer hover:bg-accent rounded-lg transition-all duration-100 hover:scale-103"
          onClick={() => handleSidebar(item.label)}
        >
          {/* Icon with hover effect controlled by parent group */}
          <span
            className={`w-9 h-9 flex items-center justify-center rounded-full ${item.bg}`}
          >
            {item.icon}
          </span>
          <span className="text-foreground">{item.label}</span>
        </Link>
      ))}
    </div>
  );
};

export default LeftSidebar;
