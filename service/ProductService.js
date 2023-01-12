const axios = require("axios");
const cheerio = require("cheerio");
// const pretty = require("pretty");
const { getItemByUrl } = require("../repository/ProductRepository");
const Product = require("../model/Product");
const { appErr } = require("../utils/appErr");

// const ProductService = async () => {
//   const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
//   const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
// };
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
const TrackProduct = async (url, from) => {
  try {
    const product = await getItemByUrl(url);
    console.log(product);
    if (product) {
      product.usersTracking.push(from);
      product.save();
      return `Tracer initialized for user ${from} for Product ${product.name}`;
    } else {
      const response = await fetch(url);
      const body = await response.text();
      const $ = cheerio.load(body);
      console.log($);
      const priceSpan = $(".a-price-whole");
      const productPrice = parseInt(priceSpan.text().replace(",", ""));
      const productTitleElem = $("#productTitle");
      if (!productTitleElem) {
        return "Invalid Product URL, kindly send only the Amazon product URL.";
      }
      const productTitle = $("#productTitle").text().trim();
      if (productPrice && productTitle) {
        const product = await Product.create({
          name: productTitle,
          url,
          prices: [productPrice],
          usersTracking: [from],
        });
        return `Tracer initialize for user ${from} for Product ${product.name}`;
      }
    }
  } catch (error) {
    throw appErr(error.message, 500);
  }
};

// do we need to use async await here?
const trackAndSendReply = async (from, to, url) => {
  const message = await TrackProduct(url, from);
  console.log("message", message);
  console.log("user number is", from);
  await client.messages.create({
    body: message,
    from: to,
    to: from,
  });
};

module.exports = { TrackProduct, trackAndSendReply };
