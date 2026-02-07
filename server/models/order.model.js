const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  symbol: String,
  type: { type: String, enum: ["BUY", "SELL"], required: true },
  quantity: Number,
  price: Number,
  amount: Number,
  pnl : Number,
  status: { type: String, default: "completed" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);