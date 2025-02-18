module.exports.priceNewProducts = (products) => {
  const newProducts = products.map((item) => {
    item.priceNew = (
      ((100 - item.discountPercentage) * item.price) /
      100
    ).toFixed(0);
    return item;
    //de lam tron so thap phan khong lay so 0
  });
  return newProducts;
};
module.exports.priceNewProduct = (product) => {
  const priceNew = (
    ((100 - product.discountPercentage) * product.price) /
    100
  ).toFixed(0);
  return priceNew;
};
