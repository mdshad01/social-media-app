import Home from "@/components/Home/Home";
import ProtectedRoute from "@/components/guards/ProtectedRoute";
import React from "react";

const HomePage = () => {
  return (
    <div>
      <ProtectedRoute>
          <Home />
      </ProtectedRoute>

    </div>
  );
};

export default HomePage;
