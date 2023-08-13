const mongoose = require('mongoose');

async function dbConnect() {
  try {
    mongoose.set('strictQuery', true);
    mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

module.exports = dbConnect;
