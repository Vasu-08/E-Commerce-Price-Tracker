const express = require('express');
const getMessage = require('../controllers/ProductController');
const productRoute = express.Router();

productRoute.post('/', getMessage);

module.exports = productRoute;
