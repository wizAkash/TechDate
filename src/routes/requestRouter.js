const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const User = require('../models/user')
const ConnectionRequest = require('../models/connectionRequest');

//Sending connection request
requestRouter.post ('/sendconnectionrequest/:status/:userId', userAuth, async( req, res) => {
    try{
        const fromUser = req.user;
        const fromUserId = fromUser._id;
        const toUserId = req.params.userId;
        const status = req.params.status;
        const allowedStatus = ['intrested', 'ignored'];

        if(fromUserId.equals(toUserId)){
            return res.status(400).send('Cannot send connection request to yourself');
        }

        const toUser = await User.findById(toUserId);
        if(!toUser) { 
            return res.status(400).send('User not found!');
        }

        if(!allowedStatus.includes(status)) {
            return res.status(400).send('Invalid status type');
        }

        const isExistingRequest = await ConnectionRequest.findOne({
            $or: [
                {fromUserId: fromUserId, toUserId: toUserId},
                {fromUserId: toUserId, toUserId: fromUserId}
            ]
        })

        if(isExistingRequest) {
            return res.status(400).send('Already existing request');
        }

        const newConnectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        const data = await newConnectionRequest.save();

        res.json({
            message: `${req.user.firstName} has sent a ${status} request to ${toUser.firstName}`,
            data: {data}
        })
    }
    catch(err) {
        res.status(500).send("ERROR : "+err.message);
    }
})

//Reviewing the connection request
requestRouter.post('/review/:status/:requestId', userAuth, async(req,res) => {
    try{
        const loggedInUser = req.user;
        const { requestId, status } = req.params;

        const allowedStatus = ["accepted", "rejected"];
        if(!allowedStatus.includes(status)) {
            return res.status(400).send('Invalid status type');
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "intrested"
        });

        if(!connectionRequest) {
            return res.status(404).send('Connection request not found');
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save();

        res.json({
            message: "Connection request accepted successfully",
            data
        })
    }
    catch(err) {
        res.status(400).send('ERROR : '+err.message);
    }
})

module.exports = requestRouter;