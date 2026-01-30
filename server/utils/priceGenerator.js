function generatePrice(base) {
  const random = (Math.random() * 10 - 5); // -5 to +5
  // console.log(random);
  const price = base + random;
  return Number(price.toFixed(2));

}
// const val = generatePrice(10);
// console.log(val);
module.exports = generatePrice;