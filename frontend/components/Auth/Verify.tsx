"use client";
import { MailCheck, Sparkles } from "lucide-react";
import { VerifySkeleton } from "@/components/Skeleton";
import {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import LoadingButton from "../Helper/LoadingButton";
import axios from "axios";
import { BASE_API_URL } from "@/server";
import { handleAuthRequest } from "../util/apiRequest";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { setAuthUser } from "@/store/authSlice";
import { RootState } from "@/store/store";

const Verify = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state?.auth.user);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.replace("/auth/login");
    } else if (user && user.isVerified) {
      router.replace("/");
    } else {
      setIsPageLoading(false);
    }
  }, [user, router]);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChanges = (
    index: number,
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    const { value } = event.target;
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOpt = [...otp];
      newOpt[index] = value;
      setOtp(newOpt);
    }
    if (value.length === 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>
  ): void => {
    if (
      event.key === "Backspace" &&
      !inputRefs.current[index]?.value &&
      inputRefs.current[index - 1]
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const otpValue = otp.join("");
    const verifyReq = async () =>
      await axios.post(
        `${BASE_API_URL}/users/verify`,
        { otp: otpValue },
        { withCredentials: true }
      );

    const result = await handleAuthRequest(verifyReq, setIsLoading);
    console.log(result);

    if (result) {
      dispatch(setAuthUser(result.data.data.user));
      toast.success(result.data.message);
      
      // Small delay to ensure Redux state is persisted before navigation
      await new Promise(resolve => setTimeout(resolve, 100));
      router.push("/");
    }
  };

  const handleResendOtp = async () => {
    const resendOtpReq = async () =>
      await axios.post(`${BASE_API_URL}/users/resend-otp`, null, {
        withCredentials: true,
      });
    const result = await handleAuthRequest(resendOtpReq, setIsLoading);
    console.log(result);
    if (result) {
      toast.success(result.data.message);
    }
  };

  if (isPageLoading) {
    return <VerifySkeleton />;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
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
              <MailCheck className="w-12 h-12 text-primary" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">OTP Verification</h2>
            <p className="text-muted-foreground text-sm">
              We&apos;ve sent a code to <span className="font-semibold text-foreground">{user?.email}</span>
            </p>
          </div>

          <div className="flex justify-center gap-2 sm:gap-3 mb-6">
            {[0, 1, 2, 3, 4, 5].map((index) => {
              return (
                <input
                  type="number"
                  maxLength={1}
                  key={index}
                  className="w-10 h-12 sm:w-14 sm:h-16 bg-accent/50 border border-border text-foreground text-center rounded-xl text-xl sm:text-2xl font-bold outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all no-spinner"
                  value={otp[index] || ""}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onChange={(e) => handleChanges(index, e)}
                />
              );
            })}
          </div>

          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground inline">
              Didn&apos;t receive the code?{" "}
            </p>
            <button
              onClick={handleResendOtp}
              className="text-sm font-semibold text-primary hover:text-primary/80 underline transition-colors"
            >
              Resend OTP
            </button>
          </div>

          <LoadingButton
            onClick={handleSubmit}
            isLoading={isLoading}
            size="lg"
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/40"
          >
            Verify Account
          </LoadingButton>
        </div>

        <p className="text-center text-muted-foreground text-xs mt-6">
          Enter the 6-digit code to verify your account
        </p>
      </div>
    </div>
  );
};

export default Verify;
