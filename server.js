const dotenv = require('dotenv');

dotenv.config();

const express = require('express');
const cors = require('cors');
require('./config/dbConnect');
const productRoute = require('./routes/productRoute');
const errorHandler = require('./middlewares/errorHandler');
const ProductScraperJob = require('./schedulingTasks/ProductScraperJob');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));


// Schedule product scraping job
ProductScraperJob.start();

// Set up routes
app.use('/track', productRoute);

// Global error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
