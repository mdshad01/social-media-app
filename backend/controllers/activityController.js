import Comment from "../models/commentModel.js";
import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import catchAsync from "../utils/catchAsync.js";

export const getActivity = catchAsync(async (req, res, next) => {
    const userId = req.user._id;
    const thirtyDays = new Date();
    thirtyDays.setDate(thirtyDays.getDate() - 30);

    // 1. Get posts YOU created
    const userPosts = await Post.find({
        user: userId,
        createdAt: { $gte: thirtyDays }
    }).select('_id caption image createdAt');

    const postActivities = userPosts.map(post => ({
        type: "post",
        post: {
            _id: post._id,
            caption: post.caption,
            image: post.image
        },
        createdAt: post.createdAt
    }));

    // 2. Get comments YOU made (on any post)
    const userComments = await Comment.find({
        user: userId,  // ← Comments YOU made
        createdAt: { $gte: thirtyDays }
    })
    .populate('post', 'caption image user')
    .sort({ createdAt: -1 })
    .limit(50);

    const commentActivities = userComments.map(comment => ({
        type: "comment",
        comment: comment.text,
        post: comment.post,
        createdAt: comment.createdAt
    }));

    // 3. Get posts YOU liked
    const likedPosts = await Post.find({
        likes: userId,  // ← Posts where YOU are in the likes array
        createdAt: { $gte: thirtyDays }
    })
    .populate('user', 'username profilePicture')
    .select('_id caption image user createdAt')
    .limit(50);

    const likeActivities = likedPosts.map(post => ({
        type: "like",
        post: {
            _id: post._id,
            caption: post.caption,
            image: post.image,
            user: post.user
        },
        createdAt: post.createdAt
    }));

    // 4. Get users YOU followed
    const currentUser = await User.findById(userId)
        .populate('following', 'username profilePicture createdAt');

    const followActivities = currentUser.following.slice(-10).map(user => ({
        type: "follow",
        user: {
            _id: user._id,
            username: user.username,
            profilePicture: user.profilePicture
        },
        createdAt: user.createdAt
    }));

    // Combine all activities
    const allActivities = [
        ...postActivities,
        ...commentActivities,
        ...likeActivities,
        ...followActivities
    ];

    // Sort by date (newest first)
    allActivities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Limit to 100 activities
    const limitedActivities = allActivities.slice(0, 100);

    const stats = {
        totalPosts: postActivities.length,
        totalComments: commentActivities.length,
        totalLikes: likeActivities.length,
        totalFollows: followActivities.length
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
