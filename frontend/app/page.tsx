import Home from "@/components/Home/Home";
import React from "react";

const HomePage = ({ user }) => {
  console.log(user);
  return (
    <div>
      <Home />
    </div>
  );
};

export default HomePage;
