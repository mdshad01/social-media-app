import Image from "next/image";
import React from "react";
import { formatActivityDate } from "./dateHelpers";
import ActivityPostCard from "./ActivityPostCard";
import { LikeActivities } from "@/type";  // ✅ Import from type.d.ts

type LikeActivityProps = {
  activity: LikeActivities;
};

const LikeActivity: React.FC<LikeActivityProps> = ({ activity }) => {
  return (
    <div className="border-2 border-primary/10 rounded-md mt-6">
      <div className="px-4 py-2 bg-upcard flex justify-between border-b-1 border-accent-foreground/20">
        <p className="flex gap-3 items-center">
          <Image
            src="/liked.png"
            alt=""
            height={24}
            width={24}
            className="w-5 h-5"
          />{" "}
          You liked this post
        </p>
        <span className="text-sm text-muted-foreground">
          Recent activity
        </span>
      </div>
      <ActivityPostCard post={activity.post} showUser={true} />
    </div>
  );
};

export default LikeActivity;
