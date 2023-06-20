const User = require('../models/user');

const ErrorHandler = require('../utils/errorHandler');

const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail')
//Register a user => /api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {

    const { name, email, password } = req.body;
    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: 'whogivesaFuck',
            url: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_light_color_272x92dp.png'
        }
    })
    sendToken(user,200,res)

})
// Login User =? api/v1/login

exports.loginUser = catchAsyncErrors (async (req, res, next)=>{
    const {email, password}= req.body;
    //check if email and password is entered by user
    if(!email || !password){
        return next(new ErrorHandler('Please enter email and Password', 400));
    }
    //Finding user in Database
    const user = await User.findOne({email}).select('+password');
    if (!user){
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched){
        return next (new ErrorHandler('Invalid Email or Password'))
    }
    sendToken(user,200,res)

})

// Forgot Password => /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors( async(req, res, next)=>{
    const user = await User.findOne({email: req.body.email});
    if(!user){
        return next(new ErrorHandler('user not found with this email', 404))
    }
    //GET reset Token
    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave: false})

    //Create reset password url
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/reset/${resetToken}`;
    const message = `Your Password Reset Token is: \n\n${resetURL}\n\n If you have not requested this email, Then ignore it`
    try {
        await sendEmail({
            email: user.email,
            subject: "Mern Ecommerce Password Recovery Email",
            message

        })
        res.status(200).json({
            success:true,
            message: "email sent to user"
        })
    } catch (error) {
        user.getResetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        
        await user.save({validateBeforeSave: false});
        return next(new ErrorHandler(error.message, 500));
    }  

})

//Logout user => api/v1/logout
exports.logoutUser = catchAsyncErrors (async (req, res, next) =>{
    res.cookie('token', null,{
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({
        success: true,
        message: 'logged out'
    })
})