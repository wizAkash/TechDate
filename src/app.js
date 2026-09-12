const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const app = express();
const {validatorForSignup} = require('./utils/validator');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { userAuth } = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());

connectDB().then(() => {
    return User.init();
}).then(() => {
    console.log('Database connection and indexes ready');
    app.listen(3000, () => {
        console.log('Server running on port 3000...');
    })
}).catch((err) => {
    console.error('Database startup failed:', err.message);
})

//Get user by email id
// app.get('/user', async(req,res) => {
//     try {

//         // const userId = req.body.id;
//         // const user = await User.findById(userId);
//         // if(!user) {
//         //     res.status(404).send('User not found');
//         // } else {
//         //     res.send(user);
//         // }

//         // const userEmail = req.body.emailId;
//         // const user = await User.findOne({emailId: userEmail});
//         // if(!user) {
//         //     res.status(404).send('User not found');
//         // } else {
//         //     res.send(user);
//         // }


//         const userEmail = req.body.emailId;
//         const user = await User.find({emailId: userEmail});
//         if(user.length === 0) {
//             res.status(404).send('User not found');
//         } else {
//             res.send(user);
//         }
//     } catch (err) {
//         res.status(500).send('Error fetching user');
//     }
// })

//Get all users
// app.get('/feed', async(req,res) => {
//     try{
//         const users = await User.find();
//         if(users.length === 0) {
//             res.status(404).send('No users found');
//         } else{
//             res.send(users);
//         }
//     } catch(err) {
//         res.status(500).send('Error fetching users');
//     }
// })

//Create a new user
app.post('/signup', async(req, res) => {
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

app.post('/login', async(req, res) => {
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
        const token = jwt.sign({userId: user._id}, 'Secret@1#aka', {expiresIn: '1d'});
        res.cookie('token', token);
        
        res.send('User logged in scuccessfully');
    }catch(err) {
        res.status(400).send('Error logging in user : ' + err.message);
    }
})

app.get('/profile', userAuth, async(req, res) => {
    try{
        const user = req.user;

        res.send('User fetched successfully: ' + user);
    } catch(err) {
        res.status(500).send('Error fetching profile: ' + err.message);
    }
})

app.post ('/sendconnectionrequest', userAuth, async( req, res) => {
    try{
        const user = req.user;

        res.send(user.firstName + ' has sent you a connection request');
    }catch(err) {
        res.status(500).send('Error sending request : ' +err.message);
    }
})

//Update an user by id
// app.patch('/user/:userId', async(req, res) => {
//     try{
//         const ALLOWED_UPDATES = ['password', 'age', 'about', 'skills', 'photo'];
//         const updates = Object.keys(req.body);
//         const isValidOperation = updates.every((update) => ALLOWED_UPDATES.includes(update));
//         if(!isValidOperation) {
//             return res.status(400).send('Update not allowed');
//         }


//         //Update using email id
//         // const userEmail = req.body.emailId;
//         // const {emailId, ...updateData} = req.body;
//         // const user = await User.findOneAndUpdate({emailId: userEmail}, updateData);
//         // console.log(user);
//         // res.send('User updated successfully');




//         const userId = req.params.userId;
//         const updateData = req.body;
//         const user = await User.findByIdAndUpdate(userId, updateData, {runValidators: true});
//         console.log(user);
//         res.send('User updated successfully');
//     }catch(err) {
//         res.status(500).send('Error updating user: '+ err.message);
//     }
// });