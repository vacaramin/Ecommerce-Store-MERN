const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, "please enter your name"],
        maxLength: [30, "Your name cannot exceed 30 charachters"]
    },
    email:{
        type: String,
        required: [true, "Please enter your email"],
        validate: [validator.isEmail, 'Please enter a Valid email address']
    },
    password:{
        type: String, 
        require:[true, "Please enter your password"],
        minLength: [6, "Password must be longer than 6 charachters"]
    },
    avatar:{
        public_id:{
            type: String, 
            required: true
        },
        url:{
            type: String,
            required: true
        }
    },
    role:{
        type: String,
        default: 'user'
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date

})