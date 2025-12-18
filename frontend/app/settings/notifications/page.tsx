import Notification from "@/components/settings/Content/Notification";
import VerificationGuard from "@/components/guards/VerificationGuard";
import React from "react";

const NotificationsPage = () => {
  return (
    <VerificationGuard>
      <Notification />
    </VerificationGuard>
  );
};

export default NotificationsPage;
