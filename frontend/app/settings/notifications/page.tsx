import Notification from "@/components/settings/Content/Notification";
import ProtectedRoute from "@/components/guards/ProtectedRoute";

const NotificationsPage = () => {
  return (
    <ProtectedRoute>
      <Notification />
    </ProtectedRoute>
  );
};

export default NotificationsPage;
