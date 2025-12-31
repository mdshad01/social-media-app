"use client";
import React, { Dispatch, SetStateAction } from "react";

import Image from "next/image";
import Link from "next/link";
import ProfileCard from "./Util/ProfileCard";
import Ad from "./Util/Ad";
import LeftSidebar from "./LeftSidebar";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { BASE_API_URL } from "@/server";

const LeftMenu = ({ type }: { type: "home" | "profile" }) => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="flex flex-col gap-6">
      {type === "home" && <ProfileCard />}
      <div className="p-4 bg-card rounded-xl shadow-lg border border-border/50 text-muted-foreground flex flex-col gap-4 text-sm">
        <Link
          href={`/profile/${user?._id}/my-posts`}
          className="flex items-center gap-4 p-2 rounded-lg hover:bg-accent"
        >
          <Image
            src="/posts.png"
            alt=""
            height={24}
            width={24}
            className="w-5 h-5"
          />
          <span className="font-medium">My Posts</span>
        </Link>
        <Link
          href="/activity"
          className="flex items-center gap-4 p-2 rounded-lg hover:bg-accent"
        >
          <Image
            src="/activity.png"
            alt=""
            height={24}
            width={24}
            className="w-5 h-5"
          />
          <span className="font-medium">Activity</span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-4 p-2 rounded-lg hover:bg-accent"
        >
          <Image
            src="/market.png"
            alt=""
            height={24}
            width={24}
            className="w-5 h-5"
          />
          <span className="font-medium">Marketplace</span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-4 p-2 rounded-lg hover:bg-accent"
        >
          <Image
            src="/events.png"
            alt=""
            height={24}
            width={24}
            className="w-5 h-5"
          />
          <span className="font-medium">Events</span>
        </Link>
        <Link
          href={`/profile/${user?._id}/saved-posts`}
          className="flex items-center gap-4 p-2 rounded-lg hover:bg-accent"
        >
          <Image
            src="/albums.png"
            alt=""
            height={24}
            width={24}
            className="w-5 h-5"
          />
          <span className="font-medium">Saved Posts</span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-4 p-2 rounded-lg hover:bg-accent"
        >
          <Image
            src="/videos.png"
            alt=""
            height={24}
            width={24}
            className="w-5 h-5"
          />
          <span className="font-medium">Videos</span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-4 p-2 rounded-lg hover:bg-accent"
        >
          <Image
            src="/news.png"
            alt=""
            height={24}
            width={24}
            className="w-5 h-5"
          />
          <span className="font-medium">News</span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-4 p-2 rounded-lg hover:bg-accent"
        >
          <Image
            src="/courses.png"
            alt=""
            height={24}
            width={24}
            className="w-5 h-5"
          />
          <span className="font-medium">Courses</span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-4 p-2 rounded-lg hover:bg-accent"
        >
          <Image
            src="/lists.png"
            alt=""
            height={24}
            width={24}
            className="w-5 h-5"
          />
          <span className="font-medium">Lists</span>
        </Link>
        <Link
          href="/settings"
          className="flex items-center gap-4 p-2 rounded-lg hover:bg-accent"
        >
          <Image
            src="/settings.png"
            alt=""
            height={24}
            width={24}
            className="w-5 h-5"
          />
          <span className="font-medium">Settings</span>
        </Link>
      </div>
      {/* <LeftSidebar /> */}
      <Ad size="sm" />
    </div>
  );
};

export default LeftMenu;
