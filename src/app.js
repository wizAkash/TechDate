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

app.post('/signup', async(req, res) => {
    try {
        const user = new User(req.body);

        await user.save();
        res.send('User created successfully')
    }catch(err) {
        res.status(500).send('Error creating user');
    }
})