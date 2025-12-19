import Verify from "@/components/Auth/Verify";
import ProtectedRoute from "@/components/guards/ProtectedRoute";
import React from "react";

const VerifyPage = () => {
  return (
    <>
    <ProtectedRoute requireVerification={false}>
      <Verify />
      </ProtectedRoute>
    </>
  );
};

export default VerifyPage;
