const { default: mongoose } = require('mongoose');
const products = require('../models/product');

const ErrorHandler = require('../utils/errorHandler');

const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIfeatures = require('../utils/apiFeatures')
exports.newProduct = catchAsyncErrors (async (req, res, next) => {
  
  const apiFeatures = new APIFeatures(product.find(), req.query)
            .search()
  
  const product = await apiFeatures.query;
  
  res.status(201).json({
    success: true,
    product
  });
});

exports.getProducts = catchAsyncErrors (async (req, res) => {
  try {
    const productlist = await products.find();
    res.status(200).json({
      success: true,
      count: productlist.length,
      productlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

exports.getSingleProduct = catchAsyncErrors( async (req, res) => { // api/v1/product/:id
  try {
    const product = await products.findById(req.params.id);
    if (!product) {
      return next(new ErrorHandler('Product not found', 404));
    }
    res.status(200).json({
      success: true,
      product
    });
  }
  catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

exports.updateProduct = catchAsyncErrors( async (req, res) => {
  let product = await products.findById(req.params.id);
  if (!product) {
    return res.status(404).json({
      success: false,
      error: 'Product not found'
    });

  }
  product = await products.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  });
  res.status(200).json({
    success: true,
    product
  });


});
exports.deleteProduct = catchAsyncErrors (async (req, res) => {
  const product = await products.findById(req.params.id);
  if (!product) {
    return res.status(404).json({
      success: false,
      error: 'Product not found'
    });
  }

  await products.findByIdAndDelete(req.params.id);

  return res.status(200).json({
    success: true,
    message: 'Product is deleted'
  });
});
