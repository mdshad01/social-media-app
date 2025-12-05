import Edit from "@/components/Profile/util/Edit";
import { ArrowRight } from "lucide-react";
import React, { useState } from "react";

const Account = () => {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  return (
    <div className="w-full h-full flex flex-col items-center p-4">
      <div className="w-[64%] bg-white rounded-md shadow-sm">
        <div className="p-4">
          <h2 className="text-[20px] font-medium text-black/90">Profile settings</h2>
        </div>
        <div className="px-4 pb-3">
          <div className="flex w-full items-center justify-between">
            <p className="inline text-gray-700">Name, bio, and password </p>
            <span onClick={() => setIsEdit(true)} className="text-black/40 font-medium">
              <ArrowRight size={20} />
            </span>
          </div>
        </div>
        <div className="h-[1px] w-full bg-black/10 "></div>
        <div className="px-4 pb-3 mt-3">
          <div className="flex w-full items-center justify-between">
            <p className="inline text-gray-700">Delete account </p>
            <span onClick={() => setIsEdit(true)} className="text-black/40 font-medium">
              <ArrowRight size={20} />
            </span>
          </div>
        </div>
        {/* <div className="h-[1px] w-full bg-black/10 "></div> */}
      </div>
      {isEdit && <Edit setIsEdit={setIsEdit} />}
    </div>
  );
};

export default Account;
