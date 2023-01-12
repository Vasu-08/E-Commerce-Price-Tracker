const { trackAndSendReply } = require("../service/ProductService");
const { appErr } = require("../utils/appErr");
const getMessage = async (req) => {
  console.log(req.body);
  const { From, To, Body } = req.body;
  console.log(From, To, Body);
  try {
    await trackAndSendReply(From, To, Body);
  } catch (error) {
    throw appErr(error.message, 500);
  }
};

module.exports = { getMessage };
