function generatePrice(base) {
  const random = (Math.random() * 10 - 5); // -5 to +5
  const price = base + random;
  return Number(price.toFixed(2));
}

module.exports = generatePrice;