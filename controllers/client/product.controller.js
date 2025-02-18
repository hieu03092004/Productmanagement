const Product = require("../../models/models.products");
const ProductCategory = require("../../models/product-category.model");
const productsHelper = require("../../helpers/products");
const productsCategoryHelper = require("../../helpers/product-category");

module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    delected: false,
  }).sort({ position: "desc" });
  const newProducts = productsHelper.priceNewProducts(products);
  // console.log(products);
  res.render("client/pages/products/index.pug", {
    pageTitle: "Danh sách sản phẩm",
    products: newProducts,
  });
};
//[GET]/products/:slug
module.exports.detail = async (req, res) => {
  try {
    const find = {
      delected: false,
      slug: req.params.slugProduct,
    };
    const product = await Product.findOne(find);
    if (product.product_category_id) {
      const category = await ProductCategory.findOne({
        _id: product.product_category_id,
        status: "active",
        delected: false,
      });
      product.category = category;
    }
    product.priceNew = productsHelper.priceNewProduct(product);
    res.render("client/pages/products/detail.pug", {
      pageTitle: product.title,
      product: product,
    });
  } catch (err) {
    res.redirect("/products");
  }
};
//[GET]/products/:slugCategory
module.exports.category = async (req, res) => {
  try {
    const category = await ProductCategory.findOne({
      slug: req.params.slugCategory,
      delected: false,
    });
    const listSubCategory = await productsCategoryHelper.getSubCategory(
      category.id
    );
    const listSubCategoryId = listSubCategory.map((item) => item.id);
    const products = await Product.find({
      product_category_id: { $in: [category.id, ...listSubCategoryId] },
      delected: false,
      status: "active",
    }).sort({ position: "desc" });
    const newProducts = productsHelper.priceNewProducts(products);
    res.render("client/pages/products/index.pug", {
      pageTitle: category.title,
      products: newProducts,
    });
  } catch (err) {
    res.redirect("/products");
  }
};
