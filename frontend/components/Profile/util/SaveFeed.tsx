// frontend/components/Profile/util/SaveFeed.tsx
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Post, User } from "@/type";
import PostCard from "@/components/Home/Util/PostCard";

type Props = {
  userProfile: User | undefined;
};

const SaveFeed = ({ userProfile }: Props) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const allPosts = useSelector((state: RootState) => state.posts.posts);

  // Get saved post IDs from userProfile
  const savedPostIds = userProfile?.savedPosts?.map((post: Post | string) => 
    typeof post === 'string' ? post : post._id
  ) || [];

  // Filter posts from Redux that are in savedPosts
  const savedPosts = allPosts.filter((post) => 
    savedPostIds.includes(post._id)
  );

  // No saved posts
  if (!savedPosts || savedPosts.length === 0) {
    return (
      <div className="p-4 bg-card shadow-md rounded-lg mt-6">
        <p className="text-center text-accent py-8">No saved posts yet</p>
      </div>
    );
  }

  return (
    <div className="py-4 bg-background shadow-md rounded-lg flex flex-col gap-12 mt-6 scrollbar-hide">
      {savedPosts.map((post, index) => (
        <PostCard key={post._id || index} post={post} user={user} />
      ))}
    </div>
  );
};

export default SaveFeed;
