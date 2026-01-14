"use client";
import Feed from "./Feed";
import RightSidebar from "./RightSidebar";
import LeftMenu from "./LeftMenu";
import Addpost2 from "./Util/Addpost2";


const Home = () => {
  return  (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex justify-between gap-6 pt-6 px-0 md:px-6 lg:px-8 max-w-[1400px] mx-auto w-full">
        {/* ✅ Left Sidebar - Narrower width */}
        <div className="hidden md:block md:w-[220px] lg:w-[240px]">
          <LeftMenu type="home" />
        </div>

        {/* ✅ Feed - More space */}
        <div className="w-full md:flex-1 md:max-w-[650px] lg:max-w-[700px]">
          <div className="flex flex-col gap-4">
            <Addpost2 />
            <Feed />
          </div>
        </div>

        {/* ✅ Right Sidebar - Slightly narrower */}
        <div className="hidden lg:block lg:w-[300px]">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default Home;
