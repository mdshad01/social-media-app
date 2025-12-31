import Verify from "@/components/Auth/Verify";
import ProtectedRoute from "@/components/guards/ProtectedRoute";
import { VerifySkeleton } from "@/components/Skeleton";
import React, { Suspense } from "react";

const VerifyPage = () => {
  return (
    <Suspense fallback={<VerifySkeleton />}>
      <ProtectedRoute requireVerification={false}>
        <Verify />
      </ProtectedRoute>
    </Suspense>
  );
};

export default VerifyPage;
