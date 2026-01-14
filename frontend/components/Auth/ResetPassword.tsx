"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import PasswordInput from "./PasswordInput";
import LoadingButton from "../Helper/LoadingButton";
import Link from "next/link";
import { useDispatch } from "react-redux";
import axios from "axios";
import { BASE_API_URL } from "@/server";
import { handleAuthRequest } from "../util/apiRequest";
import { setAuthUser } from "@/store/authSlice";
import { toast } from "sonner";
import { ShieldCheck, Sparkles } from "lucide-react";

const ResetPassword = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!otp || !password || !passwordConfirm) {
      return;
    }

    const data = { email, otp, password, passwordConfirm };
    const resetPassReq = async () =>
      axios.post(`${BASE_API_URL}/users/reset-password`, data, {
        withCredentials: true,
      });

    const result = await handleAuthRequest(resetPassReq, setIsLoading);
    if (result) {
      dispatch(setAuthUser(result.data.data.user));
      toast.success(result.data.message);
      router.push("/auth/login");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-primary">ShadSocial</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-card border border-border/50 rounded-2xl p-6 sm:p-8 shadow-xl shadow-primary/5">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center">
              <ShieldCheck className="w-12 h-12 text-primary" />
            </div>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">Reset Your Password</h2>
            <p className="text-muted-foreground text-sm">
              Enter the OTP and your new password
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-foreground mb-2">
                OTP Code
              </label>
              <input
                type="number"
                id="otp"
                placeholder="Enter 6-digit OTP"
                className="w-full px-4 py-3 rounded-xl bg-accent/50 border border-border text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all no-spinner"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <div>
              <PasswordInput
                name="password"
                label="New Password"
                placeholder="Create a new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <PasswordInput
                name="passwordconfirm"
                label="Confirm Password"
                placeholder="Confirm your new password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <LoadingButton
                onClick={handleSubmit}
                isLoading={isLoading}
                size="lg"
                className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/40"
              >
                Reset Password
              </LoadingButton>
              <Link href="/auth/forget-password" className="flex-shrink-0">
                <button className="px-6 py-3 border border-border rounded-xl hover:bg-accent text-foreground font-medium transition-colors h-full">
                  Back
                </button>
              </Link>
            </div>
          </div>
        </div>

        <p className="text-center text-muted-foreground text-xs mt-6">
          Make sure to use a strong password with letters, numbers, and symbols
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
