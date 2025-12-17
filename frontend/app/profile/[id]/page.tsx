import Profile from "@/components/Profile/Profile";
import React from "react";

type PageProps = {
  params: Promise<{ id: string }>;
};

const ProfilePage = async ({ params }: PageProps) => {
  const { id } = await params;

  return (
    <div className="bg-slate-100">
      <Profile id={id} />
    </div>
  );
};

export default ProfilePage;
