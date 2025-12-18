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
      className="pb-2 bg-card rounded-lg shadow-md border border-border flex flex-col gap-6 cursor-pointer hover:shadow-lg transition-shadow"
    >
      <div className="relative h-22">
        <Image
          src={
            user?.backgroundImage ||
            "/banner1.svg"
          }
          alt=""
          fill
          className="rounded-t-md object-cover"
        />
        <Image
          src={
            user?.profilePicture ||
            "/noAvatar3.svg"
          }
          alt=""
          width={48}
          height={48}
          className="rounded-full object-cover w-16 h-16 absolute left-0 right-34 m-auto -bottom-6 ring-2 ring-background z-10"
        />
      </div>
      <div className="flex flex-col items-start px-3 mt-1">
        <span className="text-xl font-semibold text-foreground">
          {user?.username}
        </span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {user?.bio || "No bio available"}
          </span>
        </div>
        <div className="self-center w-full mb-1 mt-2">
          <button
            onClick={() => router.push(`/profile/${user?._id}`)}
            className="bg-primary text-primary-foreground text-xs p-2 rounded-md font-semibold w-full hover:opacity-90 transition-opacity"
          >
            My Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
