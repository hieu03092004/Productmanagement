const Cart = require("../../models/cart.model");
const Product = require("../../models/models.products");
const Order = require("../../models/order.model");
const productsHelper = require("../../helpers/products");
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;
  const cart = await Cart.findOne({ _id: cartId });
  if (cart.products.length > 0) {
    for (const item of cart.products) {
      const productId = item.product_id;
      const productInfo = await Product.findOne({
        _id: productId,
      });
      productInfo.priceNew = productsHelper.priceNewProduct(productInfo);
      item.productInfo = productInfo;
      item.totalPrice = item.quantity * productInfo.priceNew;
    }
  }
  cart.totalPrice = cart.products.reduce(
    (total, item) => total + item.totalPrice,
    0
  );
  res.render("client/pages/checkout/index.pug", {
    pageTitle: "Đặt hàng",
    cartDetail: cart,
  });
};
//[POST] /checkout/order
module.exports.order = async (req, res) => {
  const cartId = req.cookies.cartId;
  const userInfo = req.body;
  const cart = await Cart.findOne({
    _id: cartId,
  });
  let products = [];
  for (const product of cart.products) {
    const objectProduct = {
      product_id: product.product_id,
      price: 0,
      discountPercentage: 0,
      quantity: product.quantity,
    };
    const productInfo = await Product.findOne({
      _id: product.product_id,
    });
    const newStock = productInfo.stock - product.quantity;
    await Product.updateOne(
      {
        _id: product.product_id,
      },
      {
        stock: newStock,
      }
    );

    objectProduct.price = productInfo.price;
    objectProduct.discountPercentage = productInfo.discountPercentage;
    products.push(objectProduct);
  }
  const objectOrder = {
    //user_id:String,
    cart_id: cartId,
    userInfo: userInfo,
    products: products,
  };
  const order = new Order(objectOrder);
  await order.save();
  await Cart.updateOne(
    {
      _id: cartId,
    },
    {
      products: [],
    }
  );
  res.redirect(`/checkout/success/${order._id}`);
};
module.exports.success = async (req, res) => {
  const order = await Order.findOne({ _id: req.params.orderId });
  let totalPrice = 0;
  for (const product of order.products) {
    const productInfo = await Product.findOne({
      _id: product.product_id,
    }).select("title thumbnail");
    product.productInfo = productInfo;
    product.priceNew = (
      ((100 - product.discountPercentage) * product.price) /
      100
    ).toFixed(0);
    product.totalPrice = product.quantity * product.priceNew;
    totalPrice += product.quantity * product.priceNew;
  }
  order.totalPrice = totalPrice;
  res.render("client/pages/checkout/success.pug", {
    pageTitle: "Đặt hàng thành công",
    order: order,
  });
};
