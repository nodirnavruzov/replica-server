var express = require("express");
var router = express.Router();
const { uploader } = require('../controller/uploaderController')
const upload = require("../middleware/upload");

router.post("/upload-image", upload.single("image"), uploader);

module.exports = router;
