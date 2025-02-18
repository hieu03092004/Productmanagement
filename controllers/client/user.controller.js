const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");
const Cart = require("../../models/cart.model");
const md5 = require("md5");
const generateHelper = require("../../helpers/generate.js");
const sendMailHelper = require("../../helpers/sendMail.js");
module.exports.register = async (req, res) => {
  res.render("client/pages/user/register.pug", {
    pageTitle: "Đăng ký tài khoản",
  });
};
module.exports.registerPost = async (req, res) => {
  const existEmail = await User.findOne({
    email: req.body.email,
    deleted: false,
  });
  if (existEmail) {
    req.flash("error", "Email đã tồn tại");
    res.redirect("back");
    return;
  }
  req.body.password = md5(req.body.password);
  const user = new User(req.body);
  await user.save();
  res.cookie("tokenUser", user.tokenUser);
  res.redirect("/");
};
// [GET] /user/login
module.exports.login = async (req, res) => {
  res.render("client/pages/user/login.pug", {
    pageTitle: "Đăng nhập tài khoản",
  });
};
module.exports.loginPost = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({
    email: email,
    deleted: false,
  });
  if (!user) {
    req.flash("error", "Email không tồn tại");
    res.redirect("back");
    return;
  }
  if (md5(password) != user.password) {
    req.flash("error", "Sai mật khẩu");
    res.redirect("back");
    return;
  }
  if (user.status == "inactive") {
    req.flash("error", "Tài khoản đang bị khóa");
    res.redirect("back");
    return;
  }
  res.cookie("tokenUser", user.tokenUser);
  await User.updateOne(
    {
      _id: user.id,
    },
    {
      statusOnline: "online",
    }
  );
  _io.once("connection", (socket) => {
    socket.broadcast.emit("SERVER_RETURN_USER_ONLINE", user.id);
  });
  //luu user_id vao collection cart
  await Cart.updateOne(
    {
      _id: req.cookies.cartId,
    },
    {
      user_id: user.id,
    }
  );

  res.redirect("/");
};
// [GET] /user/logout
module.exports.logout = async (req, res) => {
  await User.updateOne(
    {
      _id: res.locals.user.id,
    },
    {
      statusOnline: "offline",
    }
  );
  _io.once("connection", (socket) => {
    socket.broadcast.emit("SERVER_RETURN_USER_OFFLINE", res.locals.user.id);
  });
  res.clearCookie("tokenUser");
  res.redirect("/");
};
// [GET] /user/password/forgot
module.exports.forgotPassword = async (req, res) => {
  res.render("client/pages/user/forgot-password.pug", {
    pageTitle: "Lấy lại mật khẩu",
  });
};
module.exports.forgotPasswordPost = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({
    email: email,
    deleted: false,
  });
  if (!user) {
    req.flash("error", "Email không tồn tại");
    res.redirect("back");
    return;
  }

  // Việc 1 :Tạo mã OTP và lưu OTP,email  vào collection forgot-password
  const otp = generateHelper.generateRandomNumber(8);
  const objetcForgotPassword = {
    email: email,
    otp: "",
    expireAt: Date.now(),
  };
  objetcForgotPassword.otp = otp;
  const forgotPassword = new ForgotPassword(objetcForgotPassword);
  await forgotPassword.save();
  //Việc 2:Gửi mã OTP qua email của user
  const subject = "Mã OTP xác minh lấy lại mật khẩu";
  const html = `Mã OTP xác minh lấy lại mật khẩu của bạn là:<b> ${otp}</b>.Thời hạn sử dụng là 3 phút.Lưu ý không chia sẻ mã này với người khác`;
  sendMailHelper.sendMail(email, subject, html);
  res.redirect(`/user/password/otp?email=${email}`);
};
module.exports.otpPassword = async (req, res) => {
  const email = req.query.email;
  res.render("client/pages/user/otp-password.pug", {
    pageTitle: "Nhập mã OTP",
    email: email,
  });
};
module.exports.otpPasswordPost = async (req, res) => {
  const { email, otp } = req.body;
  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp,
  });
  if (!result) {
    req.flash("error", "OTP không hợp lệ");
    res.redirect("back");
    return;
  }
  const user = await User.findOne({
    email: email,
  });
  res.cookie("tokenUser", user.tokenUser);
  res.redirect("/user/password/reset");
};
module.exports.resetPassword = async (req, res) => {
  res.render("client/pages/user/reset-password.pug", {
    pageTitle: "Đổi mật khẩu",
  });
};
module.exports.resetPasswordPost = async (req, res) => {
  const password = req.body.password;
  const tokenUser = req.cookies.tokenUser;
  const user = await User.findOne({
    tokenUser: tokenUser,
  });
  console.log(user.password);
  await User.updateOne(
    {
      tokenUser: tokenUser,
    },
    {
      password: md5(password),
    }
  );
  const newUser = await User.findOne({
    tokenUser: tokenUser,
  });
  req.flash("success", "Đổi mật khẩu thành công");
  res.redirect("/");
};
module.exports.info = async (req, res) => {
  res.render("client/pages/user/info.pug", {
    pageTitle: "Thông tin tài khoản",
  });
};
