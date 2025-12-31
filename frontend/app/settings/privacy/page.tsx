import ProtectedRoute from "@/components/guards/ProtectedRoute";
import Privacy from "@/components/settings/Content/Privacy";
import { PrivacySettingsSkeleton } from "@/components/Skeleton";
import { Suspense } from "react";

const PrivacyPage = () => {
  return (
    <ProtectedRoute>
      <Suspense fallback={<PrivacySettingsSkeleton />}>
        <Privacy />
      </Suspense>
    </ProtectedRoute>
  );
};

export default PrivacyPage;
