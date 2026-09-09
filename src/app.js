const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const app = express();

app.use(express.json());

connectDB().then(() => {
    console.log('Database connection successfull');
    app.listen(3000, () => {
        console.log('Server running on port 3000...');
    })
})

//Get user by email id
app.get('/user', async(req,res) => {
    try {

        // const userId = req.body.id;
        // const user = await User.findById(userId);
        // if(!user) {
        //     res.status(404).send('User not found');
        // } else {
        //     res.send(user);
        // }

        // const userEmail = req.body.emailId;
        // const user = await User.findOne({emailId: userEmail});
        // if(!user) {
        //     res.status(404).send('User not found');
        // } else {
        //     res.send(user);
        // }


        const userEmail = req.body.emailId;
        const user = await User.find({emailId: userEmail});
        if(user.length === 0) {
            res.status(404).send('User not found');
        } else {
            res.send(user);
        }
    } catch (err) {
        res.status(500).send('Error fetching user');
    }
})

//Get all users
app.get('/feed', async(req,res) => {
    try{
        const users = await User.find();
        if(users.length === 0) {
            res.status(404).send('No users found');
        } else{
            res.send(users);
        }
    } catch(err) {
        res.status(500).send('Error fetching users');
    }
})

//Create a new user
app.post('/signup', async(req, res) => {
    try {
        const user = new User(req.body);

        await user.save();
        res.send('User created successfully')
    }catch(err) {
        res.status(500).send('Error creating user');
    }
})

//Update an user by id
app.patch('/user', async(req, res) => {
    try{
        //Update using email id
        // const userEmail = req.body.emailId;
        // const {emailId, ...updateData} = req.body;
        // const user = await User.findOneAndUpdate({emailId: userEmail}, updateData);
        // console.log(user);
        // res.send('User updated successfully');




        const userId = req.body.userId;
        const updateData = req.body;
        const user = await User.findByIdAndUpdate(userId, updateData);
        console.log(user);
        res.send('User updated successfully');
    }catch(err) {
        res.status(500).send('Error updating user');
    }
});