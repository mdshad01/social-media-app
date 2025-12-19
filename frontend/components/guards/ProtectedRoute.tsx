"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Loader } from "lucide-react";

type Props = {
  children: React.ReactNode;
  requireVerification?: boolean;
};

export default function ProtectedRoute({ children, requireVerification = true }: Props) {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!user) {
      router.replace("/auth/login");
      return;
    }

    if (requireVerification && !user.isVerified) {
      router.replace("/auth/verify");
    }
  }, [user, router, requireVerification]);

  // Loading state while checking
  if (!user) {
    return (
      <div className="h-screen flex justify-center items-center bg-background">
        <Loader className="w-20 h-20 animate-spin text-foreground" />
      </div>
    );
  }

  // User exists but not verified (and verification required)
  if (requireVerification && !user.isVerified) {
    return (
      <div className="h-screen flex justify-center items-center bg-background">
        <Loader className="w-20 h-20 animate-spin text-foreground" />
      </div>
    );
  }

  return <>{children}</>;
}
