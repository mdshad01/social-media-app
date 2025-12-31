import Security from "@/components/settings/Content/Security";
import ProtectedRoute from "@/components/guards/ProtectedRoute";
import { SecuritySettingsSkeleton } from "@/components/Skeleton";
import { Suspense } from "react";

const SecurityPage = () => {
  return (
    <ProtectedRoute>
      <Suspense fallback={<SecuritySettingsSkeleton />}>
        <Security />
      </Suspense>
    </ProtectedRoute>
  );
};

export default SecurityPage;
