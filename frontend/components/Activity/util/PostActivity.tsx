import Image from "next/image";
import React from "react";
import { formatActivityDate } from "./dateHelpers";
import ActivityPostCard from "./ActivityPostCard";
import { PostActivity as PostActivityType } from "@/type";  // ✅ Import from type.d.ts

type PostActivityProps = {
  activity: PostActivityType;
};

const PostActivity: React.FC<PostActivityProps> = ({ activity }) => {
  return (
    <div className="border-2 border-gray-100 rounded-md mt-6">
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
      <ActivityPostCard post={activity.post} showUser={false} />
    </div>
  );
};

export default PostActivity;
