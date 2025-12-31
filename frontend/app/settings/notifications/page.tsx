import Notification from "@/components/settings/Content/Notification";
import ProtectedRoute from "@/components/guards/ProtectedRoute";
import { NotificationsSettingsSkeleton } from "@/components/Skeleton";
import { Suspense } from "react";

const NotificationsPage = () => {
  return (
    <ProtectedRoute>
      <Suspense fallback={<NotificationsSettingsSkeleton />}>
        <Notification />
      </Suspense>
    </ProtectedRoute>
  );
};

export default NotificationsPage;
