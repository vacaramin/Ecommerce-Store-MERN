const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, "please enter your name"],
        maxLength: [30, "Your name cannot exceed 30 charachters"]
    },
    email:{
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        validate: [validator.isEmail, 'Please enter a Valid email address'],

    },
    password:{
        type: String, 
        require:[true, "Please enter your password"],
        minlength: [6, "Password must be longer than 6 charachters"],
        select: false,
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
//Encrypting password Before saving user
userSchema.pre('save', async function(next){
    if (!this.isModified('password')){
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})

module.exports = mongoose.model('User', userSchema )