"use client";
import { RootState } from "@/store/store";
import { Bell, Palette, ShieldAlert, ShieldCheck, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BiLockAlt } from "react-icons/bi";
import { FaBell, FaShieldAlt, FaUser } from "react-icons/fa";
import { FaShield } from "react-icons/fa6";
import { MdPrivacyTip, MdSecurity } from "react-icons/md";
import { RiShieldUserLine } from "react-icons/ri";
import { useSelector } from "react-redux";

const tabs = [
  { value: "account", label: "Account", icon: <User size={32} /> },
  { value: "privacy", label: "Privacy", icon: <ShieldAlert size={32} /> },
  { value: "security", label: "Security", icon: <ShieldCheck size={32} /> },
  { value: "notifications", label: "Notifications", icon: <Bell size={32} /> },
  { value: "appearence", label: "Appearence", icon: <Palette size={32} /> },
];

const Sidebar = ({activeTab}) => {
  const user = useSelector((state: RootState) => state.auth.user);
  return (
    <div className="flex flex-col gap-3  bg-white ">
      <div className="flex mt-6 pl-7 gap-4">
        <Image
          src={user?.profilePicture || "/noAvatar.png"}
          alt=""
          height={40}
          width={40}
          className="rounded-full w-10 h-10"
        />
        <h2 className="text-3xl text-gray-900 font-semibold">Settings</h2>
      </div>
      <ul className="py-3 pl-7 bg-white h-[92vh] lg:h-[92vh] shadow-xs text-gray-700 flex flex-col gap-3 text-sm">
        {tabs.map((item, index) => (
          <li key={index} className={`flex items-center gap-4 p-2 py-4 rounded hover:bg-slate-100 
  ${activeTab === "account" ? "bg-blue-100 border-l-4 border-blue-500" : ""}`}>
            {item.icon}
            <span className="font-medium text-xl text-gray-600">
              {item.label}
            </span>
          </li>
        ))}
      </ul>
      {/* <LeftSidebar /> */}
    </div>
  );
};

{/* <li className="flex items-center gap-4 p-2 py-4 rounded hover:bg-slate-100">
  <User size={32} />

  <span className="font-medium text-xl text-gray-600">Account</span>
</li>
<li className="flex items-center gap-4 p-2 py-4 rounded hover:bg-slate-100">
  <ShieldAlert size={32} />
  <span className="font-medium text-xl text-gray-600">Privacy</span>
</li>
<li className="flex items-center gap-4 p-2 py-4 rounded hover:bg-slate-100">
  <ShieldCheck size={32} />

  <span className="font-medium text-xl text-gray-600">Security</span>
</li>
<li className="flex items-center gap-4 p-2 py-4 rounded hover:bg-slate-100">
  <Bell size={32} />
  <span className="font-medium text-xl text-gray-600">
    Notifications
  </span>
</li>
<li className="flex items-center gap-4 p-2 py-4 rounded hover:bg-slate-100">
  <Palette size={32} />
  <span className="font-medium text-xl text-gray-600">Appearence</span>
</li> */}
export default Sidebar;
