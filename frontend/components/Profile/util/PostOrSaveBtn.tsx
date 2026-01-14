import { cn } from "@/lib/utils";
import { Bookmark, Grid3x3 } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

type Props = {
  postOrSave: string;
  setPostOrSave: Dispatch<SetStateAction<string>>;
  isProfileOwn: boolean;
};

const PostOrSaveBtn = ({ postOrSave, setPostOrSave, isProfileOwn }: Props) => {
  return (
    <div className="mt-6 flex items-center justify-center bg-card rounded-xl shadow-md border border-border/50 p-1">
      <div className="flex items-center gap-2 w-full">
        <button
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 rounded-lg cursor-pointer transition-all duration-200 font-medium",
            postOrSave === "POST" 
              ? "bg-primary text-primary-foreground shadow-sm" 
              : "text-muted-foreground hover:bg-accent/50"
          )}
          onClick={() => setPostOrSave("POST")}
        >
          <Grid3x3 className="w-5 h-5" />
          <span>Posts</span>
        </button>
        
        {isProfileOwn && (
          <button
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 rounded-lg cursor-pointer transition-all duration-200 font-medium",
              postOrSave === "SAVE" 
                ? "bg-primary text-primary-foreground shadow-sm" 
                : "text-muted-foreground hover:bg-accent/50"
            )}
            onClick={() => setPostOrSave("SAVE")}
          >
            <Bookmark className="w-5 h-5" />
            <span>Saved</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default PostOrSaveBtn;
