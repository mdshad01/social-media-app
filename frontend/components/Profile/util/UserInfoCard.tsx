import { handleAuthRequest } from "@/components/util/apiRequest";
import { BASE_API_URL } from "@/server";
import { RootState } from "@/store/store";
import { User } from "@/type";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaLink } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { IoCalendar, IoSchool } from "react-icons/io5";
import { MdOutlineWork } from "react-icons/md";
import { useSelector } from "react-redux";

type Props = {
  userProfile?: User;
  id?: string;
};

const UserInfoCard = ({ userProfile, id }: Props) => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state?.auth.user);
  const isOwnProfile = user?._id === id;
  //   const [userProfile, setUserProfile] = useState<User>();
  //   const [isLoading, setIsLoading] = useState(false);
  //   console.log(isOwnProfile);
  //   useEffect(() => {
  //     const fetchUser = async () => {
  //       const fetchUserReq = async () => await axios.get(`${BASE_API_URL}/users/profile/${id}`);
  //       const result = await handleAuthRequest(fetchUserReq, setIsLoading);
  //       if (result) setUserProfile(result.data.data.user);
  //     };
  //     fetchUser();
  //   }, [id]);
  return (
    <div className=" max-w-xs min-w-xs px-4 pt-4 mt-5 bg-white rounded-lg shadow text-sm flex flex-col gap-2">
      {/* TOP */}
      <div className="flex items-center justify-between font-medium">
        <span className="text-gray-500">User Information</span>
        {isOwnProfile ? (
          <span onClick={() => router.push("profile/edit}")}>edit</span>
        ) : (
          <Link href="/" className="text-[#1a2254] text-xs">
            See all
          </Link>
        )}
      </div>
      {/* BOTTOM */}
      <div className="flex gap-2 items-center mt-2">
        <span className="text-xl font-medium">{userProfile?.username || "Jhon Carter"}</span>
        <span className="text-gray-500 font-medium">@{userProfile?.username.replace(/\s+/g, "").toLowerCase()}</span>
      </div>
      <p className="text-gray-700">
        {userProfile?.bio
          ? `${userProfile.bio.slice(0, 12)}...`
          : `${userProfile?.bio}` ||
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Est aliquid atque, dolore libero quisquam."}
      </p>
      <div className="flex flex-col gap-4">
        <div className="flex gap-2 items-center">
          <FaLocationDot className="w-4 h-4 opacity-65" />
          <span className="text-gray-600">
            Liveing in <b>{userProfile?.city || "Denver"}</b>
          </span>
        </div>
        <div className="flex gap-2 items-center">
          <IoSchool className="w-4 h-4 opacity-65" />
          <span className="text-gray-600">
            Went to <b>{userProfile?.school || "Edgar High School"}</b>
          </span>
        </div>
        <div className="flex gap-2 items-center">
          <MdOutlineWork className="w-4 h-4 opacity-65" />
          <span className="text-gray-600">
            Work at <b>{userProfile?.work || "Apple inc"}</b>.
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-1 items-center">
            {/* <FaCalendarAlt className="w-4 h-4" /> */}
            <IoCalendar className="w-4 h-4 opacity-65" />
            <span className="text-gray-600 font-medium">
              {userProfile?.joined ? userProfile.joined.toLocaleDateString() : "Joined November 2024"}{" "}
            </span>
          </div>
          <div className="flex gap-1 items-center cursor-pointer">
            <FaLink className="w-4 h-4 opacity-65" />
            {userProfile?.website && <Link href={userProfile?.website} />}
          </div>
        </div>
        <div className="flex flex-col pb-2 gap-2 ">
          <button className="bg-[#1a2254] text-white w-full p-2 font-medium rounded-md cursor-pointer">
            Following
          </button>
          <button className="text-red-500 opacity-90 text-xs self-end font-medium cursor-pointer">Block User</button>
        </div>
      </div>
    </div>
  );
};

export default UserInfoCard;
