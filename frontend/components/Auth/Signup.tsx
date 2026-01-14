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
import { setAuthUser } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Share2, Users, LayoutList, ShieldCheck, Sparkles } from "lucide-react";

interface FormData {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

const Signup = () => {
  const dispatch = useDispatch();

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const signupReq = async () =>
      axios.post(`${BASE_API_URL}/users/signup`, formData, {
        withCredentials: true,
      });
    const result = await handleAuthRequest(signupReq, setIsLoading);
    if (result) {
      dispatch(setAuthUser(result.data.data.user));
      toast.success(result.data.message);
      
      // Small delay to ensure Redux state is persisted before navigation
      await new Promise(resolve => setTimeout(resolve, 100));
      router.push("/auth/verify");
    }
  };

  const features = [
    { icon: <Share2 className="w-5 h-5" />, title: "Seamless Sharing", desc: "Post updates, photos, and videos instantly." },
    { icon: <Users className="w-5 h-5" />, title: "Engage with Friends", desc: "Like, comment, and connect in real-time." },
    { icon: <LayoutList className="w-5 h-5" />, title: "Smart Feed", desc: "Stay updated with content you love." },
    { icon: <ShieldCheck className="w-5 h-5" />, title: "Private & Secure", desc: "Your data, your privacy — always protected." },
  ];

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
                    <div className="p-2 bg-primary/20 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
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
                <h2 className="text-2xl font-bold text-foreground mb-2">Create Account</h2>
                <p className="text-muted-foreground text-sm">Join ShadSocial today</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-foreground mb-2">Username</label>
                  <input
                    name="username"
                    type="text"
                    id="username"
                    placeholder="Choose a username"
                    className="w-full px-4 py-3 rounded-xl bg-accent/50 border border-border text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>

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
                  <PasswordInput
                    label="Password"
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <PasswordInput
                    label="Confirm Password"
                    name="passwordConfirm"
                    placeholder="Confirm your password"
                    value={formData.passwordConfirm}
                    onChange={handleChange}
                  />
                </div>

                <LoadingButton
                  size="lg"
                  className="w-full mt-6 bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/40"
                  type="submit"
                  isLoading={isLoading}
                >
                  Create Account
                </LoadingButton>
              </form>

              <div className="mt-6 text-center">
                <p className="text-muted-foreground text-sm">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="text-primary hover:text-primary/80 font-semibold transition-colors">Sign In</Link>
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
              By signing up, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
