import ProtectedRoute from "@/components/guards/ProtectedRoute";
import Appearance from "@/components/settings/Content/Appearance";
import { AppearanceSettingsSkeleton } from "@/components/Skeleton";
import { Suspense } from "react";

const AppearencePage = () => {
  return (
    <ProtectedRoute>
      <Suspense fallback={<AppearanceSettingsSkeleton />}>
        <Appearance />
      </Suspense>
    </ProtectedRoute>
  );
};

export default AppearencePage;
