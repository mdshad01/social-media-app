import Home from "@/components/Home/Home";
import ProtectedRoute from "@/components/guards/ProtectedRoute";
import { HomeSkeleton } from "@/components/Skeleton";
import React, { Suspense } from "react";

const HomePage = () => {
  return (
    <ProtectedRoute>
      <Suspense fallback={<HomeSkeleton />}>
        <Home />
      </Suspense>
    </ProtectedRoute>
  );
};

export default HomePage;
