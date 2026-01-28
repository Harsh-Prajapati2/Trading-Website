const cron = require("node-cron");
const StockMaster = require("../models/stock.model");
const StockPrice = require("../models/stockPrice.model");
const generatePrice = require("../utils/priceGenerator");

cron.schedule("*/5 * * * * *", async () => {
  const stocks = await StockMaster.find({});
  
  for (let s of stocks) {
    let base = Math.random() * 2000 + 100;
    let newPrice = generatePrice(base);

    await StockPrice.updateOne(
      { symbol: s.symbol },
      {
        $set: {
          price: newPrice,
          change: Number((newPrice - base).toFixed(2)),
          changePercent: Number(((newPrice - base) / base * 100).toFixed(2)),
          status: newPrice >= base ? "up" : "down",
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );
  }

  // console.log("Prices updated");
});

module.exports = {};