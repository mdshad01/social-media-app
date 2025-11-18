import { Activity, ActivityStats } from "@/type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface ActivityState {
    activities:Activity[];
    stats:ActivityStats;
}

const initialState: ActivityState = {
  activities: [],
  stats: {                
    totalPosts: 0,
    totalComments: 0,
    totalLikes: 0,
    totalFollows: 0,
  },
};

const activitySlice = createSlice({
    name: "activity",
    initialState,
    reducers:{
        setActivity:(state,action:PayloadAction<Activity[]>) => {
            state.activities = action.payload;
        },
        setActivityStats: (state, action: PayloadAction<ActivityStats>) => {
            state.stats = action.payload;
        }
    }
});

export const {setActivity, setActivityStats} = activitySlice.actions;

export default activitySlice.reducer;