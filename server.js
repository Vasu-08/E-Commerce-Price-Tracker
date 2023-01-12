require("dotenv").config();
const express = require("express");
const app = express();
// const cors = require("cors");
require("./config/dbConnect");
const productRoute = require("./routes/productRoute");
const globalErrHandler = require("./middlewares/globalErrHandler");
const { getMessage } = require("./controllers/ProductController");
// const { appErr } = require("./utils/appErr");
require("./schedulingTasks/ProductScraperJob");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use(cors());

// app.use("/", (req, res) => {
//   res.send(appErr("Error", 500));
// });

// app.post("/track", getMessage);
app.use("/track", productRoute);


app.use(globalErrHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
