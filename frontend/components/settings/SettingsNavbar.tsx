"use client";
import { RootState } from "@/store/store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React,{useState} from "react";
import { BiAperture } from "react-icons/bi";
import { useSelector } from "react-redux";
import LeftSidebar from "../Home/LeftSidebar";
import { MenuIcon, Sheet } from "lucide-react";
import { SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "../ui/sheet";

const SettingsNavbae = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const router = useRouter();
  return (
    <nav className="w-full flex items-center justify-between h-[6vh] md:h-[7vh] bg-card border-b-1">
      <div
        onClick={() => router.push("/")}
        className="text-foreground cursor-pointer pl-4 md:pl-0 flex items-center gap-0 md:w-[20%] justify-start"
      >
        <BiAperture className="w-9 h-9 sm:w-10 sm:h-10 md:w-9 md:h-9" />
        <span className="hidden sm:block text-xl sm:text-2xl md:text-[28px] font-bold">
          Shadsocial.
        </span>
      </div>
      <div className="flex pr-6 md:pr-0 gap-4">
        <Image
          src={user?.profilePicture || "/noAvatar.png"}
          alt="Profile"
          height={28}
          width={28}
          className="rounded-full w-7 h-7 md:w-8 md:h-8"
        />
      </div>
      <div className="md:hidden">
  <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
    <SheetTrigger asChild>
      <button className="p-2 hover:bg-accent rounded-lg">
        <MenuIcon className="w-6 h-6 text-foreground" />
      </button>
    </SheetTrigger>
    <SheetContent side="right" className="w-[280px] pl-4 bg-background">
      <SheetTitle></SheetTitle>
      <SheetDescription></SheetDescription>
      <div className="text-foreground flex items-center gap-2 justify-start mb-4">
        <BiAperture className="w-10 h-10" />
        <span
          className="text-2xl font-bold"
          onClick={() => {
            router.push("/");
            setIsSheetOpen(false); // Close sheet
          }}
        >
          Shadsocial.
        </span>
      </div>
      <LeftSidebar onItemClick={() => setIsSheetOpen(false)} />
      <div className="h-full pb-10 flex items-end justify-center">
        <p className="text-muted-foreground align-self-bottom">
          Dev. @mdshad
        </p>
      </div>
    </SheetContent>
  </Sheet>
</div>
    </nav>
  );
};

export default SettingsNavbae;
