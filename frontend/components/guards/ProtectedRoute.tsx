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

  useEffect(() => {
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

    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, [user, router, requireVerification]);

  if (isChecking) {
    return <LoginSkeleton />;
  }

  return <>{children}</>;
}
