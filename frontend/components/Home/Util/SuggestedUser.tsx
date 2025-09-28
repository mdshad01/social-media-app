import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { handleAuthRequest } from "@/components/util/apiRequest";
import { BASE_API_URL } from "@/server";
import { RootState } from "@/store/store";
import { User } from "@/type";
import axios from "axios";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const SuggestedUser = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [suggestedUser, setSuggestedUser] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  // console.log("Suggested User", suggestedUser);
  useEffect(() => {
    const getSuggestedUser = async () => {
      const getSuggestedUserReq = async () =>
        await axios.get(`${BASE_API_URL}/users/suggested-user`, { withCredentials: true });
      const result = await handleAuthRequest(getSuggestedUserReq, setIsLoading);
      if (result) setSuggestedUser(result.data.data.users);
    };
    getSuggestedUser();
  }, []);
  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center flex-col ">
        <Loader className="animate-spin " />
      </div>
    );
  }
  return (
    <div className="max-w-xs min-w-x bg-white p-4 rounded">
      <div className="flex items-center justify-between">
        <h2 className="font-medium text-gray-700 text-[15px]">Suggested User</h2>
        <span className=" cursor-pointer text-sm">See all</span>
      </div>
      {suggestedUser?.slice(0, 6).map((sUser) => {
        return (
          <div onClick={() => router.push(`/profile/${sUser?._id}`)} key={sUser._id} className="mt-6 cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 cursor-pointer">
                <Avatar className="w-9 h-9  rounded-full">
                  <AvatarImage src={sUser?.profilePicture} className="h-full w-full rounded-full b" />
                  <AvatarFallback className="bg-white">CN</AvatarFallback>
                </Avatar>
                <h2 className="font-medium">{sUser.username}</h2>
              </div>
              <span className="text-blue-600 font-medium cursor-pointer">Details</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default SuggestedUser;
