const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validatorForEditProfile } = require('../utils/validator');
const User = require('../models/user');

//Get profile
profileRouter.get('/', userAuth, async(req, res) => {
    try{
        const user = req.user;

        res.send('User fetched successfully: ' + user);
    } catch(err) {
        res.status(500).send('Error fetching profile: ' + err.message);
    }
})

//Update profile
profileRouter.post('/edit', userAuth, async(req, res) => {
    try {
        const loggedInUser = req.user;

        if(!validatorForEditProfile(req)) {
            throw new Error('Invalid fields for edit');
        }

        const updatedUser = await User.findOneAndUpdate({_id: loggedInUser._id}, req.body, {new: true, runValidators: true});
        res.json({message: "User has been updated successfully", user : updatedUser})


    }catch(err) {
        res.status(500).send('Error updating the profile : ' + err.message)
    }
})

//Forgot password

module.exports = profileRouter;