// const appErr = require("../utils/appErr");
const cheerio = require("cheerio");
// const Product = require("../model/Product");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
const cron = require("node-cron");
const { getAllItemsByUrl } = require("../repository/ProductRepository");
const scrapeProduct = async (product) => {
  const response = await fetch(product.url);
  const body = await response.text();
  const $ = cheerio.load(body);
  const priceSpan = $(".a-price-whole");
  const currentProductPrice = parseInt(priceSpan.text().replace(",", ""));
  if (product.prices.length == 365) {
    product.prices.remove(0);
  }
  let flag = false;
  let arr = product.prices;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] <= currentProductPrice) {
      flag = true;
      break;
    }
  }
  product.prices.push(currentProductPrice);
  product.save();
  if (!flag) {
    for (let i = 0; i < product.usersTracking.length; i++) {
      await client.messages.create({
        body: `Price of ${product.name} has dropped to ${currentProductPrice}`,
        from: product.usersTracking[i],
        to: process.env.TWILIO_PHONE_NUMBER,
      });
    }
  }
};
const job = cron.schedule("0 0 * * *", async () => {
  const products = await getAllItemsByUrl();
  console.log(products);
  products.forEach(async (product) => {
    await scrapeProduct(product);
  });
});

job.start();
