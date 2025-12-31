import { useFollowUnfollow } from "@/components/hooks/use-auth";
import { RootState } from "@/store/store";
import { User } from "@/type";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import { FaLink } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { IoCalendar, IoSchool } from "react-icons/io5";
import { MdOutlineWork } from "react-icons/md";
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
    <div className="w-full pt-4 pb-2 px-5 bg-card rounded text-muted-foreground text-sm flex flex-col gap-2">
      {/* TOP */}
      <div className="flex  items-center justify-between font-medium">
        <span className="text-muted-foreground">User Information</span>
        {isOwnProfile ? (
          <span
            className="cursor-pointer text-primary hover:text-primary/80 transition-colors"
            onClick={() => setIsEdit((prev) => !prev)}
          >
            edit
          </span>
        ) : (
          <Link href="/" className="text-muted-foreground text-xs hover:text-foreground transition-colors">
            See all
          </Link>
        )}
      </div>
      {/* BOTTOM */}
      <div className="flex gap-2 items-center mt-2 ">
        <span className="text-xl font-medium text-foreground">
          {userProfile?.username || "Jhon Carter"}
        </span>
        <span className="text-muted-foreground font-medium">
          @{userProfile?.username.replace(/\s+/g, "").toLowerCase()}
        </span>
      </div>
      <p className="text-muted-foreground">
        {userProfile?.bio ||
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Est aliquid atque, dolore libero quisquam."}
      </p>
      <div className="flex flex-col gap-4">
        <div className="flex gap-2 items-center">
          <FaLocationDot className="w-4 h-4 opacity-65" />
          <span className="">
            Liveing in <b>{userProfile?.city || "Denver"}</b>
          </span>
        </div>
        <div className="flex gap-2 items-center">
          <IoSchool className="w-4 h-4 opacity-65" />
          <span className="">
            Went to <b>{userProfile?.school || "Edgar High School"}</b>
          </span>
        </div>
        <div className="flex gap-2 items-center">
          <MdOutlineWork className="w-4 h-4 opacity-65" />
          <span className="">
            Work at <b>{userProfile?.work || "Apple inc"}</b>.
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-1 items-center">
            {/* <FaCalendarAlt className="w-4 h-4" /> */}
            <IoCalendar className="w-4 h-4 opacity-65" />
            <span className=" font-medium">
              {userProfile?.joined
                ? userProfile.joined.toLocaleDateString()
                : "Joined November 2024"}{" "}
            </span>
          </div>
          <div className="flex gap-1 items-center cursor-pointer">
            <FaLink className="w-4 h-4 opacity-65" />
            {userProfile?.website && <Link href={userProfile?.website} />}
          </div>
        </div>

        <div
          onClick={() => handleFollowUnfollow(id!, updateFollowerCount)}
          className="flex flex-col pb-2 gap-2 "
        >
          {isOwnProfile ? null : !isFollowing ? (
            <button className="bg-primary text-primary-foreground w-full p-2 font-medium rounded-md cursor-pointer hover:bg-primary/90 transition-colors">
              Follow
            </button>
          ) : (
            <button className="bg-destructive text-white w-full p-2 font-medium rounded-md cursor-pointer hover:bg-destructive/90 transition-colors">
              Unfollow
            </button>
          )}
          {/* <button className="text-red-500 opacity-90 text-xs self-end font-medium cursor-pointer">Block User</button> */}
        </div>
      </div>
    </div>
  );
};

export default MobileInfoCard;
