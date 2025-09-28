import React from "react";

import ProfileCard from "./Util/ProfileCard";
import SuggestedUser from "./Util/SuggestedUser";
import FriendRequests from "./Util/FriendRequests";

const RightSidebar = () => {
  return (
    <div className="flex flex-col gap-4">
      {/* <ProfileCard /> */}
      <FriendRequests />
      <SuggestedUser />
    </div>
  );
};

export default RightSidebar;
