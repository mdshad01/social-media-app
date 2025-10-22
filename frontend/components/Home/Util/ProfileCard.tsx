import React from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";

const ProfileCard = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/profile/${user?._id}`)}
      className="p-2 bg-white rounded-lg shadow-md flex flex-col gap-6">
      <div className="relative h-24">
        <Image
          src={user?.backgroundImage || "https://images.pexels.com/photos/6009651/pexels-photo-6009651.jpeg"}
          alt=""
          fill
          className="rounded-md object-cover"
        />
        <Image
          src={user?.profilePicture || "https://images.pexels.com/photos/2811089/pexels-photo-2811089.jpeg"}
          alt=""
          width={48}
          height={48}
          className="rounded-full object-cover w-18 h-18 absolute left-0 right-28 m-auto -bottom-6 ring-1 ring-white z-10 "
        />
      </div>
      <div className=" flex flex-col gap-2 items-start px-3">
        <span className="text-xl font-semibold">{user?.username}</span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{user?.bio || "No bio avaliable"}</span>
        </div>
        <div className="self-center w-full mb-1">
          <button
            onClick={() => router.push(`/profile/${user?._id}`)}
            className="bg-[#1a2254] text-white text-xs p-2 rounded-md w-full">
            My Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
