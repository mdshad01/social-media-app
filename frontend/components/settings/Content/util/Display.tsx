"use client";
import { ArrowRight } from "lucide-react";
import React, { useState } from "react";

const Display = () => {
  const [toggle, setToggle] = useState<boolean>(false);
  return (
    <div className="w-full h-full flex flex-col items-center p-4">
      <div className="w-[64%] bg-white rounded-md shadow-sm">
        <div className="p-4">
          <h2 className="text-[20px] font-medium text-black/90">Dark mode</h2>
        </div>
        <div className="px-4 pb-3">
          <div className="w-full items-center ">
            <p
              onClick={() => setToggle(!toggle)}
              className="text-gray-700 flex justify-between w-full"
            >
              Dark mode{" "}
              <span className="text-black/40 font-medium">
                <ArrowRight size={20} />
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Display;
