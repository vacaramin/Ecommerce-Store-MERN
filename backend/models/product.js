const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please enter product name'],
        trim:true,
        maxLength:[100,'Product name cannot exceed 100 characters']
    },
})