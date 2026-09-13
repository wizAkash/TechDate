const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

requestRouter.post ('/sendconnectionrequest', userAuth, async( req, res) => {
    try{
        const user = req.user;

        res.send(user.firstName + ' has sent you a connection request');
    }catch(err) {
        res.status(500).send('Error sending request : ' +err.message);
    }
})

module.exports = requestRouter;