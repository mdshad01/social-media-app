"use client";
import React from "react";
import { FaBell } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { BiAperture, BiSolidMessageDetail } from "react-icons/bi";
import { useRouter } from "next/navigation";
import { IoSearch } from "react-icons/io5";
const Navbar = () => {
  // const user = useSelector((state: RootState) => state?.auth.user);
  const router = useRouter();

  const handleNavbar = async (label: string) => {
    if (label == "profile") router.push(`/profile/${user?._id}`);
  };
  const navIcons = [
    {
      icon: <BiSolidMessageDetail className="text-2xl text-[#1a2254]" />,
      label: "messages",
    },
    {
      icon: <FaBell className="text-2xl text-[#1a2254]" />,
      label: "notifications",
    },
    // {
    //   icon: (
    //     <Avatar className="w-12 h-12">
    //       <AvatarImage src={user?.profilePicture} className="w-full h-full" />
    //       <AvatarFallback>CN</AvatarFallback>
    //     </Avatar>
    //   ),
    //   label: "profile",
    // },
  ];
  return (
    <nav className="flex px-4 items-center w-full h-full">
      {/* Logo */}
      <div
        onClick={() => router.push("/")}
        className="text-[#1b2356] cursor-pointer flex items-center gap-0 w-[20%] justify-center">
        <BiAperture className="w-10 h-10" /> <span className="text-2xl sm:text-3xl font-bold">Shadsocial.</span>
      </div>
      {/* Search box */}
      <div className="flex relative items-center justify-end w-1/2 h-full">
        <IoSearch className="w-5 h-5 text-[#12133c] opacity-90 absolute left-21" />
        <input
          type="text"
          name=""
          placeholder="Search for friends, groups, pages "
          className="w-[90%] px-12 py-2 rounded-3xl bg-[#f3f5f7] place-color outline-none"
        />
      </div>
      {/* nav icons */}
      <div className="flex gap-8 items-center pl-20 w-[30%]  h-full">
        {navIcons.map((item, index) => (
          <span
            onClick={() => handleNavbar(item.label)}
            key={index}
            className="cursor-pointer w-12 h-12 bg-[#f3f5f7] hover:bg-[#eff7fe] flex items-center justify-center rounded-full">
            {item.icon}
          </span>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
