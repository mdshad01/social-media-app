"use client";
import { KeySquareIcon, Sparkles } from "lucide-react";
import { useState } from "react";
import LoadingButton from "../Helper/LoadingButton";
import axios from "axios";
import { BASE_API_URL } from "@/server";
import { handleAuthRequest } from "../util/apiRequest";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ForgetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    const forgetPassReq = async () =>
      await axios.post(
        `${BASE_API_URL}/users/forget-password`,
        { email },
        { withCredentials: true }
      );
    const result = await handleAuthRequest(forgetPassReq, setIsLoading);
    if (result) {
      router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
      toast.success(result.data.message);
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
              <KeySquareIcon className="w-12 h-12 text-primary" />
            </div>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">Forgot Your Password?</h2>
            <p className="text-muted-foreground text-sm">
              Enter your email and we&apos;ll help you reset your password.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-xl bg-accent/50 border border-border text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <LoadingButton
              onClick={handleSubmit}
              className="w-full mt-6 bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/40"
              size="lg"
              isLoading={isLoading}
            >
              Continue
            </LoadingButton>
          </div>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">
              Remember your password?{" "}
              <Link href="/auth/login" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-muted-foreground text-xs mt-6">
          We&apos;ll send you an OTP to reset your password securely
        </p>
      </div>
    </div>
  );
};

export default ForgetPassword;
