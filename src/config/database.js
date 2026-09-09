const mongoose = require('mongoose');

const URI = 'mongodb+srv://mishraakash0718_db_user:uYv35off3RHeUNiD@cluster0.wd2515p.mongodb.net/TechDate';


const connectDB = async () => {
    await mongoose.connect(URI);
}

module.exports = connectDB;