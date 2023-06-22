const express = require('express');

const app = express();

const errorMiddleware = require('./middlewares/errors');

const cookieParser = require('cookie-parser');

app.use(express.json()); 
// Importing the product routes
app.use(cookieParser())
const products = require('./routes/product');
const auth = require('./routes/user');
const order = require('./routes/order')

app.use('/api/v1', products);
app.use('/api/v1', auth);
app.use('/api/v1', order);

//Middleware to handle errors
app.use(errorMiddleware);

module.exports = app;