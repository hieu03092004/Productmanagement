const Product = require("../../models/models.products");
const productsHelper = require("../../helpers/products");
module.exports.index = async (req, res) => {
  // lay ra san pham noi bat
  const productsFeatured = await Product.find({
    featured: "1",
    delected: false,
    status: "active",
  }).limit(6);
  const newProductsFeatured = productsHelper.priceNewProducts(productsFeatured);
  // Hết lấy ra sản phẩm nổi bật
  const productsNew = await Product.find({
    delected: false,
    status: "active",
  })
    .sort({ position: "desc" })
    .limit(6);
  // Hết hiển thị danh sách sản phẩm mới nhất
  const newProductsNew = productsHelper.priceNewProducts(productsNew);
  res.render("client/pages/home/index.pug", {
    pageTitle: "Trang chủ",
    productsFeatured: newProductsFeatured,
    productsNew: newProductsNew,
  });
};
module.exports.test = async (req, res) => {
  // lay ra san pham noi bat
  res.send("Day la trang test")
};
