const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const Portfolio = require('../models/portfolio.model');
const Order = require('../models/order.model');
const StockPrice = require('../models/stockPrice.model');


router.get("/portfolio", auth, async (req, res) => {
  const userId = req.user.userId;

  const portfolio = await Portfolio.find({ userId });

  return res.json(portfolio);
});

router.get("/portfolio/detail", auth, async (req, res) => {
  const userId = req.user.userId;

  // get portfolio
  const portfolio = await Portfolio.find({ userId });

  // get live prices
  const symbols = portfolio.map(p => p.symbol);
  const prices = await StockPrice.find({ symbol: { $in: symbols } });

  const map = {};
  prices.forEach(p => map[p.symbol] = p.price);

  const result = portfolio.map(p => {
    const current = map[p.symbol] || p.avgPrice;

    const unreal = (current - p.avgPrice) * p.quantity;
    const percent = ((current - p.avgPrice) / p.avgPrice) * 100;

    return {
      symbol: p.symbol,
      quantity: p.quantity,
      avgPrice: p.avgPrice,
      currentPrice: current,
      unrealized: Number(unreal.toFixed(2)),
      percent: Number(percent.toFixed(2))
    }
  });

  return res.json(result);
});

router.get("/pnl/realized", auth, async (req, res) => {
  const userId = req.user.userId;

  const orders = await Order.find({ userId, type: "SELL" });

  const total = orders.reduce((sum, o) => sum + (o.pnl || 0), 0);

  res.json({
    realizedPnL: Number(total.toFixed(2))
  });
});
module.exports = router;


