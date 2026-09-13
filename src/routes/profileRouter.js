const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

profileRouter.get('/', userAuth, async(req, res) => {
    try{
        const user = req.user;

        res.send('User fetched successfully: ' + user);
    } catch(err) {
        res.status(500).send('Error fetching profile: ' + err.message);
    }
})

module.exports = profileRouter;