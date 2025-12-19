import Activity from "@/components/Activity/Activity";
import ProtectedRoute from "@/components/guards/ProtectedRoute";
import React from "react";

const ActivityPage = () => {
  return (
    <div>
      <ProtectedRoute>
        <Activity />
      </ProtectedRoute>
    </div>
  );
};

export default ActivityPage;
