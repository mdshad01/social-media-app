"use client";
import Edit from "@/components/Profile/util/Edit";
import { AlertTriangle, ArrowRight } from "lucide-react";
import React, { useState } from "react";
import DeleteAccountModal from "./util/DeleteAccountModal";

const Account = () => {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  return (
    <div className="w-full h-full flex flex-col items-center p-4">
      <div className="w-[64%] bg-white rounded-md shadow-sm">
        <div className="p-4">
          <h2 className="text-[20px] font-medium text-black/90">
            Profile settings
          </h2>
        </div>
        <div className="px-4 pb-3">
          <div className="flex w-full items-center justify-between">
            <p className="inline text-gray-700">Name, bio, and password </p>
            <span
              onClick={() => setIsEdit(true)}
              className="text-black/40 font-medium"
            >
              <ArrowRight size={20} />
            </span>
          </div>
        </div>
        <div className="h-[1px] w-full bg-black/10 "></div>
      </div>
      {/* Danger Zone */}
      <div className="bg-white w-[64%] mt-4 rounded-md ">
        <div className="pl-4 py-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={20} className="text-red-600" />
            <h3 className="text-[18px] font-medium text-red-600">
              Danger Zone
            </h3>
          </div>
          <div className="flex w-full items-center justify-between">
            <div>
              <p className="text-gray-700 font-medium">Delete account</p>
              <p className="text-sm text-gray-500">
                Permanently delete or deactivate your account
              </p>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2  text-black/40 transition"
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {isEdit && <Edit setIsEdit={setIsEdit} />}
      {showDeleteModal && (
        <DeleteAccountModal setShowDeleteModal={setShowDeleteModal} />
      )}
    </div>
  );
};

export default Account;
