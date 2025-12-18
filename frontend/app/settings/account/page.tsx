import VerificationGuard from "@/components/guards/VerificationGuard";
import Account from "@/components/settings/Content/Account";
import React from "react";

const AccountPage = () => {
  return (
    <div>
      <VerificationGuard>
      <Account />
      </VerificationGuard>
    </div>
  );
};

export default AccountPage;
