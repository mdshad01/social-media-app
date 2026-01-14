"use client";
import React from "react";

import Link from "next/link";
import ProfileCard from "./Util/ProfileCard";
import Ad from "./Util/Ad";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { 
  FileText, 
  Activity, 
  ShoppingBag, 
  Calendar, 
  Bookmark, 
  Video, 
  Newspaper, 
  GraduationCap, 
  List, 
  Settings 
} from "lucide-react";

const LeftMenu = ({ type }: { type: "home" | "profile" }) => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="flex flex-col gap-4">
      {type === "home" && <ProfileCard />}
      <div className="p-3 bg-card rounded-md shadow-lg border border-border/50 text-muted-foreground flex flex-col gap-1 text-sm hover:shadow-xl transition-shadow duration-300">
        <Link
          href={`/profile/${user?._id}/my-posts`}
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-all duration-200 group"
        >
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <FileText className="w-4 h-4 text-primary" />
          </div>
          <span className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">My Posts</span>
        </Link>
        <Link
          href="/activity"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-all duration-200 group"
        >
          <div className="w-8 h-8 bg-chart-4/15 rounded-lg flex items-center justify-center group-hover:bg-chart-4/25 transition-colors">
            <Activity className="w-4 h-4 text-chart-4" />
          </div>
          <span className="font-medium text-foreground text-sm group-hover:text-chart-4 transition-colors">Activity</span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-all duration-200 group"
        >
          <div className="w-8 h-8 bg-chart-5/15 rounded-lg flex items-center justify-center group-hover:bg-chart-5/25 transition-colors">
            <ShoppingBag className="w-4 h-4 text-chart-5" />
          </div>
          <span className="font-medium text-foreground text-sm group-hover:text-chart-5 transition-colors">Marketplace</span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-all duration-200 group"
        >
          <div className="w-8 h-8 bg-chart-1/15 rounded-lg flex items-center justify-center group-hover:bg-chart-1/25 transition-colors">
            <Calendar className="w-4 h-4 text-chart-1" />
          </div>
          <span className="font-medium text-foreground text-sm group-hover:text-chart-1 transition-colors">Events</span>
        </Link>
        <Link
          href={`/profile/${user?._id}/saved-posts`}
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-all duration-200 group"
        >
          <div className="w-8 h-8 bg-destructive/10 rounded-lg flex items-center justify-center group-hover:bg-destructive/20 transition-colors">
            <Bookmark className="w-4 h-4 text-destructive" />
          </div>
          <span className="font-medium text-foreground text-sm group-hover:text-destructive transition-colors">Saved Posts</span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-all duration-200 group"
        >
          <div className="w-8 h-8 bg-chart-2/15 rounded-lg flex items-center justify-center group-hover:bg-chart-2/25 transition-colors">
            <Video className="w-4 h-4 text-chart-2" />
          </div>
          <span className="font-medium text-foreground text-sm group-hover:text-chart-2 transition-colors">Videos</span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-all duration-200 group"
        >
          <div className="w-8 h-8 bg-chart-3/15 rounded-lg flex items-center justify-center group-hover:bg-chart-3/25 transition-colors">
            <Newspaper className="w-4 h-4 text-chart-3" />
          </div>
          <span className="font-medium text-foreground text-sm group-hover:text-chart-3 transition-colors">News</span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-all duration-200 group"
        >
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <GraduationCap className="w-4 h-4 text-primary" />
          </div>
          <span className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">Courses</span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-all duration-200 group"
        >
          <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center group-hover:bg-accent transition-colors">
            <List className="w-4 h-4 text-muted-foreground" />
          </div>
          <span className="font-medium text-foreground text-sm group-hover:text-foreground transition-colors">Lists</span>
        </Link>
        <Link
          href="/settings"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-all duration-200 group"
        >
          <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center group-hover:bg-accent transition-colors">
            <Settings className="w-4 h-4 text-muted-foreground" />
          </div>
          <span className="font-medium text-foreground text-sm group-hover:text-foreground transition-colors">Settings</span>
        </Link>
      </div>
      {/* <LeftSidebar /> */}
      <Ad size="sm" />
    </div>
  );
};

export default LeftMenu;
