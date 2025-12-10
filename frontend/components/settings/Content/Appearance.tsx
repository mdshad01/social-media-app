import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const Appearance = () => {
  return (
    <div className="w-full h-full flex flex-col items-center p-4">
      <div className="w-[64%] bg-white rounded-md shadow-sm">
        <div className="p-4">
          <h2 className="text-[20px] font-medium text-black/90">Display</h2>
        </div>
        <div className="px-4 pb-3">
          <div className="w-full items-center ">
            <Link
              href="/settings/appearance/display"
              className="text-gray-700 flex justify-between w-full"
            >
              Dark mode{" "}
              <span className="text-black/40 font-medium">
                <ArrowRight size={20} />
              </span>
            </Link>
          </div>
        </div>
        <div className="h-[1px] w-full bg-black/10 "></div>
      </div>
    </div>
  );
};

export default Appearance;
