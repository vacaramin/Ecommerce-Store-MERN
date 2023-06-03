const { default: mongoose } = require('mongoose');
const products = require('../models/product');
const product = require('../models/product');

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