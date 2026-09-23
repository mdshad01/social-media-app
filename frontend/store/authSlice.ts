import { User } from "@/type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: User | null;
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    updateFollowing: (state, action: PayloadAction<string>) => {
      if (state.user) {
        const userId = action.payload;
        const isFollowing = state.user.following.includes(userId);
        
        if (isFollowing) {
          // Unfollow: remove from following list
          state.user.following = state.user.following.filter(id => id !== userId);
        } else {
          // Follow: add to following list
          state.user.following.push(userId);
        }
      }
    },
  },
});

export const { setAuthUser, updateFollowing } = authSlice.actions;
export default authSlice.reducer;
