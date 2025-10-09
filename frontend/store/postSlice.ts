import { Comment, Post } from "@/type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PostState {
  posts: Post[];
}

const initialState: PostState = {
  posts: [],
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPost: (state, action: PayloadAction<Post[]>) => {
      state.posts = action.payload;
    },
    addPost: (state, action: PayloadAction<Post>) => {
      state.posts.unshift(action.payload);
    },
    deletePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter((post) => post._id !== action.payload);
    },
    likeOrDislike: (state, action: PayloadAction<{ postId: string; userId: string }>) => {
      const post = state.posts.find((post) => post._id === action.payload.postId);
      if (post) {
        if (post.likes.includes(action.payload.userId)) {
          post.likes = post.likes.filter((id) => id !== action.payload.userId);
        } else {
          post.likes.push(action.payload.userId);
        }
      }
    },
    addComment: (state, action: PayloadAction<{ postId: string; comment: Comment }>) => {
      const post = state.posts.find((post) => post._id === action.payload.postId);
      if (post) {
        post.comments.push(action.payload.comment);
      }
    },
    deleteComment: (state, action: PayloadAction<{ postId: string; commentId: string }>) => {
      const post = state.posts.find((post) => post._id === action.payload.postId);
      if (post) {
        post.comments = post.comments.filter((comment) => comment._id !== action.payload.commentId);
      }
    },
  },
});

export const { setPost, addPost, deletePost, likeOrDislike, addComment, deleteComment } = postSlice.actions;

export default postSlice.reducer;
