const Role = require("../../models/role.model");
const Account = require("../../models/account.model");
const md5 = require("md5");
const systemConfig = require("../../config/system");
module.exports.index = async (req, res) => {
  let find = {
    delected: false,
  };
  const records = await Account.find(find).select("-password -token");
  for (const record of records) {
    const role = await Role.findOne({
      delected: false,
      _id: record.role_id,
    });
    record.role = role.title;
  }
  res.render("admin/pages/accounts/index.pug", {
    pageTitle: "Danh sách tài khoản",
    records: records,
  });
};
module.exports.create = async (req, res) => {
  const roles = await Role.find({
    delected: false,
  });
  res.render("admin/pages/accounts/create.pug", {
    pageTitle: "Tạo mới tài khoản",
    roles: roles,
  });
};
module.exports.createPost = async (req, res) => {
  try {
    const emailExist = await Account.findOne({
      email: req.body.email,
      delected: false,
    });
    if (emailExist) {
      req.flash("error", `Email ${req.body.email} đã tồn tại!`);
      res.redirect("back");
      return;
    }
    if (req.file) {
      req.body.avatar = `/uploads/accounts/${req.file.filename}`;
    }
    req.body.password = md5(req.body.password);
    const record = new Account(req.body);
    await record.save();
    req.flash("success", "Thêm mới tài khoản thành công!");
  } catch (err) {
    req.flash("error", "Thêm mới tài khoản thất bại!");
  }
  res.redirect(`${systemConfig.prefixAdmin}/accounts`);
};
module.exports.edit = async (req, res) => {
  let find = {
    _id: req.params.id,
    delected: false,
  };
  try {
    const data = await Account.findOne(find);
    const roles = await Role.find({ delected: false });
    res.render("admin/pages/accounts/edit.pug", {
      pageTitle: "Cập nhật  tài khoản",
      data: data,
      roles: roles,
    });
  } catch (err) {
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
};
//[PATCH] /admin/admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  const emailExist = await Account.findOne({
    _id: { $ne: id },
    email: req.body.email,
    delected: false,
  });
  if (emailExist) {
    req.flash("error", `Email ${req.body.email} đã tồn tại!`);
  } else {
    if (req.body.password) {
      req.body.password = md5(req.body.password);
    } else {
      delete req.body.password;
    }
    if (req.file) {
      req.body.avatar = `/uploads/accounts/${req.file.filename}`;
    }
    await Account.updateOne({ _id: id }, req.body);
    req.flash("success", "Cập nhật tài khoản thành công!");
  }
  res.redirect("back");
};
