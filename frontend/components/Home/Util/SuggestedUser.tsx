import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { handleAuthRequest } from "@/components/util/apiRequest";
import { BASE_API_URL } from "@/server";
import { User } from "@/type";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Users, ArrowRight } from "lucide-react";

const Skeleton = ({ className = "" }: { className?: string }) => {
  return <div className={`skeleton rounded ${className}`} />;
};

const SuggestedUserSkeleton = () => {
  return (
    <div className="max-w-xs min-w-x bg-card border border-border/50 p-4 rounded-md shadow-md">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-16" />
      </div>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div>
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <Skeleton className="h-8 w-16 rounded-lg" />
        </div>
      ))}
    </div>
  );
};

const SuggestedUser = () => {
  const [suggestedUser, setSuggestedUser] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  // console.log("Suggested User", suggestedUser);
  useEffect(() => {
    const getSuggestedUser = async () => {
      const getSuggestedUserReq = async () =>
        await axios.get(`${BASE_API_URL}/users/suggested-user`, {
          withCredentials: true,
        });
      const result = await handleAuthRequest(getSuggestedUserReq, setIsLoading);
      if (result) setSuggestedUser(result.data.data.users);
    };
    getSuggestedUser();
  }, []);
  
  if (isLoading) {
    return <SuggestedUserSkeleton />;
  }
  
  return (
    <div className="max-w-xs min-w-x bg-card border border-border/50 p-4 rounded-md shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-foreground text-[15px] flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          Suggested Users
        </h2>
        <span className="cursor-pointer text-sm text-primary hover:text-primary/80 transition-colors font-medium">
          See all
        </span>
      </div>
      {suggestedUser?.slice(0, 6).map((sUser) => {
        return (
          <div
            onClick={() => router.push(`/profile/${sUser?._id}`)}
            key={sUser._id}
            className="mt-3 cursor-pointer hover:bg-accent/50 p-3 rounded-xl transition-all duration-200 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 cursor-pointer">
                <div className="relative">
                  <Avatar className="w-10 h-10 rounded-full ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all">
                    <AvatarImage
                      src={sUser?.profilePicture}
                      className="h-full w-full rounded-full"
                    />
                    <AvatarFallback className="bg-muted">CN</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-card"></div>
                </div>
                <div className="flex flex-col">
                  <h2 className="font-medium text-foreground">
                    {sUser.username}
                  </h2>
                  <span className="text-xs text-muted-foreground">Suggested for you</span>
                </div>
              </div>
              <button className="text-primary font-medium cursor-pointer hover:text-primary/80 transition-colors flex items-center gap-1 text-sm group-hover:gap-2 duration-200">
                View
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default SuggestedUser;
