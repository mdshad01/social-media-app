"use client";
import Image from "next/image";
import { ChangeEvent, FormEvent, useState } from "react";
import PasswordInput from "./PasswordInput";
import LoadingButton from "../Helper/LoadingButton";
import Link from "next/link";
import { BASE_API_URL } from "@/server";
import axios from "axios";
import { handleAuthRequest } from "../util/apiRequest";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setAuthUser } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import { Share2, Users, LayoutList, ShieldCheck, AlertCircle, Sparkles } from "lucide-react";
import { User } from "@/type";

interface FormData {
  email: string;
  password: string;
}

const Login = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showReactivateModal, setShowReactivateModal] = useState(false);
  const [deactivatedUserData, setDeactivatedUserData] = useState<User | null>(null);
  const [formData, setFormData] = useState<FormData>({ email: "", password: "" });

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReactivateAccount = async () => {
    const reactiveRequest = async () =>
      await axios.post(`${BASE_API_URL}/users/reactivate-account`, {}, { withCredentials: true });
    const result = await handleAuthRequest(reactiveRequest, setIsLoading);
    if (result) {
      dispatch(setAuthUser(result.data.data.user));
      toast.success("Account reactivated successfully!");
      setShowReactivateModal(false);
      router.push("/");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const loginReq = async () => axios.post(`${BASE_API_URL}/users/login`, formData, { withCredentials: true });
    const result = await handleAuthRequest(loginReq, setIsLoading);
    if (result) {
      const user = result.data.data.user;
      if (user.isDeleted) {
        setDeactivatedUserData(user);
        setShowReactivateModal(true);
      } else {
        dispatch(setAuthUser(user));
        toast.success(result.data.message);
        await new Promise(resolve => setTimeout(resolve, 100));
        router.push("/");
      }
    }
  };

  const features = [
    { icon: <Share2 className="w-5 h-5" />, title: "Seamless Sharing", desc: "Post updates, photos, and videos instantly." },
    { icon: <Users className="w-5 h-5" />, title: "Engage with Friends", desc: "Like, comment, and connect in real-time." },
    { icon: <LayoutList className="w-5 h-5" />, title: "Smart Feed", desc: "Stay updated with content you love." },
    { icon: <ShieldCheck className="w-5 h-5" />, title: "Private & Secure", desc: "Your data, your privacy — always protected." },
  ];

  const daysRemaining = deactivatedUserData
    ? Math.ceil((new Date(deactivatedUserData.deletionExecuteAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0;


  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-background to-primary/5">
      <div className="flex min-h-screen">
        {/* Left Side - Banner (Desktop Only) */}
        <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
          <Image src="/Banner8.jpg" alt="banner" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
          
          <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16">
            <div className="mb-8">
              <span className="inline-block px-4 py-2 bg-primary text-primary-foreground font-bold text-xl rounded-lg mb-6">
                SHADSOCIAL
              </span>
              <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
                Where Connections Turn Into Communities
              </h1>
              <p className="text-lg text-white/80 max-w-md">
                Create, connect, and discover with people who matter to you.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-lg">
              {features.map((item, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 hover:bg-white/15 transition-all duration-300 group">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary rounded-lg text-accent group-hover:bg-primary group-hover:text-white transition-colors">
                      {item.icon}
                    </div>
                    <h3 className="text-white font-semibold text-sm">{item.title}</h3>
                  </div>
                  <p className="text-white/60 text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-[45%] flex items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-primary">ShadSocial</span>
              </div>
              <p className="text-muted-foreground text-sm">Connect with friends and the world</p>
            </div>

            {/* Form Card */}
            <div className="bg-card border border-border/50 rounded-2xl p-6 sm:p-8 shadow-xl shadow-primary/5">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-2">Welcome Back</h2>
                <p className="text-muted-foreground text-sm">Sign in to continue to ShadSocial</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                  <input
                    name="email"
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-xl bg-accent/50 border border-border text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <PasswordInput label="Password" name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} />
                  <Link href="/auth/forget-password" className="text-primary hover:text-primary/80 text-sm font-medium mt-2 block text-right transition-colors">
                    Forgot Password?
                  </Link>
                </div>

                <LoadingButton
                  size="lg"
                  className="w-full mt-6 bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/40"
                  type="submit"
                  isLoading={isLoading}
                >
                  Sign In
                </LoadingButton>
              </form>

              <div className="mt-6 text-center">
                <p className="text-muted-foreground text-sm">
                  Don&apos;t have an account?{" "}
                  <Link href="/auth/signup" className="text-primary hover:text-primary/80 font-semibold transition-colors">Create Account</Link>
                </p>
              </div>
            </div>

            {/* Mobile Features */}
            <div className="lg:hidden mt-8 grid grid-cols-2 gap-3">
              {features.slice(0, 2).map((item, i) => (
                <div key={i} className="bg-card/50 border border-border/50 p-3 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 bg-primary/10 rounded-lg text-primary">{item.icon}</div>
                    <h3 className="text-foreground font-medium text-xs">{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center text-muted-foreground text-xs mt-6">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>


      {/* Reactivate Account Modal */}
      {showReactivateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-foreground">Account Deactivated</h2>
              <button onClick={() => setShowReactivateModal(false)} className="text-muted-foreground hover:text-foreground p-1">
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex gap-3">
                <AlertCircle className="text-destructive flex-shrink-0" size={24} />
                <div>
                  <p className="text-destructive font-medium mb-1">Your account is deactivated</p>
                  <p className="text-sm text-destructive/80">
                    You have <span className="font-semibold">{daysRemaining} days</span> remaining to reactivate.
                  </p>
                </div>
              </div>

              <p className="text-foreground text-sm">Would you like to reactivate your account? All your data will be restored.</p>

              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowReactivateModal(false)} className="px-4 py-2 border border-border rounded-xl hover:bg-accent text-foreground transition-colors">
                  Cancel
                </button>
                <button onClick={handleReactivateAccount} disabled={isLoading} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-colors">
                  {isLoading ? "Reactivating..." : "Reactivate"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
