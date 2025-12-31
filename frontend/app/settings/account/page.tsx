import VerificationGuard from "@/components/guards/VerificationGuard";
import Account from "@/components/settings/Content/Account";
import { AccountSettingsSkeleton } from "@/components/Skeleton";
import React, { Suspense } from "react";

const AccountPage = () => {
  return (
    <VerificationGuard>
      <Suspense fallback={<AccountSettingsSkeleton />}>
        <Account />
      </Suspense>
    </VerificationGuard>
  );
};

export default AccountPage;
