import Security from "@/components/settings/Content/Security";
import VerificationGuard from "@/components/guards/VerificationGuard";
import React from "react";

const SecurityPage = () => {
  return (
    <VerificationGuard>
      <Security />
    </VerificationGuard>
  );
};

export default SecurityPage;
