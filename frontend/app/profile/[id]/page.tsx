import Profile from "@/components/Profile/Profile";
import VerificationGuard from "@/components/guards/VerificationGuard";
import React from "react";

type PageProps = {
  params: Promise<{ id: string }>;
};

const ProfilePage = async ({ params }: PageProps) => {
  const { id } = await params;

  return (
    <div className="bg-slate-100">
      <VerificationGuard>
      <Profile id={id} />
      </VerificationGuard>
    </div>
  );
};

export default ProfilePage;
