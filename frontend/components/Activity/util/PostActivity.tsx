import PostCard from "@/components/Home/Util/PostCard";
import { RootState } from "@/store/store";
import Image from "next/image";
import React from "react";
import { useSelector } from "react-redux";
import { formatActivityDate } from "./dateHelpers";

const PostActivity = ({ activity }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  console.log(activity);
  return (
    <div className="border-2 border-gray-100 rounded-md mt-6">
      {/* Activity Header */}
      <div className="px-4 py-2 bg-blue-50 flex justify-between border-b-1 border-black/10">
        <p className="flex gap-3 items-center">
          <Image
            src="/posts.png"
            alt=""
            height={24}
            width={24}
            className="w-5 h-5"
          />{" "}
          You posted this
        </p>
        <span className="text-sm text-gray-500">
          {formatActivityDate(activity.createdAt)}
        </span>
      </div>

      {/* Reuse PostCard */}
      <PostCard post={activity.post} user={user} />
    </div>
  );
};

export default PostActivity;
