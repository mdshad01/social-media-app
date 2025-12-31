import Activity from "@/components/Activity/Activity";
import ProtectedRoute from "@/components/guards/ProtectedRoute";
import { ActivitySkeleton } from "@/components/Skeleton";
import React, { Suspense } from "react";

const ActivityPage = () => {
  return (
    <ProtectedRoute>
      <Suspense fallback={<ActivitySkeleton />}>
        <Activity />
      </Suspense>
    </ProtectedRoute>
  );
};

export default ActivityPage;
