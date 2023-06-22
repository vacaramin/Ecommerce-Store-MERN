const User = require('../models/user');

const ErrorHandler = require('../utils/errorHandler');

const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')
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
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;
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

// Reset Password => /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors(async (req, res, next)=>{
    //hashing url token to check it with database, because we have stored the token as hash in DB
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user = await User.findOne({
        resetPasswordToken, 
        resetPasswordExpire: {$gt:Date.now()}
    })
    if(!user){
        return next (new ErrorHandler('Password reset token is invalid or has been expired'))
    }
    if(req.body.password !== req.body.confirmPassword){
        return next (new ErrorHandler('Password Does not Match', 400))
    }
    //setup new Password 
    user.password = req.body.password;
    user.getResetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendToken(user, 200, res);       


})

//Get Currently login User => /api/v1/me
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id)
    res.status(200).json({
        success: true,
        user
    })
})

// Update / Change Password => /api/v1/password/update

exports.updatePassword = catchAsyncErrors (async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');
    
    // Check previous user password
    const isMatched = await user.comparePassword(req.body.oldPassword)
    if(!isMatched){
        return next(new ErrorHandler('Old Password is incorrect'), 400);
    }
    user.password = req.body.password;
    await user.save();

    sendToken(user, 200, res);



})

//Update user Profile  = > /api/v1/me/update
exports.updateProfile = catchAsyncErrors (async (req, res, next)=> {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    }
    //Update Avatar
    
    const user = await User.findByIdAndUpdate(req.user.id, newUserData,{
        new: true,
        runValidators: true,
        userFindAndModify: false
    })
    res.status(200).json({
        success:true
    })

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


// Admin Routes

//Get all Users => /api/v1/admin/users

exports.allUsers = catchAsyncErrors( async (req, res, next)=>{
    const users = await User.find();
    res.status(200).json({
        success:true,
        users 
    })
})



//Get user details => api/v1/admin/user/:id
exports.getUserDetails = catchAsyncErrors (async (req, res, next)=>{
    
    const user = await User.findById(req.params.id);
    if(!user){
        console.log("user not found pe tou agaya")
        return next(new ErrorHandler(`User not found with id: ${req.params.id}`, 404))
    }
    res.status(200).json({
        success: true,
        user
    })

})

//Update user   = > /api/v1/admin/user/:id
exports.updateUser= catchAsyncErrors (async (req, res, next)=> {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }
    //Update Avatar
    
    const user = await User.findByIdAndUpdate(req.params.id, newUserData,{
        new: true,
        runValidators: true,
        userFindAndModify: false
    })
    res.status(200).json({
        success:true
    })

})


//Delete user => api/v1/admin/user/:id
exports.deleteUser = catchAsyncErrors (async (req, res, next)=>{
    
    const user = await User.findById(req.params.id);
    if(!user){
        console.log("user not found pe tou agaya")
        return next(new ErrorHandler(`User not found with id: ${req.params.id}`, 404))
    }
    await user.deleteOne();
    //remove avatar - TODO
    res.status(200).json({
        success: true
    })

})