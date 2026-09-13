const validator = require('validator');

const validatorForSignup = (req) => {
    const {firstName, lastName, emailId, password} = req.body;

    if(!firstName){
        throw new Error('First name is required');
    }
    if(!emailId) {
        throw new Error('Email is required');
    }
    if(!password) {
        throw new Error('Password is required');
    }

    if(!validator.isEmail(emailId)) {
        throw new Error('Enter a valid email address');
    }

    if(!validator.isStrongPassword(password)){
        throw new Error('Password is not strong enough');
    }
}

const validatorForEditProfile = (req) => {
    const allowedEditFields = ['firstName', 'lastName', 'age', 'gender', 'about', 'skills', 'photo'];

    const isAllowedEdit = Object.keys(req.body).every(key => allowedEditFields.includes(key));

    return isAllowedEdit;
}

module.exports = {
    validatorForSignup,
    validatorForEditProfile
}