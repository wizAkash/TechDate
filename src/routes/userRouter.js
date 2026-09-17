const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

//Check all intrests received in my profile
userRouter.get('/request/received', userAuth, async(req, res) => {
    try{
        const loggedInUser = req.user;
        
        const allRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: 'intrested'
        }).populate('fromUserId', USER_SAFE_DATA);

        const data = allRequests.map((ele) => ele.fromUserId);

        res.json({
            message: "Data fetched Successfully",
            data
        });
    }
    catch(err) {
        res.status(400).send('ERROR : '+ err.message);
    }
})

//Get all my connections
userRouter.get('/connections', userAuth, async(req, res) => {
    try{
        const loggedInUser = req.user;

        const allConnections = await ConnectionRequest.find({
            $or: [
                {
                    fromUserId: loggedInUser._id,
                    status: 'accepted'
                },
                {
                    toUserId: loggedInUser._id,
                    status: 'accepted'
                }
            ]
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);

        const data = allConnections.map((ele) => {
            if(ele.fromUserId.equals(loggedInUser)){
                return ele.toUserId;
            }
            return ele.fromUserId;
        })

        res.json({
            message: "Data fetched successfully",
            data
        })
    } 
    catch(err) {
        res.status(400).send('ERROR : ' + err.message);
    }
})

userRouter.get('/feed', userAuth, async(req, res) => {
    try{
        const loggedInUser = req.user;
        const page = req.query.page || 1;
        let limit = req.query.limit || 10;

        limit = limit>500 ? 5 : limit;

        const skip = (page-1)*limit;

        const allRequests = await  ConnectionRequest.find({
            $or: [
                {
                    fromUserId: loggedInUser._id
                },
                {
                    toUserId: loggedInUser._id
                }
            ]
        }).select("fromUserId toUserId").populate("fromUserId", "firstName lastName about skills").populate("toUserId", "firstName lastName about skills");

        const hiddenUsers = new Set();
        allRequests.forEach((row) => {
            if(row.fromUserId._id.equals(loggedInUser._id)){
                return hiddenUsers.add(row.toUserId._id.toString());
            }
            return hiddenUsers.add(row.fromUserId._id.toString());
        })

        const feedData = await User.find({
            $and: [
                {
                    _id: {
                        $nin: Array.from(hiddenUsers)
                    }
                },
                {
                    _id: {
                        $ne: loggedInUser.id
                    }
                }
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

        res.json({data: feedData});
    }
    catch(err) {
        res.status(400).send('ERROR : ' + err.message);
    }
})

module.exports = userRouter;