var express = require("express");
var router = express.Router();
var authRouter = require("./auth");
var contentRoutes = require("./content");
var uploaderRoutes = require("./uploader");
var userRoutes = require("./user");

/* Routes */
router.use("/auth", authRouter);
router.use("/content", contentRoutes);
router.use("/upload", uploaderRoutes);
router.use("/user", userRoutes);

module.exports = router;
