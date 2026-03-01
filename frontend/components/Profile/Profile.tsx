// frontend/components/Profile/Profile.tsx
"use client";
import { BASE_API_URL } from "@/server";
import { RootState } from "@/store/store";
import { User } from "@/type";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FullProfileSkeleton } from "@/components/Skeleton";
import { toast } from "sonner";

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
  const user = useSelector((state: RootState) => state.auth.user);
  const [postOrSave, setPostOrSave] = useState<string>("POST");
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<User>();
  const [isEdit, setIsEdit] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    if (!user) {
      console.log("Profile: No user in Redux, waiting...");
      setIsLoading(false);
      return;
    }

    const getUser = async () => {
      try {
        console.log("Profile: Starting fetch for ID:", id);
        console.log("Profile: BASE_API_URL:", BASE_API_URL);
        console.log("Profile: Full URL:", `${BASE_API_URL}/users/profile/${id}`);
        
        // Check if cookies are available
        if (typeof document !== 'undefined') {
          console.log("Profile: All cookies:", document.cookie);
          console.log("Profile: Has JWT cookie:", document.cookie.includes('jwt'));
        }
        
        setIsLoading(true);
        setError(null);
        
        const response = await axios.get(`${BASE_API_URL}/users/profile/${id}`, { 
          withCredentials: true 
        });
        
        console.log("Profile: Success! Data:", response.data);
        setUserProfile(response.data.data.user);
        setIsLoading(false);
      } catch (err: any) {
        console.error("Profile: Error fetching profile:", err);
        console.error("Profile: Error response:", err.response);
        console.error("Profile: Error status:", err.response?.status);
        console.error("Profile: Error data:", err.response?.data);
        
        setError(err.response?.data?.message || "Failed to load profile");
        setIsLoading(false);
        
        toast.error(err.response?.data?.message || "Failed to load profile");
      }
    };
    
    getUser();
  }, [id, user]);

  if (isLoading) {
    return <FullProfileSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive mb-4">Error Loading Profile</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Profile Not Found</h2>
          <p className="text-muted-foreground">Unable to load profile data</p>
        </div>
      </div>
    );
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
