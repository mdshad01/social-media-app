import React from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";

const ProfileCard = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();
  console.log(user);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md flex flex-col gap-6">
      <div className="relative h-20">
        <Image
          src="https://images.pexels.com/photos/32637548/pexels-photo-32637548.jpeg"
          alt=""
          fill
          className="rounded-md object-cover"
        />
        <Image
          src="https://images.pexels.com/photos/24902523/pexels-photo-24902523.jpeg"
          alt=""
          width={48}
          height={48}
          className="rounded-full object-cover w-12 h-12 absolute left-0 right-0 m-auto -bottom-6 ring-1 ring-white z-10 "
        />
      </div>
      <div className="h-22 flex flex-col gap-2 items-center ">
        <span className="text-xl font-semibold">Jhon Carter</span>
        <div className="flex items-center gap-4">
          <div className="flex">
            <Image
              src="https://images.pexels.com/photos/24902523/pexels-photo-24902523.jpeg"
              alt=""
              width={12}
              height={12}
              className="rounded-full object-cover w-3 h-3"
            />
            <Image
              src="https://images.pexels.com/photos/24902523/pexels-photo-24902523.jpeg"
              alt=""
              width={12}
              height={12}
              className="rounded-full object-cover w-3 h-3"
            />
            <Image
              src="https://images.pexels.com/photos/24902523/pexels-photo-24902523.jpeg"
              alt=""
              width={12}
              height={12}
              className="rounded-full object-cover w-3 h-3"
            />
          </div>
          <span className="text-sm text-gray-500">500 Followers</span>
        </div>
        <button className="bg-blue-500 text-white text-xs p-2 rounded-md">My Profile</button>
      </div>
    </div>
  );
};

export default ProfileCard;
