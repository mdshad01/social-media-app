import React from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";

const ProfileCard = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/profile/${user?._id}`)}
      className="pb-2 bg-gradient-to-br from-card via-card to-primary/5 rounded-md shadow-lg border border-border/50 flex flex-col gap-3 cursor-pointer hover:shadow-xl hover:scale-[1.01] transition-all duration-300 overflow-hidden group"
    >
      <div className="relative h-16">
        <Image
          src={
            user?.backgroundImage ||
            "/banner1.svg"
          }
          alt=""
          fill
          className="rounded-t-md object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card/50"></div>
        <Image
          src={
            user?.profilePicture ||
            "/noAvatar3.svg"
          }
          alt=""
          width={48}
          height={48}
          className="rounded-full object-cover w-12 h-12 absolute left-0 right-0 m-auto -bottom-5 ring-4 ring-background shadow-lg z-10 group-hover:ring-primary/50 transition-all duration-300"
        />
      </div>
      <div className="flex flex-col items-center px-3 mt-2">
        <span className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
          {user?.username}
        </span>
        <span className="text-xs text-muted-foreground line-clamp-1 text-center">
          {user?.bio || "No bio available"}
        </span>
        <button
          onClick={() => router.push(`/profile/${user?._id}`)}
          className="bg-primary/90 hover:bg-primary text-primary-foreground text-xs px-4 py-1.5 rounded-lg font-medium w-full transition-all duration-300 shadow-sm hover:shadow-md"
        >
          View Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
