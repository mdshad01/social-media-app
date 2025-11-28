// components/NavbarWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Home/Navbar";
import SettingsNavbae from "./settings/SettingsNavbar";

export default function NavbarWrapper() {
  const pathname = usePathname();

  // Hide navbar on auth pages
  const isAuthPage = pathname?.startsWith("/auth");
  const isSettingPage = pathname?.startsWith("/settings");

  if (isAuthPage) return null;

  if (isSettingPage)
    return (
      <div className="w-full bg-white border-b-[1px] border-black/10 sm:px-0 md:px-8">
        <SettingsNavbae />
      </div>
    );
  return (
    <div className="w-full  bg-white border-b-[1px] border-black/10 sm:px-0 md:px-8 lg:px-16 xl:px-24 2xl:px-48  ">
      <Navbar />
    </div>
  );
}
