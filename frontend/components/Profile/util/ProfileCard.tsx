import { RootState } from "@/store/store";
import { User } from "@/type";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";

type Props = {
  userProfile?: User;
};

const ProfileCard = ({ userProfile }: Props) => {
  return (
    <div className=" flex flex-col items-center justify-center gap-4 md:px-0">
      <div className="relative md:h-60 h-44 w-full shadow">
        <Image
          src={
            userProfile?.backgroundImage ||
            "https://images.pexels.com/photos/6009651/pexels-photo-6009651.jpeg"
          }
          alt=""
          fill
          className="md:rounded-md  object-cover"
        />
        <Image
          src={
            userProfile?.profilePicture ||
            "https://images.pexels.com/photos/2811089/pexels-photo-2811089.jpeg"
          }
          alt=""
          width={128}
          height={128}
          className="rounded-full object-cover w-34 h-34 absolute left-0 right-0 m-auto -bottom-16 ring-4 ring-accent z-10 shadow "
        />
      </div>
      <div className="px-10 w-full bg-card flex flex-col gap-5 items-center justify-center pb-4 md:rounded-lg shadow">
        <span className="text-2xl font-semibold mt-16 mb-2">
          {userProfile?.username}
        </span>
        <div className="flex gap-10 items-center justify-center">
          <div className="flex flex-col items-center font-medium text-foreground">
            <span>{userProfile?.posts.length}</span>
            <span className="">Posts</span>
          </div>
          <div className="flex flex-col gap-1  items-center font-medium text-foreground">
            <span>{userProfile?.followers.length}</span>
            <span className="">Followers</span>
          </div>
          <div className="flex flex-col gap-1  items-center font-medium text-foreground">
            <span>{userProfile?.following.length}</span>
            <span className="">Following</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
