"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BASE_API_URL } from "@/server";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import ActivityStats from "./ActivityStats";
import ActivityTabs from "./ActivityTabs";
import ActivityList from "./ActivityList";
import LeftMenu from "../Home/LeftMenu";
import RightSidebar from "../Home/RightSidebar";

type ActivityType = "like" | "comment" | "follow";

interface Activity {
  type: ActivityType;
  user: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
  post?: {
    _id: string;
    caption?: string;
    image?: {
      url: string;
    };
  };
  comment?: string;
  createdAt: string;
}

interface Stats {
  totalLikes: number;
  totalComments: number;
  totalFollowers: number;
}

const ActivityPage = () => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState<Stats>({ totalLikes: 0, totalComments: 0, totalFollowers: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | ActivityType>("all");

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    fetchActivity();
  }, [user, router]);

  const fetchActivity = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${BASE_API_URL}/users/activity`, {
        withCredentials: true,
      });

      if (response.data.status === "success") {
        setActivities(response.data.data.activities);
        setFilteredActivities(response.data.data.activities);
        setStats(response.data.data.stats);
      }
    } catch (error) {
      toast.error("Failed to load activity");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tab: "all" | ActivityType) => {
    setActiveTab(tab);
    if (tab === "all") {
      setFilteredActivities(activities);
    } else {
      setFilteredActivities(activities.filter((activity) => activity.type === tab));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-100">
        <Loader className="animate-spin w-8 h-8 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-slate-100 min-h-screen">
      <div className="flex gap-4 sm:gap-6 pt-4 sm:pt-6 px-2 sm:px-4">
        {/* Left Sidebar - Hidden on mobile */}
        <div className="hidden md:block md:w-[30%] lg:w-[20%]">
          <LeftMenu type="home" />
        </div>

        {/* Activity Content - Full width on mobile */}
        <div className="w-full md:w-[70%] lg:w-[60%] xl:w-[50%]">
          <div className="flex flex-col gap-4">
            {/* Page Title */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h1 className="text-2xl font-bold text-gray-800">Activity</h1>
              <p className="text-sm text-gray-500 mt-1">See what's happening with your posts</p>
            </div>

            {/* Stats */}
            <ActivityStats stats={stats} />

            {/* Tabs */}
            <ActivityTabs activeTab={activeTab} onTabChange={handleTabChange} />

            {/* Activity List */}
            <ActivityList activities={filteredActivities} />
          </div>
        </div>

        {/* Right Sidebar - Hidden on mobile and tablet */}
        <div className="hidden lg:block lg:w-[28%]">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default ActivityPage;
