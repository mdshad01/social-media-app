import Image from "next/image";
import React from "react";
import { formatActivityDate } from "./dateHelpers";
import ActivityPostCard from "./ActivityPostCard";
import { CommentActivities } from "@/type";  // ✅ Import from type.d.ts

type CommentActivityProps = {
  activity: CommentActivities;
};

const CommentActivity: React.FC<CommentActivityProps> = ({ activity }) => {
  return (
    <div className="border-2 border-primary/10 rounded-md mt-6">
      <div className="px-4 py-2 bg-upcard flex justify-between border-b-1 border-accent-foreground/20">
        <p className="flex gap-3 items-center">
          <Image
            src="/comment.png"
            alt=""
            height={24}
            width={24}
            className="w-5 h-5"
          />{" "}
          You commented on this post
        </p>
        <span className="text-sm text-muted-foreground">
          {formatActivityDate(activity.createdAt)}
        </span>
      </div>
      <div className="px-4 py-3 bg-muted/30">
        <p className="text-sm italic">&ldquo;{activity.comment}&rdquo;</p>
      </div>
      <ActivityPostCard post={activity.post} showUser={false} />
    </div>
  );
};

export default CommentActivity;
