const Product = require("../../models/models.products");
const productsHelper = require("../../helpers/products");
module.exports.index = async (req, res) => {
  const keyword = req.query.keyword;
  let newProducts = [];
  if (keyword) {
    const keywordRegex = new RegExp(keyword, "i");
    const products = await Product.find({
      title: keywordRegex,
      status: "active",
      delected: false,
    });
    newProducts = productsHelper.priceNewProducts(products);
  }
  res.render("client/pages/search/index.pug", {
    pageTitle: "Kết quả tìm kiếm",
    keyword: keyword,
    products: newProducts,
  });
};
