import SuggestedUser from "./Util/SuggestedUser";
import Ad from "./Util/Ad";

const RightSidebar = () => {
  return (
    <div className="flex flex-col gap-4">
      <SuggestedUser />
      <Ad size="md" />
    </div>
  );
};

export default RightSidebar;
