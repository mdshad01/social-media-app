import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { toast } from "sonner";

export const useRequireAuth = () => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!user) {
      toast.error("Please login to access this page");
      router.push("/auth/login");
    } else if (!user.isVerified) {
      toast.error("Please verify your email to access this page");
      router.push("/auth/verify");
    }
  }, [user, router]);

  return user;
};
