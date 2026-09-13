const express = require('express');
const authRouter = express.Router();
const {validatorForSignup} = require('../utils/validator');
const bcrypt = require('bcrypt');
const User = require('../models/user');

authRouter.post('/signup', async(req, res) => {
    try {
        //Validate the request body
        validatorForSignup(req);

        const {firstName, lastName, emailId, password, gender } = req.body;
        //Encrypt the password
        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            ...req.body,
            password: passwordHash
        });

        await user.save();
        res.send('User created successfully')
    }catch(err) {
        res.status(500).send('Error creating user ' + err.message);
    }
})

authRouter.post('/login', async(req, res) => {
    try{
        const {email, password} = req.body;

        const user = await User.findOne({emailId : email});
        if(!user) {
            throw new Error('Invalid credentials');
        }


        const hashedPassword = user.password;
        const isPasswordMatch = await bcrypt.compare(password, hashedPassword);
        if(!isPasswordMatch) {
            throw new Error('Invalid credentials');
        }
        
        //Generate JWWT token
        const token = user.getToken();
        console.log('Token : ' +token);
        res.cookie('token', token);
        
        res.send('User logged in scuccessfully');
    }catch(err) {
        res.status(400).send('Error logging in user : ' + err.message);
    }
})

authRouter.post('/logout', async(req, res) => {
    res.clearCookie('token');
    res.send('User logged out successfully');
})

module.exports = authRouter;