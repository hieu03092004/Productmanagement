const Cart = require("../../models/cart.model");
module.exports.cartId = async (req, res, next) => {
  if (!req.cookies.cartId) {
    const cart = new Cart();
    await cart.save();
    const expriesTime = 1000 * 60 * 60 * 24 * 365;
    res.cookie("cartId", cart._id, {
      expires: new Date(Date.now() + expriesTime),
    });
  } else {
    const cart = await Cart.findOne({ _id: req.cookies.cartId });
    cart.totalQuantity = cart.products.reduce(
      (total, product) => total + product.quantity,
      0
    );
    res.locals.miniCart = cart;
  }
  next();
};
