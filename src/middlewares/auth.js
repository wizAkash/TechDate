const adminAuth = (req,res,next) => {
    console.log('Admin middleware');
    const token = '1772hhak';
    const isAdminAuthorized = token === '1772hhak';
    if(!isAdminAuthorized){
        res.status(401).send('Unauthorized user');
    } else {
        next();
    }
}

const userAuth = (req, res, next) => {
    console.log('User middleware');
    const token = 'userToken123';
    const isUserAuthorized = token === 'userToken123';
    if(!isUserAuthorized){
        res.status(401).send('Unauthorized user');
    } else {
        next();
    }
}

module.exports = {
    adminAuth,
    userAuth
}