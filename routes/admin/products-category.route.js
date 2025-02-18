const express = require("express");
const multer  = require('multer');
const storageMulterCategory = require("../../helpers/storageMulterCategory");
const upload = multer({storage:storageMulterCategory()});
const router = express.Router();
const controller = require("../../controllers/admin/products-category.controller");
const validate = require("../../validates/admin/products-category.validate");
router.get("/", controller.index);
router.get("/create", controller.create);
router.get("/edit/:id", controller.edit);
router.patch("/edit/:id",upload.single('thumbnail'),validate.createPost,controller.editPatch);
router.post("/create", 
upload.single('thumbnail'),
validate.createPost,
controller.createPost,
);
module.exports = router;