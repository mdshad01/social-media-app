"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { BiAperture } from "react-icons/bi";

const SettingsNavbae = () => {
  const router = useRouter();
  return (
    <nav className="w-full flex items-center justify-start h-[7vh] bg-card">
      <div
        onClick={() => router.push("/")}
        className="text-foreground cursor-pointer flex items-center gap-0 md:w-[20%] justify-start"
      >
        <BiAperture className="w-8 h-8 sm:w-10 sm:h-10 md:w-9 md:h-9" />
        <span className="hidden sm:block text-xl sm:text-2xl md:text-[28px] font-bold">
          Shadsocial.
        </span>
      </div>
    </nav>
  );
};

export default SettingsNavbae;
