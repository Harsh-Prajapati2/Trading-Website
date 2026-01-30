const cron = require("node-cron");
const StockMaster = require("../models/stock.model");
const StockPrice = require("../models/stockPrice.model");
const generatePrice = require("../utils/priceGenerator");

/**
 * Price update job runs every 3 seconds
 * Updates prices with ±0.05% change and tracks cumulative percentage change
 */
cron.schedule("*/3 * * * * *", async () => {
  try {
    const stocks = await StockMaster.find({});
    
    for (let stock of stocks) {
      let stockPrice = await StockPrice.findOne({ symbol: stock.symbol });

      // If stock price doesn't exist, create it with current price
      if (!stockPrice) {
        // Generate a random initial price between 100 and 5000
        const initialPrice = Math.floor(Math.random() * 4900) + 100;
        
        stockPrice = await StockPrice.create({
          symbol: stock.symbol,
          price: initialPrice,
          basePrice: initialPrice,
          change: 0,
          changePercent: 0,
          status: "neutral",
          sector: stock.sector, // Include sector from master stock
          updatedAt: new Date()
        });
      } else {
        // Make sure basePrice is valid (not 0)
        const validBasePrice = stockPrice.basePrice && stockPrice.basePrice > 0 ? stockPrice.basePrice : stockPrice.price;
        
        // Generate new price based on current price (±0.05% change)
        const priceData = generatePrice(stockPrice.price);
        const newPrice = priceData.newPrice;
        const percentageChange = priceData.percentageChange;

        // Calculate cumulative percentage change from basePrice
        const changeAmount = Number((newPrice - validBasePrice).toFixed(2));
        const cumulativeChangePercent = validBasePrice > 0 
          ? Number(((changeAmount / validBasePrice) * 100).toFixed(4))
          : 0;

        // Determine status (up or down)
        const status = newPrice >= validBasePrice ? "up" : "down";

        // Update stock price
        await StockPrice.updateOne(
          { symbol: stock.symbol },
          {
            $set: {
              price: newPrice,
              basePrice: validBasePrice,
              change: changeAmount,
              changePercent: cumulativeChangePercent,
              status: status,
              updatedAt: new Date()
            }
          }
        );
      }
    }

    // Uncomment to see logs
    // console.log("Prices updated at", new Date().toLocaleTimeString());
  } catch (error) {
    console.error("Error updating stock prices:", error);
  }
});

module.exports = {};