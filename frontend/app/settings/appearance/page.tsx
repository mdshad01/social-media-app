import VerificationGuard from "@/components/guards/VerificationGuard";
import Appearance from "@/components/settings/Content/Appearance";
import React from "react";

const AppearencePage = () => {
  return (
    <div>
      <VerificationGuard>
      <Appearance />
      </VerificationGuard>
    </div>
  );
};

export default AppearencePage;
