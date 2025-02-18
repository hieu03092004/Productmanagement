const SettingGeneral = require("../../models/settings-general.model");
// [GET] /admin/settings/general
module.exports.general = async (req, res) => {
  const settingGeneral = await SettingGeneral.findOne({});
  // mac dinh no se lay ra ban ghi dau tien trong bang
  res.render("admin/pages/settings/general.pug", {
    pageTitle: "Cài đặt chung",
    settingGeneral: settingGeneral,
  });
};
// [PATCH] /admin/settings/general
module.exports.generalPatch = async (req, res) => {
  const settingGeneral = await SettingGeneral.findOne({});
  if (settingGeneral) {
    if (req.file) {
      req.body.logo = `/uploads/settings-general/${req.file.filename}`;
    }
    await SettingGeneral.updateOne(
      {
        _id: settingGeneral.id,
      },
      req.body
    );
  } else {
    if (req.file) {
      req.body.logo = `/uploads/settings-general/${req.file.filename}`;
    }
    const record = new SettingGeneral(req.body);
    await record.save();
  }
  req.flash("success", "Cập nhật thành công!");
  res.redirect("back");
};
