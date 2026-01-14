import { useFollowUnfollow } from "@/components/hooks/use-auth";
import { RootState } from "@/store/store";
import { User } from "@/type";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import { MapPin, GraduationCap, Briefcase, Calendar, Link as LinkIcon, Edit2 } from "lucide-react";
import { useSelector } from "react-redux";

type Props = {
  userProfile?: User;
  id?: string;
  idFollowing?: boolean;
  setIsEdit: Dispatch<SetStateAction<boolean>>;
  updateFollowerCount?: (isFollowing: boolean) => void; // ✅ Add this
};

const MobileInfoCard = ({
  userProfile,
  id,
  setIsEdit,
  updateFollowerCount,
}: Props) => {
  const { handleFollowUnfollow } = useFollowUnfollow();
  const user = useSelector((state: RootState) => state?.auth.user);
  const isOwnProfile = user?._id === id;
  const isFollowing = user?.following?.includes(id!) || false;
  return (
    <div className="w-full bg-card rounded-sm shadow-md hover:shadow-lg transition-shadow duration-300 border border-border/50 overflow-hidden">
      {/* TOP */}
      <div className="flex items-center justify-between p-4 border-b border-border/30 bg-gradient-to-r from-primary/5 to-transparent">
        <span className="text-foreground font-semibold text-sm">User Information</span>
        {isOwnProfile ? (
          <button
            className="flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors text-sm font-medium"
            onClick={() => setIsEdit((prev) => !prev)}
          >
            <Edit2 className="w-3.5 h-3.5" />
            Edit
          </button>
        ) : (
          <Link href="/" className="text-muted-foreground text-xs hover:text-primary transition-colors font-medium">
            See all
          </Link>
        )}
      </div>
      
      {/* BOTTOM */}
      <div className="p-4 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xl font-bold text-foreground">
            {userProfile?.username || "Jhon Carter"}
          </span>
          <span className="text-sm text-muted-foreground font-medium">
            @{userProfile?.username.replace(/\s+/g, "").toLowerCase()}
          </span>
        </div>
        
        <p className="text-sm text-muted-foreground leading-relaxed">
          {userProfile?.bio ||
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Est aliquid atque, dolore libero quisquam."}
        </p>
        
        <div className="flex flex-col gap-3 pt-2">
          <div className="flex gap-3 items-center text-sm text-foreground group hover:text-primary transition-colors cursor-pointer">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
              <MapPin className="w-4 h-4 text-primary" />
            </div>
            <span>Living in <b>{userProfile?.city || "Denver"}</b></span>
          </div>
          
          <div className="flex gap-3 items-center text-sm text-foreground group hover:text-primary transition-colors cursor-pointer">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
              <GraduationCap className="w-4 h-4 text-primary" />
            </div>
            <span>Went to <b>{userProfile?.school || "Edgar High School"}</b></span>
          </div>
          
          <div className="flex gap-3 items-center text-sm text-foreground group hover:text-primary transition-colors cursor-pointer">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
              <Briefcase className="w-4 h-4 text-primary" />
            </div>
            <span>Work at <b>{userProfile?.work || "Apple inc"}</b></span>
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t border-border/30">
            <div className="flex gap-2 items-center text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span className="font-medium">
                {userProfile?.joined
                  ? userProfile.joined.toLocaleDateString()
                  : "Joined November 2024"}
              </span>
            </div>
            {userProfile?.website && (
              <Link 
                href={userProfile.website} 
                className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                target="_blank"
              >
                <LinkIcon className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>

        {!isOwnProfile && (
          <div
            onClick={() => handleFollowUnfollow(id!, updateFollowerCount)}
            className="pt-2"
          >
            {!isFollowing ? (
              <button className="bg-primary text-primary-foreground w-full py-2.5 font-semibold rounded-lg cursor-pointer hover:bg-primary/90 transition-all hover:scale-[1.02] shadow-sm">
                Follow
              </button>
            ) : (
              <button className="bg-destructive text-white w-full py-2.5 font-semibold rounded-lg cursor-pointer hover:bg-destructive/90 transition-all hover:scale-[1.02] shadow-sm">
                Unfollow
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileInfoCard;
