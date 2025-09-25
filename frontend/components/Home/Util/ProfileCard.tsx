import React from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const ProfileCard = () => {
  // Sample user data - replace with your actual data
  const user = useSelector((state: RootState) => state.auth.user);

  const handleNavigateToProfile = () => {
    // In a real Next.js app, you'd use next/router or next/navigation
    // console.log("Navigating to profile:", user?.profileUrl);
    // Example with Next.js router:
    // router.push(user?.profileUrl);
  };

  return (
    <div className="min-w-xs max-w-xs mx-auto">
      {/* <div className="flex items-center space-x-4 ">
          <Avatar className="w-9 h-9  rounded-full">
            <AvatarImage src={user?.profilePicture} className="h-full w-full rounded-full" />
            <AvatarFallback className="bg-white">CN</AvatarFallback>
          </Avatar>
          <div className="">
            <h1 className="font-bold">{user?.username}</h1>
            <p className="text-gray-700">{user?.bio || "My Profile Bio Here"}</p>
          </div>
        </div> */}
      <div className="bg-white rounded-xl shadow overflow-hidden hover:shadow-md transition-shadow duration-300">
        {/* Cover Image */}
        <div className="relative h-26 bg-gradient-to-r from-blue-500 to-blue-600">
          <Image
            src={
              user?.backgroundImage ||
              "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=800&h=200&fit=crop"
            }
            alt="Profile cover"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>

        {/* Profile Content */}
        <div className="relative px-4 pb-4">
          {/* Avatar - positioned to overlap cover image */}
          <div className="relative -mt-14 mb-1">
            <Avatar className="w-20 h-20 border-2 border-white shadow-lg">
              <AvatarImage
                src={
                  user?.profilePicture ||
                  "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=800&h=200&fit=crop"
                }
                alt={user?.username}
              />
              <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                CN
              </AvatarFallback>
            </Avatar>
          </div>

          {/* User Info */}
          <div className="space-y-2">
            {/* Name and Username */}
            <div>
              <h2 className="text-xl font-bold leading-5 text-gray-900 hover:text-blue-600 transition-colors cursor-pointer">
                {user?.username}
              </h2>
              {/* <p className="text-sm text-gray-500 font-medium">@{user?.username.replaceAll(" ", "").toLowerCase()}</p> */}
            </div>

            {/* Bio */}
            <p className="text-gray-600 text-xs line-clamp-3">
              {user?.bio ? user.bio.split(" ").slice(0, 15).join(" ") + "..." : "No bio available."}
            </p>
            {/* View Profile Button */}
            <Button
              onClick={handleNavigateToProfile}
              className="w-full bg-[#1b2356] hover:bg-[#2a3166] text-white font-medium py-2 px-4 mt-2 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] group">
              <span>View Profile</span>
              <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
