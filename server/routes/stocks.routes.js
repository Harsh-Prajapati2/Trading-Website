const express = require("express");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();
const API_KEY = process.env.ALPHA_VANTAGE_KEY;
const Stock = require("../models/stock.model");

router.get("/", async (req, res) => {
    const stocks = await Stock.find({});
    return res.json(stocks);
});
// GET real-time stock quote
router.get("/quote/:symbol", async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();

    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;

    const { data } = await axios.get(url);

    if (!data["Global Quote"]) {
      return res.status(404).json({ message: "Invalid symbol or no data" });
    }

    const quote = data["Global Quote"];

    return res.json({
      symbol: quote["01. symbol"],
      open: quote["02. open"],
      high: quote["03. high"],
      low: quote["04. low"],
      price: quote["05. price"],
      volume: quote["06. volume"],
      latestTradingDay: quote["07. latest trading day"],
      previousClose: quote["08. previous close"],
      change: quote["09. change"],
      changePercent: quote["10. change percent"]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching stock data" });
  }
});

router.get("/search/:keyword", async (req, res) => {
  try {
    const keyword = req.params.keyword;
    const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${keyword}&apikey=${API_KEY}`;

    const { data } = await axios.get(url);

    return res.json(data.bestMatches || []);
  } catch (err) {
    res.status(500).json({ message: "Error searching stocks" });
  }
});

router.get("/candles/:symbol", async (req, res) => {
  try {
    const symbol = req.params.symbol;

    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&interval=1min&symbol=${symbol}&apikey=${API_KEY}`;

    const { data } = await axios.get(url);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching candles" });
  }
});

module.exports = router;