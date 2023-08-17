const axios = require('axios');
const cheerio = require('cheerio');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const cron = require('node-cron');
const {getAllItemsByUrl} = require('../repository/ProductRepository');

const scrapeProduct = async product => {
  try {
    const response = await axios.get(product.url);
    const $ = cheerio.load(response.data);
    const priceSpan = $('.a-price-whole').first();
    const currentProductPrice = parseInt(priceSpan.text().replace(/,/g, ''), 10);

    if (product.prices.length === 365) {
      product.prices.shift();
    }

    let flag = false;
    for (const price of product.prices) {
      if (price <= currentProductPrice) {
        flag = true;
        break;
      }
    }

    product.prices.push(currentProductPrice);
    await product.save();

    if (!flag) {
      for (const user of product.usersTracking) {
        try {
          await client.messages.create({
            body: `Price of ${product.name} has dropped to ${currentProductPrice}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: user.replace('whatsapp:', '')
          });
        } catch (error) {
          console.error('Twilio message sending error:', error);
        }
      }
    }
  } catch (error) {
    console.error('Scraping error:', error);
  }
};

const job = cron.schedule('*/20 * * * * *', async () => {
  try {
    const products = await getAllItemsByUrl();

    await Promise.all(
      products.map(async product => {
        await scrapeProduct(product);
      })
    );
  } catch (error) {
    console.error('Cron job error:', error);
  }
});

module.exports = job;
