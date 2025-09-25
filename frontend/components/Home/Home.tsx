"use client";
import { RootState } from "@/store/store";
import React from "react";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";
import LeftSidebar from "./LeftSidebar";
import Feed from "./Feed";
import RightSidebar from "./RightSidebar";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "../ui/sheet";
import { MenuIcon } from "lucide-react";
import { BiAperture } from "react-icons/bi";
import { useRouter } from "next/navigation";

const Home = () => {
  // const user = useSelector((state: RootState) => state?.auth.user);
  // console.log(user);
  const router = useRouter();
  return (
    <div className="flex flex-col">
      <div className="w-full h-[12vh]  ">
        <Navbar />
      </div>
      <div className="flex h-[88vh] bg-[#f4f6f8]">
        <div className="w-[20%] hidden md:block fixed">
          <LeftSidebar />
        </div>
        <div className=" flex-1 md:ml-[20%]  overflow-y-auto bg-yellow-300">
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger>
                <MenuIcon />
              </SheetTrigger>
              <SheetContent side="left" className="w-[250px] sm:w-[320px] pl-4">
                <SheetTitle></SheetTitle>
                <SheetDescription></SheetDescription>
                <div className="text-[#1b2356] flex items-center gap-2  justify-start">
                  <BiAperture className="w-10 h-10" />{" "}
                  <span className="text-2xl sm:text-3xl font-bold" onClick={() => router.push("/")}>
                    Shadsocial.
                  </span>
                </div>
                <LeftSidebar />
              </SheetContent>
            </Sheet>
          </div>
          <Feed />
        </div>
        <div className="w-[30%] pt-8 px-6 lg:block hidden ">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default Home;
