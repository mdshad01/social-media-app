import React, { useState } from "react";
import { X } from "lucide-react";
import axios from "axios";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setAuthUser } from "@/store/authSlice";
import { handleAuthRequest } from "@/components/util/apiRequest";
import { toast } from "sonner";
import { BASE_API_URL } from "@/server";

type Props = {
  setShowDeleteModal: (show: boolean) => void;
};

const DeleteAccountModal = ({ setShowDeleteModal }: Props) => {
  const [step, setStep] = useState<"choose" | "confirm-soft" | "confirm-hard">(
    "choose"
  );
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleDeactivate = async () => {
    const deactivateReq = async () =>
      await axios.post(
        `${BASE_API_URL}/users/deactivate-account`,
        {},
        { withCredentials: true }
      );
    const result = await handleAuthRequest(deactivateReq, setLoading);

    if (result?.data.status === "success") {
      // Logout and redirect
      dispatch(setAuthUser(null));
      window.location.href = "/auth/login";
    }
  };

  const handlePermanentDelete = async () => {
    if (!password) {
      toast.error("Please enter your password");
      return;
    }

    const deleteReq = async () =>
      await axios.delete(`${BASE_API_URL}/users/delete-account`, {
        data: { password },
        withCredentials: true,
      });

    const result = await handleAuthRequest(deleteReq, setLoading);

    if (result?.data.status === "success") {
      // Logout and redirect
      dispatch(setAuthUser(null));
      window.location.href = "/auth/login";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg p-6 w-[500px] max-w-[90%] border border-border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-foreground">
            Delete Account
          </h2>
          <button
            onClick={() => setShowDeleteModal(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={24} />
          </button>
        </div>

        {step === "choose" && (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Choose how you want to delete your account:
            </p>

            <div
              className="border border-border rounded-lg p-4 hover:border-blue-500 cursor-pointer bg-background"
              onClick={() => setStep("confirm-soft")}
            >
              <h3 className="font-semibold mb-2 text-foreground">
                Deactivate (Temporary)
              </h3>
              <p className="text-sm text-muted-foreground">
                Your account will be deactivated for 30 days. You can reactivate
                it anytime within this period.
              </p>
            </div>

            <div
              className="border border-red-300 rounded-lg p-4 hover:border-red-500 cursor-pointer bg-background"
              onClick={() => setStep("confirm-hard")}
            >
              <h3 className="font-semibold text-red-600 mb-2">
                Delete Permanently
              </h3>
              <p className="text-sm text-muted-foreground">
                All your data will be permanently deleted immediately. This
                action cannot be undone.
              </p>
            </div>
          </div>
        )}

        {step === "confirm-soft" && (
          <div className="space-y-4">
            <p className="text-foreground">
              Are you sure you want to deactivate your account? You'll have 30
              days to change your mind and reactivate it.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setStep("choose")}
                className="px-4 py-2 border border-border rounded-md hover:bg-accent text-foreground"
              >
                Back
              </button>
              <button
                onClick={handleDeactivate}
                disabled={loading}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Deactivate Account"}
              </button>
            </div>
          </div>
        )}

        {step === "confirm-hard" && (
          <div className="space-y-4">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-800 dark:text-red-400 font-semibold mb-2">
                ⚠️ Warning: This action is irreversible!
              </p>
              <p className="text-sm text-red-700 dark:text-red-300">
                All your posts, comments, likes, and profile data will be
                permanently deleted.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                Enter your password to confirm:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-background text-foreground"
                placeholder="Password"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setStep("choose")}
                className="px-4 py-2 border border-border rounded-md hover:bg-accent text-foreground"
              >
                Back
              </button>
              <button
                onClick={handlePermanentDelete}
                disabled={loading || !password}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteAccountModal;
