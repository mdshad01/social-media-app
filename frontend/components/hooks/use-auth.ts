import { BASE_API_URL } from "@/server";
import axios from "axios";
import { useDispatch } from "react-redux";
import { handleAuthRequest } from "../util/apiRequest";
import { setAuthUser } from "@/store/authSlice";
import { toast } from "sonner";

export const useFollowUnfollow = () => {
  const dispatch = useDispatch();

  const handleFollowUnfollow = async (userId: string, onSuccess?: (isFollowing: boolean) => void) => {
    const followUnfollowReq = async () =>
      await axios.post(`${BASE_API_URL}/users/follow-unfollow/${userId}`, {}, { withCredentials: true });
    const result = await handleAuthRequest(followUnfollowReq);

    if (result?.data.status === "success") {
      const updatedUser = result.data.data.user;
      dispatch(setAuthUser(updatedUser));
      toast.success(result.data.message);

      // ✅ Call callback with follow status
      if (onSuccess) {
        const isFollowing = updatedUser.following.includes(userId);
        onSuccess(isFollowing);
      }
    }
  };
  return { handleFollowUnfollow };
};
