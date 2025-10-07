import React from "react";

import Image from "next/image";
import Link from "next/link";
import ProfileCard from "./Util/ProfileCard";
import Ad from "./Util/Ad";
import LeftSidebar from "./LeftSidebar";

const LeftMenu = ({ type }: { type: "home" | "profile" }) => {
  return (
    <div className="flex flex-col gap-6">
      {type === "home" && <ProfileCard />}
      <div className="p-4 bg-white rounded-lg shadow-md text-gray-500 flex flex-col gap-4 text-sm">
        <Link href="/" className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-100">
          <Image src="/posts.png" alt="" height={24} width={24} className="w-5 h-5" />
          <span className="font-medium">My Posts</span>
        </Link>
        <Link href="/" className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-100">
          <Image src="/activity.png" alt="" height={24} width={24} className="w-5 h-5" />
          <span className="font-medium">Activity</span>
        </Link>
        <Link href="/" className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-100">
          <Image src="/market.png" alt="" height={24} width={24} className="w-5 h-5" />
          <span className="font-medium">Morketplace</span>
        </Link>
        <Link href="/" className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-100">
          <Image src="/events.png" alt="" height={24} width={24} className="w-5 h-5" />
          <span className="font-medium">Events</span>
        </Link>
        <Link href="/" className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-100">
          <Image src="/albums.png" alt="" height={24} width={24} className="w-5 h-5" />
          <span className="font-medium">Albums</span>
        </Link>
        <Link href="/" className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-100">
          <Image src="/videos.png" alt="" height={24} width={24} className="w-5 h-5" />
          <span className="font-medium">Videos</span>
        </Link>
        <Link href="/" className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-100">
          <Image src="/news.png" alt="" height={24} width={24} className="w-5 h-5" />
          <span className="font-medium">News</span>
        </Link>
        <Link href="/" className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-100">
          <Image src="/courses.png" alt="" height={24} width={24} className="w-5 h-5" />
          <span className="font-medium">Courses</span>
        </Link>
        <Link href="/" className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-100">
          <Image src="/lists.png" alt="" height={24} width={24} className="w-5 h-5" />
          <span className="font-medium">Lists</span>
        </Link>
        <Link href="/" className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-100">
          <Image src="/settings.png" alt="" height={24} width={24} className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </Link>
      </div>
      {/* <LeftSidebar /> */}
      <Ad size="sm" />
    </div>
  );
};

export default LeftMenu;
