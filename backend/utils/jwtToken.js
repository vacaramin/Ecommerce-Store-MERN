//Create and send Token in the cookie
const sendToken = (user, statusCode, res) => {

    //Generating JWT Token
    const token = user.getJwtToken();
    //Option for cookie
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE_TIME * 24 * 60 * 60 * 1000
        ),
        httpOnly:true
    }
    res.status(statusCode).cookie('token', token, options).json({
        success: 'true',
        user, 
        token
    })
}
module.exports = sendToken;