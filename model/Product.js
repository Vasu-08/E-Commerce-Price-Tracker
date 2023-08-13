const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    url: String,
    prices: [],
    usersTracking: []
  },
  {
    timestamps: true,
    toJSON: {virtuals: true}
  }
);

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
