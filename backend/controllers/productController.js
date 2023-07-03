const { default: mongoose } = require('mongoose');
const products = require('../models/product');

const ErrorHandler = require('../utils/errorHandler');

const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIFeatures = require('../utils/apiFeatures');



exports.newProduct = catchAsyncErrors(async (req, res, next) => {

  req.body.user = req.user.id;

  const product = await products.create(req.body);

  res.status(201).json({
    success: true,
    product
  });
});

exports.getProducts = catchAsyncErrors(async (req, res) => {

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

exports.getSingleProduct = catchAsyncErrors(async (req, res) => { // api/v1/product/:id
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

exports.updateProduct = catchAsyncErrors(async (req, res) => {
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
exports.deleteProduct = catchAsyncErrors(async (req, res) => {
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


//Create new Review => /api/v1/review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment
  }
  const product = await products.findById(productId);
  console.log(product.reviews)
  const isReviewed = product.reviews.find(
    r => r.user.toString() === req.user._id.toString()
  )

  if (isReviewed) {//updating old review
    product.reviews.forEach(review => {
      if (review.user.toString() === req.user._id.toString()) {
        review.comment = comment;
        review.rating = rating;
      }
    })
  } else {// new Review
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }
  product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

  await product.save({ validateBeforeSave: false })
  res.status(200).json({
    success: true
  })
})


// Get all reviews of a specific product => api/v1/reviews
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await products.findById(req.query.id);
  res.status(200).json({
    success: true,
    reviews: product.reviews
  })
})


// Delete review => api/v1/reviews
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await products.findById(req.query.productId);

  const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString())

  const numOfReviews = reviews.length

  const ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length
  await products.findByIdAndUpdate(req.query.productId, {
    reviews, ratings, numOfReviews
  },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false
    }
  )

  res.status(200).json({
    success: true
  })
})

