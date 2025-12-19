"use client";
import { RootState } from "@/store/store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { BiAperture } from "react-icons/bi";
import { useSelector } from "react-redux";


const SettingsNavbae = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();
  return (
    <nav className="w-full flex items-center justify-between h-[6vh] md:h-[7vh] bg-card border-b-1">
      <div
        onClick={() => router.push("/")}
        className="text-foreground cursor-pointer pl-4 md:pl-0 flex items-center gap-0 md:w-[20%] justify-start"
      >
        <BiAperture className="w-9 h-9 sm:w-10 sm:h-10 md:w-9 md:h-9" />
        <span className="hidden sm:block text-xl sm:text-2xl md:text-[28px] font-bold">
          Shadsocial.
        </span>
      </div>
      <div className="flex pr-6 md:pr-0 gap-4">
        <Image
          src={user?.profilePicture || "/noAvatar.png"}
          alt="Profile"
          height={28}
          width={28}
          className="rounded-full w-7 h-7 md:w-8 md:h-8"
        />
      </div>
    </nav>
  );
};

export default SettingsNavbae;
