const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validatorForEditProfile } = require('../utils/validator');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const Validator = require('validator');

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

profileRouter.post('/password-update', userAuth, async(req,res) => {
    try{
        const {oldPassword, newPassword} = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).send('Old password and new password are required');
        }

        const user = req.user;

        //Check if old password is correct, then only allow to update the password
        const isOldPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
        if(!isOldPasswordCorrect) {
            return res.status(401).send('Incorrect old password');
        }

        //Check if the user is entering the same password again
        const isNewPasswordSame = await bcrypt.compare(newPassword, user.password);
        if(isNewPasswordSame){
            return res.status(401).send('New password must be different from old password');
        }

        //Check if the new password is strong
        if(!Validator.isStrongPassword(newPassword)) { 
            return res.status(401).send('Enter a strong password');
        }

        const newHashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = newHashedPassword;
        await user.save();

        res.json({message : 'Password updated successfully'})
    }catch(err){
        res.status(500).send('ERROR : ' + err.message);
    }
})

//Forgot password

module.exports = profileRouter;