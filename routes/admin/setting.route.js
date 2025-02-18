const express = require("express");
const multer = require("multer");
const storageMulterSettingGeneral = require("../../helpers/storageMulterSettingGeneral");
const upload = multer({ storage: storageMulterSettingGeneral() });
const router = express.Router();
const controller = require("../../controllers/admin/setting.controller");
router.get("/general", controller.general);
router.patch("/general", upload.single("logo"), controller.generalPatch);
module.exports = router;
