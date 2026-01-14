import { User } from "@/type";
import Image from "next/image";

type Props = {
  userProfile?: User;
};

const ProfileCard = ({ userProfile }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 md:px-0">
      <div className="relative md:h-56 h-44 w-full shadow">
        <Image
          src={
            userProfile?.backgroundImage ||
            "/banner1.svg"
          }
          alt=""
          fill
          className="md:rounded-md  object-cover"
        />
        <Image
          src={
            userProfile?.profilePicture ||
            "/noAvatar3.svg"
          }
          alt=""
          width={128}
          height={128}
          className="rounded-full object-cover w-34 h-34 bg-card absolute left-0 right-0 m-auto -bottom-16 ring-4 ring-accent z-10 shadow "
        />
      </div>
      <div className="relative w-full bg-card flex flex-col gap-4 items-center justify-center pt-2 pb-6 md:rounded-b-xl shadow-md">
        <div className="mt-16 md:mt-16 flex flex-col gap-4 items-center w-full">
          <span className="text-2xl font-bold text-foreground">
            {userProfile?.username}
          </span>
          <div className="flex gap-8 md:gap-12 items-center justify-center">
            <div className="flex flex-col items-center font-medium text-foreground group cursor-pointer">
              <span className="text-2xl font-bold text-primary group-hover:text-primary/80 transition-colors">{userProfile?.posts.length}</span>
              <span className="text-sm text-muted-foreground">Posts</span>
            </div>
            <div className="flex flex-col items-center font-medium text-foreground group cursor-pointer">
              <span className="text-2xl font-bold text-primary group-hover:text-primary/80 transition-colors">{userProfile?.followers.length}</span>
              <span className="text-sm text-muted-foreground">Followers</span>
            </div>
            <div className="flex flex-col items-center font-medium text-foreground group cursor-pointer">
              <span className="text-2xl font-bold text-primary group-hover:text-primary/80 transition-colors">{userProfile?.following.length}</span>
              <span className="text-sm text-muted-foreground">Following</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
