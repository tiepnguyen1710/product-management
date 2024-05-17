const express = require("express");
const router = express.Router();
const multer  = require('multer');

const controller = require("../../controllers/admin/account.controller");
const validate = require("../../validates/admin/account.validate");

const upload = multer();

router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
  "/create",
  upload.single('avatar'),
  //uploadCloud.uploadSingle,
  validate.createPost,
  controller.createPost
);

module.exports = router;