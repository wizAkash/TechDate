const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required: true,
        minLength: 3,
        maxLength: 40,
        trim: true
    },
    lastName: {
        type: String,
        minLength: 3,
        maxLength: 40,
        trim: true
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Enter a valid email address');
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 5
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        required: true,
        validate(value) {
            if(!['male','female','other'].includes(value)){
                throw new Error('Gender data is not valid');
            }
        },
        lowercase: true,
    },
    about: {
        type: String,
        default: 'This is the default about section.',
        trim: true
    },
    skills: {
        type: [String]
    },
    photo: {
        type: String
    }
},
{
    timestamps: true
})

const User = mongoose.model('User', userSchema);

module.exports = User;