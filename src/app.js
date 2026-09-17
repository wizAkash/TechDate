const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const app = express();
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/authRouter');
const profileRouter = require('./routes/profileRouter');
const requestRouter = require('./routes/requestRouter');
const userRouter = require('./routes/userRouter');

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

app.use('/auth', authRouter);
app.use('/profile',profileRouter);
app.use('/request', requestRouter);
app.use('/user', userRouter);