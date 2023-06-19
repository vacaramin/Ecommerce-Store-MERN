const { default: mongoose } = require('mongoose');
const products = require('../models/product');

const ErrorHandler = require('../utils/errorHandler');

const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIFeatures = require('../utils/apiFeatures')
exports.newProduct = catchAsyncErrors (async (req, res, next) => {
  
  
  const product = await products.create(req.body) ;
  
  res.status(201).json({
    success: true,
    product
  });
});

exports.getProducts = catchAsyncErrors (async (req, res) => {
  
  const resperpage = 4;// results per page

  const apiFeatures = new APIFeatures(products.find(), req.query)
  .search()
  .filter()
  .pagination(resperpage)
    const productlist = await apiFeatures.query;
    res.status(200).json({
      success: true,
      count: productlist.length,
      productlist
    });
  
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
