"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Loader } from "lucide-react";

type Props = {
  children: React.ReactNode;
};

export default function VerificationGuard({ children }: Props) {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    // If no user, redirect to login
    if (!user) {
      router.replace("/auth/login");
      return;
    }

    // If user not verified, redirect to verify page
    if (!user.isVerified) {
      router.replace("/auth/verify");
      return;
    }
  }, [user, router]);

  // Show loading while checking
  if (!user || !user.isVerified) {
    return (
      <div className="h-screen flex justify-center items-center bg-background">
        <Loader className="w-20 h-20 animate-spin text-foreground" />
      </div>
    );
  }

  // User is verified, show content
  return <>{children}</>;
}
