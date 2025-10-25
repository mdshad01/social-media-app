export interface User {
  _id: string;
  username: string;
  email: string;
  password?: string;
  profilePicture?: string;
  backgroundImage?: string;
  city?: string;
  school?: string;
  work?: string;
  bio: string;
  website?: string;
  joined?: Date;
  followers: string[];
  following: string[];
  posts: Post[];
  savedPosts: string[] | Post[];
  isVerified: boolean;
}

export interface Comment {
  _id: string;
  text: string;
  user: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
  likes: string[];
  replies: Comment[];
  parentComment?: string;
  createdAt: string;
}

export interface Post {
  _id: string;
  postType?: "image" | "video" | "poll" | "event" | "text"; // ✅ Optional for old posts
  caption: string;

  // ✅ KEEP OLD FIELD
  image?: {
    url: string;
    publicId: string;
  };

  // ✅ NEW FIELDS
  video?: {
    url: string;
    publicId: string;
  };

  poll?: {
    question: string;
    options: Array<{
      text: string;
      votes: string[];
    }>;
    expiresAt?: Date;
  };

  event?: {
    title: string;
    date: Date;
    time: string;
    location: string;
    attendees: string[];
  };

  user: User | undefined;
  likes: string[];
  comments: Comment[];
  share: string[];
  createdAt: string;
  updatedAt: string;
}
