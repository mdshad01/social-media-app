// frontend/components/Profile/Profile.tsx
"use client";
import { BASE_API_URL } from "@/server";
import { RootState } from "@/store/store";
import { User } from "@/type";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { handleAuthRequest } from "../util/apiRequest";
import { FullProfileSkeleton } from "@/components/Skeleton";

import ProfileCard from "./util/ProfileCard";
import UserInfoCard from "./util/UserInfoCard";
import Feed from "./util/Feed";
import LeftMenu from "../Home/LeftMenu";
import Edit from "./util/Edit";
import PostOrSaveBtn from "./util/PostOrSaveBtn";
import SaveFeed from "./util/SaveFeed";
import MobileInfoCard from "./util/MobileInfoCard";
import Ad from "../Home/Util/Ad";

type Props = {
  id: string;
};

const Profile = ({ id }: Props) => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const [postOrSave, setPostOrSave] = useState<string>("POST");
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<User>();
  const [isEdit, setIsEdit] = useState(false);

  const isProfileOwn = user?._id === id;
  const idFollowing = id ? user?.following.includes(id) : false;

  const updateFollowerCount = (isFollowing: boolean) => {
    if (userProfile) {
      setUserProfile({
        ...userProfile,
        followers: isFollowing
          ? [...userProfile.followers, user!._id]
          : userProfile.followers.filter((f) => f !== user!._id),
      });
    }
  };

  useEffect(() => {
    if (!user) router.push("/auth/login");
  }, [user, router]);

  useEffect(() => {
    if (!user) return;

    const getUser = async () => {
      const getUserReq = async () => await axios.get(`${BASE_API_URL}/users/profile/${id}`, { withCredentials: true });
      const result = await handleAuthRequest(getUserReq, setIsLoading);
      if (result) setUserProfile(result.data.data.user);
    };
    getUser();
  }, [router, id, user]);

  if (isLoading) {
    return <FullProfileSkeleton />;
  }

  return (
    <div className="flex pt-6 bg-background gap-6 mx-auto">
      <div className="hidden md:block md:w-[25%] lg:w-[18%]">
        <LeftMenu type="profile" />
      </div>

      <div className="w-full md:w-[75%] lg:w-[55%]">
        <div className="flex flex-col gap-4">
          <ProfileCard userProfile={userProfile} />

          <div className="md:hidden w-full flex items-center justify-center">
            <MobileInfoCard
              setIsEdit={setIsEdit}
              userProfile={userProfile}
              id={id}
              idFollowing={idFollowing}
              updateFollowerCount={updateFollowerCount}
            />
          </div>
          <div className="w-full md:px-5">
            <PostOrSaveBtn postOrSave={postOrSave} isProfileOwn={isProfileOwn} setPostOrSave={setPostOrSave} />
            <div className="w-full md:w-[90%] mx-auto">
              {postOrSave === "POST" && <Feed userProfile={userProfile} />}
              {postOrSave === "SAVE" && <SaveFeed userProfile={userProfile} />}
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex lg:flex-col gap-4 lg:w-[25%]">
        <UserInfoCard
          setIsEdit={setIsEdit}
          userProfile={userProfile}
          id={id}
          idFollowing={idFollowing}
          updateFollowerCount={updateFollowerCount}
        />
        <Ad size="md" />
      </div>

      {isEdit && <Edit setIsEdit={setIsEdit} />}
    </div>
  );
};

export default Profile;
