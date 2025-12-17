import React from "react";
import { formatActivityDate } from "./dateHelpers";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { UserCheck } from "lucide-react";
import { FollowActivity as FollowActivityType } from "@/type";  // ✅ Import from type.d.ts

type FollowActivityProps = {
  activity: FollowActivityType;
};

const FollowActivity: React.FC<FollowActivityProps> = ({ activity }) => {
  const router = useRouter();
  return (
    <div className="mt-6 rounded-md">
      <div className="flex items-center gap-4 bg-background/20 px-2 pr-4 py-2 w-[95%] border-[1px] border-primary/10 rounded-lg text-foreground">
        <Image
          onClick={() => router.push(`/profile/${activity?.user?._id}`)}
          src={
            activity?.user?.profilePicture ||
            "https://images.pexels.com/photos/32409117/pexels-photo-32409117.jpeg"
          }
          alt=""
          width={48}
          height={48}
          className="w-12 h-12 rounded-full object-cover cursor-pointer"
        />
        <div>
          <p>You followed {activity.user.username}</p>
          <span className="text-sm text-gray-500">
            {formatActivityDate(activity.createdAt)}
          </span>
        </div>
        <UserCheck className="ml-auto" />
      </div>
    </div>
  );
};

export default FollowActivity;
