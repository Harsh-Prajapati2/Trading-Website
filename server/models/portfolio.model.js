const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  symbol: String,
  quantity: Number,
  avgPrice: Number
});

module.exports = mongoose.model("Portfolio", portfolioSchema);