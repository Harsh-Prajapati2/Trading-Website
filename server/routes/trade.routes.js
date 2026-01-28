const express = require('express');
const router = express.Router();
const order = require('../models/order.model');
const mongoose = require('mongoose');
const Portfolio = require('../models/portfolio.model');
const Wallet = require('../models/wallet.model');
const StockPrice = require('../models/stockPrice.model');
const auth = require('../middlewares/auth');

router.post("/buy", auth, async (req, res) => {
  const { symbol, quantity } = req.body;
  const userId = req.user.userId;

  const priceData = await StockPrice.findOne({ symbol });
  if (!priceData) return res.status(400).json({ message: "Invalid stock" });

  const total = priceData.price * quantity;

  const wallet = await Wallet.findOne({ userId });
  if (wallet.balance < total) {
    return res.status(400).json({ message: "Insufficient balance" });
  }

  wallet.balance -= total;
  await wallet.save();

  await Order.create({
    userId,
    symbol,
    type: "BUY",
    quantity,
    price: priceData.price,
    amount: total
  });

  const portfolio = await Portfolio.findOne({ userId, symbol });

  if (!portfolio) {
    await Portfolio.create({
      userId,
      symbol,
      quantity,
      avgPrice: priceData.price
    });
  } else {
    const newQty = portfolio.quantity + quantity;
    const newAvg = ((portfolio.avgPrice * portfolio.quantity) + total) / newQty;

    portfolio.quantity = newQty;
    portfolio.avgPrice = newAvg;
    await portfolio.save();
  }

  return res.json({ message: "BUY Successful", balance: wallet.balance });
});


router.post("/sell", auth, async (req, res) => {
  const { symbol, quantity } = req.body;
  const userId = req.user.userId;

  const priceData = await StockPrice.findOne({ symbol });
  const portfolio = await Portfolio.findOne({ userId, symbol });

  if (!portfolio || portfolio.quantity < quantity) {
    return res.status(400).json({ message: "Not enough quantity" });
  }

  const sellAmount = priceData.price * quantity;
  const buyCost = portfolio.avgPrice * quantity;
  const profit = sellAmount - buyCost;

  const wallet = await Wallet.findOne({ userId });
  wallet.balance += sellAmount;
  await wallet.save();

  await Order.create({
    userId,
    symbol,
    type: "SELL",
    quantity,
    price: priceData.price,
    amount: sellAmount,
    pnl: profit
  });

  portfolio.quantity -= quantity;
  if (portfolio.quantity === 0) {
    await Portfolio.deleteOne({ _id: portfolio._id });
  } else {
    await portfolio.save();
  }

  return res.json({
    message: "SELL Successful",
    balance: wallet.balance,
    pnl: profit
  });
});

router.get("/orders", auth, async (req, res) => {
  const userId = req.user.userId;
  const orders = await Order.find({ userId }).sort({ createdAt: -1 });
  return res.json(orders);
});
module.exports = router;