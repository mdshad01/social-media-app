import Comment from "../models/commentModel.js";
import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import catchAsync from "../utils/catchAsync.js";

export const getActivity = catchAsync( async (req,res,next) => {
    const userId = req.user._id;

    // Calculate 30 days ago

    const thirtyDays = new Date();
    thirtyDays.setDate(thirtyDays.getDate() - 30);

    // 1. Get user's posts from last 30 days

    const userPosts = await Post.find({user:userId,createdAt:{$gte:thirtyDays}}).select(`_id caption image likes updatedAt`);

    const postIds = userPosts.map(post => post._id);

    // 2. Get comments on user's posts (last 30 days)

    const comments = await Comment.find({post:{$in:postIds},createdAt:{$gte:thirtyDays}}).populate('user','username profilePicture').populate('post','caption image').sort({createdAt: -1}).limit(50);

    const commentActivities = comments.map(comment => ({
        type:"comment",
        user:comment.user,
        post:comment.post,
        comment:comment.text,
        createdAt:comment.createdAt,
    }));

    // 3. Get likes on user's posts

    const likeActivities = [];

    for(const post of userPosts) {
        if(post.likes && post.likes.length > 0) {

            // get like user details
            const likes = await User.find({_id:{$in:post.likes}}).select('username profilePicture').limit(10);

            likes.forEach(like => {
                likeActivities.push({
                    type:"like",
                    user:like,
                    post:{_id:post._id,caption:post.caption,image:post.image},
                    createdAt:post.updatedAt
                });
            });
        }
    }

    // Get new followers

    const currentUser = await User.findById(userId).populate('followers', 'username profilePicture createdAt');

    const followerActivities = currentUser.followers.slice(-10).map(follower => ({
        type:"follow",
        user:follower,

    }));

    // combine all activity

    const allActivities = [
        ...commentActivities,
        ...likeActivities,
        ...followerActivities
    ];


    // 6. Sort by date (newst first)

    allActivities.sort((a,b) =>  new Date(b.createdAt) - new Date(a.createdAt));

    // 7. Limit to 100 avtivities
    const limitedActivities = allActivities.slice(0, 100);

    const stats = {
        totalLikes: likeActivities.length,
        totalComments: commentActivities.length,
        totalFollowers: currentUser.followers.length
    };

    res.status(200).json({
    status: "success",
    results: limitedActivities.length,
    data: {
      activities: limitedActivities,
      stats
    }
  });
});