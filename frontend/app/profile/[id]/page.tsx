import Profile from "@/components/Profile/Profile";
import ProtectedRoute from "@/components/guards/ProtectedRoute";
import { FullProfileSkeleton } from "@/components/Skeleton";
import React, { Suspense } from "react";

type PageProps = {
  params: Promise<{ id: string }>;
};

const ProfilePage = async ({ params }: PageProps) => {
  const { id } = await params;

  return (
    <ProtectedRoute>
      <Suspense fallback={<FullProfileSkeleton />}>
        <Profile id={id} />
      </Suspense>
    </ProtectedRoute>
  );
};

export default ProfilePage;
