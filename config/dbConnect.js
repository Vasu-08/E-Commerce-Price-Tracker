const mongoose = require("mongoose");
const dbConnect = async () => {
  try {
    // mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
};
dbConnect();
