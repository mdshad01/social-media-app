import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import Home from "@/components/Home/Home";
import React from "react";

const HomePage = ({ user }) => {
  console.log(user);
  return (
    <ProtectedRoute>
      <div>
        <Home />
      </div>
    </ProtectedRoute>
  );
};

export default HomePage;
