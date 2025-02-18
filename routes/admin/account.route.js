const express = require("express");
const multer = require("multer");
const storageMulterAccounts = require("../../helpers/storageMulterAccounts");
const upload = multer({ storage: storageMulterAccounts() });
const router = express.Router();
const controller = require("../../controllers/admin/accounts.controller");
const validate = require("../../validates/admin/accounts.validate");
router.get("/", controller.index);
router.get("/create", controller.create);
router.get("/edit/:id", controller.edit);
router.post(
  "/create",
  upload.single("avatar"),
  validate.createPost,
  controller.createPost
);
router.patch(
  "/edit/:id",
  upload.single("avatar"),
  validate.editPatch,
  controller.editPatch
);
module.exports = router;
