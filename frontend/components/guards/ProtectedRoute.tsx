"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { LoginSkeleton } from "@/components/Skeleton";

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

  // Loading state while checking - show LoginSkeleton when redirecting to login
  if (!user) {
    return <LoginSkeleton />;
  }

  // User exists but not verified (and verification required) - show LoginSkeleton when redirecting to verify
  if (requireVerification && !user.isVerified) {
    return <LoginSkeleton />;
  }

  return <>{children}</>;
}
