const cheerio = require('cheerio');
const {getItemByUrl} = require('../repository/ProductRepository');
const Product = require('../model/Product');
const appError = require('../utils/appError');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const TrackProduct = async (url, from, next) => {
  try {
    const product = await getItemByUrl(url);

    if (product) {
      if (!product.usersTracking.includes(from)) {
        product.usersTracking.push(from);
        product.save();
        return `Tracer initialized for user ${from} for Product ${product.name}`;
      } else {
        return `You are already tracking this product. You will be notified when the price of this product drops.`;
      }
    } else {
      const response = await fetch(url);
      const body = await response.text();
      const $ = cheerio.load(body);
      const priceSpan = $('.a-price-whole');
      const productPrice = parseInt(priceSpan.text().replace(',', ''));
      const productTitleElem = $('#productTitle');

      if (!productTitleElem) {
        return 'Invalid Product URL, kindly send only the Amazon product URL.';
      }

      const productTitle = $('#productTitle').text().trim();

      if (productPrice && productTitle) {
        const product = await Product.create({
          name: productTitle,
          url,
          prices: [productPrice],
          usersTracking: [from]
        });

        return `Tracer initialize for user ${from} for Product ${product.name}`;
      }
    }
  } catch (error) {
    next(appError(error.message, 500));
  }
};

const trackAndSendReply = async (from, to, url) => {
  const message = await TrackProduct(url, from);

  await client.messages.create({
    body: message,
    from: to,
    to: from
  });
};

module.exports = {TrackProduct, trackAndSendReply};
