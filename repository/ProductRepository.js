const Product = require("../model/Product");
const { appErr } = require("../utils/appErr");

const getItemByUrl = async (url) => {
  try {
    const product = await Product.findOne({ url });
    if (product) {
      return product;
    } else {
      return false;
    }
  } catch (error) {
    throw (appErr(err.message, 500));
  }
};

const getAllItemsByUrl = async () => {
  const products = await Product.find();
  return products;
};

module.exports = { getItemByUrl, getAllItemsByUrl };
