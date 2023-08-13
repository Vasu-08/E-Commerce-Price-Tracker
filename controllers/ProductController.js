const {trackAndSendReply} = require('../service/ProductService');
const appError = require('../utils/appError');

async function getMessage(req, res, next) {
  const {From, To, Body} = req.body;
  try {
    await trackAndSendReply(From, To, Body);
    res.status(200).json({message: 'success'});
  } catch (error) {
    next(appError(error.message, 500));
  }
}

module.exports = getMessage;
