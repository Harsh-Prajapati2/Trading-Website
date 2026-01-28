const mongoose = require("mongoose");

const priceSchema = new mongoose.Schema({
  symbol: { type: String, required: true, unique: true },
  price: Number,
  change: Number,
  changePercent: Number,
  status: String,
  updatedAt: Date
});

module.exports = mongoose.model("StockPrice", priceSchema);