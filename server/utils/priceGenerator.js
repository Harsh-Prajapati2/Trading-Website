/**
 * Generate new price based on current price with ±0.05% change
 * @param {number} currentPrice - Current price of the stock
 * @returns {object} - { newPrice, percentageChange }
 */
function generatePrice(currentPrice) {
  // Random percentage change between -0.05% to +0.05%
  const percentageChangeRange = 0.05; // ±0.05%
  const randomPercentage = (Math.random() * (percentageChangeRange * 2)) - percentageChangeRange;
  
  // Calculate new price
  const changeAmount = currentPrice * (randomPercentage / 100);
  const newPrice = currentPrice + changeAmount;
  
  return {
    newPrice: Number(newPrice.toFixed(2)),
    percentageChange: Number(randomPercentage.toFixed(4)) // e.g., 0.0341 or -0.0215
  };
}

module.exports = generatePrice;