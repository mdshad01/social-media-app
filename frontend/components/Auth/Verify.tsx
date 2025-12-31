"use client";
import { MailCheck } from "lucide-react";
import { VerifySkeleton } from "@/components/Skeleton";
import React, {
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
  // console.log(otp);
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
    <div className="h-screen flex flex-col justify-center items-center bg-background">
      <MailCheck className="w-20 h-20 sm:h-32 sm:w-32 text-primary mb-12" />
      <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-foreground">
        OTP Verification
      </h1>
      <p className="text-sm mb-6 sm:text-base font-medium text-muted-foreground">
        We have sent a code to {user?.email}
      </p>
      <div className="flex space-x-4">
        {[0, 1, 2, 3, 4, 5].map((index) => {
          return (
            <input
              type="number"
              maxLength={1}
              key={index}
              className="w-10 h-10 sm:h-24 sm:w-24 bg-muted text-foreground text-center rounded-lg text-lg sm:text-4xl font-bold outline-none focus:ring-2 focus:ring-primary no-spinner"
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
      <div className="flex items-center mt-4 space-x-2">
        <h3 className="text-sm sm:text-lg font-medium text-muted-foreground">
          Didn&apos;t get the otp?
        </h3>
        <button
          onClick={handleResendOtp}
          className="text-sm sm:text-lg font-medium text-primary hover:text-primary/80 underline transition-colors"
        >
          Resend code
        </button>
      </div>
      <LoadingButton
        onClick={handleSubmit}
        isLoading={isLoading}
        size={"lg"}
        className="mt-6 w-52"
      >
        Verify
      </LoadingButton>
    </div>
  );
};

export default Verify;
