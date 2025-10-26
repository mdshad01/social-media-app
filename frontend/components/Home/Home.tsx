"use client";
import { RootState } from "@/store/store";
import React from "react";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";
import LeftSidebar from "./LeftSidebar";
import Feed from "./Feed";
import RightSidebar from "./RightSidebar";
import { useRouter } from "next/navigation";
import LeftMenu from "./LeftMenu";
import Addpost2 from "./Util/Addpost2";

const Home = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col">
      <div className="flex gap-4 sm:gap-6 pt-4 sm:pt-6 px-2 sm:px-4">
        {/* ✅ Left Sidebar - Hidden on mobile */}
        <div className="hidden md:block md:w-[30%] lg:w-[20%]">
          <LeftMenu type="home" />
        </div>

        {/* ✅ Feed - Full width on mobile */}
        <div className="w-full md:w-[70%] lg:w-[60%] xl:w-[50%]">
          <div className="flex flex-col gap-4 sm:gap-6">
            <Addpost2 />
            <Feed />
          </div>
        </div>

        {/* ✅ Right Sidebar - Hidden on mobile and tablet */}
        <div className="hidden lg:block lg:w-[28%]">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default Home;
