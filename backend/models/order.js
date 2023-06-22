const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({

    shippingInfo:{
        address:{
            type: String,
            required: true
        },
        city:{
            type: String,
            required: true
        },
        phoneNo:{
            type: String,
            required: true
        },
        postalCode:{
            type: String,
            required: true
        },
        country:{
            type: String,
            required: true
        },
        user:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref:'User'
        }
        
    }
})
module.exports = mongoose.model('Order', orderSchema)