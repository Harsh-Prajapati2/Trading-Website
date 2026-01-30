const mongoose = require("mongoose");

const priceSchema = new mongoose.Schema({
  symbol: { type: String, required: true, unique: true },
  price: Number,
  basePrice: { type: Number, default: 0 }, // Original price when server started
  change: Number, // Price change amount
  changePercent: Number, // Cumulative percentage change from basePrice
  status: String, // "up" or "down"
  sector: String, // Stock sector from master stock data
  updatedAt: Date
});

module.exports = mongoose.model("StockPrice", priceSchema);