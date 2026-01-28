const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
  symbol: { type: String, unique: true },
  name: String,
  sector: String
});

module.exports = mongoose.model("Stock", stockSchema);