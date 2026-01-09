"use client";
import { useEffect, useState } from "react";
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
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Small delay to ensure Redux has rehydrated
    const checkAuth = () => {
      if (!user) {
        router.replace("/auth/login");
        return;
      }

      if (requireVerification && !user.isVerified) {
        router.replace("/auth/verify");
        return;
      }

      setIsChecking(false);
    };

    // Use a small timeout to ensure Redux persist has completed rehydration
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, [user, router, requireVerification]);

  // Show skeleton while checking auth state
  if (isChecking) {
    return <LoginSkeleton />;
  }

  // User is authenticated and verified (if required)
  return <>{children}</>;
}
