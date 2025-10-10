"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const user = useSelector((state: RootState) => state?.auth.user);

  useEffect(() => {
    if (!user) {
      toast.error("You are not logged in. Please login to access.");
      router.push("/auth/login");
    }
  }, [user, router]);

  // Don't render children if not authenticated
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
