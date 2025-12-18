import Home from "@/components/Home/Home";
import VerificationGuard from "@/components/guards/VerificationGuard";
import React from "react";

const HomePage = () => {
  return (
    <div>
      <VerificationGuard>
      <Home />
      </VerificationGuard>
    </div>
  );
};

export default HomePage;
