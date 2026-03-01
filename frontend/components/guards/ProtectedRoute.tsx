// frontend/components/guards/ProtectedRoute.tsx
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
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    // Prevent multiple checks
    if (hasChecked) return;

    const checkAuth = () => {
      // Wait longer for Redux to rehydrate
      if (!user) {
        console.log("ProtectedRoute: No user found, redirecting to login");
        router.replace("/auth/login");
        return;
      }

      if (requireVerification && !user.isVerified) {
        console.log("ProtectedRoute: User not verified, redirecting to verify");
        router.replace("/auth/verify");
        return;
      }

      console.log("ProtectedRoute: Auth check passed");
      setIsChecking(false);
      setHasChecked(true);
    };

    // Increase delay to ensure Redux persist has completed
    const timer = setTimeout(checkAuth, 300);
    return () => clearTimeout(timer);
  }, [user, router, requireVerification, hasChecked]);

  if (isChecking) {
    return <LoginSkeleton />;
  }

  return <>{children}</>;
}
