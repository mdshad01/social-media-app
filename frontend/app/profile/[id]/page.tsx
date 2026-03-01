"use client";
import Profile from "@/components/Profile/Profile";
import ProtectedRoute from "@/components/guards/ProtectedRoute";
import { FullProfileSkeleton } from "@/components/Skeleton";
import React, { Suspense, use } from "react";

type PageProps = {
  params: Promise<{ id: string }>;
};

const ProfilePage = ({ params }: PageProps) => {
  const { id } = use(params);  // Use React's 'use' hook instead of await

  return (
    <ProtectedRoute>
      <Suspense fallback={<FullProfileSkeleton />}>
        <Profile id={id} />
      </Suspense>
    </ProtectedRoute>
  );
};

export default ProfilePage;
