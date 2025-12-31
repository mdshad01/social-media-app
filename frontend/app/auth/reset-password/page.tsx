import ResetPassword from "@/components/Auth/ResetPassword";
import { ResetPasswordSkeleton } from "@/components/Skeleton";
import React, { Suspense } from "react";

const ResetPasswordPage = () => {
  return (
    <Suspense fallback={<ResetPasswordSkeleton />}>
      <ResetPassword />
    </Suspense>
  );
};

export default ResetPasswordPage;
