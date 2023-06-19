const User = require('../models/user');

const ErrorHandler = require('../utils/errorHandler');

const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

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
    res.status(201).json({
        success: true,
        user
    })

})