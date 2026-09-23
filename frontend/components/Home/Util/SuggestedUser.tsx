import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { handleAuthRequest } from "@/components/util/apiRequest";
import { BASE_API_URL } from "@/server";
import { User } from "@/type";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Users, UserPlus, UserCheck } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { updateFollowing } from "@/store/authSlice";

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
  const [loadingFollow, setLoadingFollow] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  
  useEffect(() => {
    const getSuggestedUser = async () => {
      const getSuggestedUserReq = async () =>
        await axios.get(`${BASE_API_URL}/users/suggested-user`, {
          withCredentials: true,
        });
      const result = await handleAuthRequest(getSuggestedUserReq, setIsLoading);
      if (result) {
        setSuggestedUser(result.data.data.users);
      }
    };
    getSuggestedUser();
  }, []);

  const handleFollowUnfollow = async (userId: string, e: React.MouseEvent) => {
    // Prevent navigation when clicking the follow button
    e.stopPropagation();
    
    setLoadingFollow(userId);
    
    const followUnfollowReq = async () =>
      await axios.post(
        `${BASE_API_URL}/users/follow-unfollow/${userId}`,
        {},
        { withCredentials: true }
      );

    const result = await handleAuthRequest(followUnfollowReq);
    
    if (result?.data.status === "success") {
      // Update Redux state - this will persist across refreshes
      dispatch(updateFollowing(userId));
      toast.success(result.data.message);
    }
    
    setLoadingFollow(null);
  };

  const handleNavigateToProfile = (userId: string, e: React.MouseEvent) => {
    // Only navigate if not clicking on the follow button
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    router.push(`/profile/${userId}`);
  };
  
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
        // Check if current user is following this suggested user
        const isFollowing = currentUser?.following?.includes(sUser._id) || false;
        const isLoadingThisUser = loadingFollow === sUser._id;
        
        return (
          <div
            key={sUser._id}
            className="mt-3 cursor-pointer hover:bg-background/50 py-3 px-1 rounded-xl transition-all duration-200 group"
            onClick={(e) => handleNavigateToProfile(sUser._id, e)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 cursor-pointer">
                <div className="relative">
                  <Avatar className="w-10 h-10 rounded-full ring-2 ring-secondary-foreground/50 group-hover:ring-secondary-foreground/40 transition-all">
                    <AvatarImage
                      src={sUser?.profilePicture}
                      className="h-full w-full rounded-full"
                    />
                    <AvatarFallback className="bg-noavatar  w-full">
                      <Image src="/noAvatar01.png" alt="CN" fill/>
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-card"></div>
                </div>
                <div className="flex flex-col">
                  <h2 className="font-medium text-foreground">
                    {sUser?.username && sUser.username.length > 15
                      ? `${sUser.username.slice(0, 13)}...`
                      : sUser.username}
                  </h2>
                  <span className="text-xs text-muted-foreground">Suggested for you</span>
                </div>
              </div>
              
              {/* Follow/Following Button */}
              <button
                onClick={(e) => handleFollowUnfollow(sUser._id, e)}
                disabled={isLoadingThisUser}
                className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-1.5 ${
                  isFollowing
                    ? "bg-card text-muted-foreground border border-muted/50"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                } ${isLoadingThisUser ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isLoadingThisUser ? (
                  <>
                    <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>...</span>
                  </>
                ) : isFollowing ? (
                  <>
                    <span>Following</span>
                  </>
                ) : (
                  <>

                    <span>Follow</span>
                  </>
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default SuggestedUser;
