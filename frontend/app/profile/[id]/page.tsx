import Profile from "@/components/Profile/Profile";
import ProtectedRoute from "@/components/guards/ProtectedRoute";
import React from "react";

type PageProps = {
  params: Promise<{ id: string }>;
};

const ProfilePage = async ({ params }: PageProps) => {
  const { id } = await params;

  return (
    <div className="bg-slate-100">
      <ProtectedRoute>
      <Profile id={id} />
      </ProtectedRoute>
    </div>
  );
};

export default ProfilePage;
