const ProductCategory = require("../../models/product-category.model");
const createTreeHelper = require("../../helpers/createTree");
module.exports.category = async (req, res, next) => {
  let find = {
    delected: false,
  };
  const productsCategory = await ProductCategory.find(find);
  const newproductsCategory = createTreeHelper.Tree(productsCategory);
  res.locals.layoutProductsCategory = newproductsCategory;
  next();
};
