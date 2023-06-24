const Order = require('../models/order')
const Product = require('../models/product')

const ErrorHandler = require('../utils/errorHandler')
const catchAsyncError = require('../middlewares/catchAsyncErrors')

// Create a new Order /api/v1/order/new

exports.newOrder = catchAsyncError(async (req, res, next) => {

    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    } = req.body
    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user._id
    })

    res.status(200).json({
        success: true,
        order
    })

})


// Get single order => /api/v1/order:id
exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email')
    
    if(!order){
        return next(new ErrorHandler('no Order found with this ID', 404))
    }

    res.status(200).json({
        success: true,
        order
    })
})


// Get logged in user order => /api/v1/orders/me
exports.myOrders = catchAsyncError(async (req, res, next) => {
    const order = await Order.find({user: req.user.id})
    
    res.status(200).json({
        success: true,
        order
    })
})



// Get all orders => /api/v1/admins/orders/
exports.allOrders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find()
    let totalAmount = 0;
    orders.forEach(order => { 
        totalAmount += order.totalPrice
    });
    res.status(200).json({
        success: true,
        orders,
        totalAmount
    })
})