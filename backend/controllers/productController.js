const { default: mongoose } = require('mongoose');
const products = require('../models/product');

exports.newProduct = async (req, res, next) => {
  const product = await products.create(req.body);
  res.status(201).json({
    success: true,
    product
  });
}
exports.getProducts = async (req, res) => {
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
};

exports.getSingleProduct = async (req, res) => { // api/v1/product/:id
  try {
    const product = await products.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
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
};

exports.updateProduct = async (req, res) => {
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


};
exports.deleteProduct = async (req, res) => {
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
};
