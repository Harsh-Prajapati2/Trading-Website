const mongoose = require("mongoose");
const Stock = require("../models/stock.model");
const data = require("./stocks.json"); // put your 100 records here
require("dotenv").config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Stock.deleteMany({});
    await Stock.insertMany(data);
    console.log("Stocks seeded successfully");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();