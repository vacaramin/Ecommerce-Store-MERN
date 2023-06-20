const User = require('../models/user');

const ErrorHandler = require('../utils/errorHandler');

const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');

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