const multer = require("multer");
const moment = require("moment");

const storage = multer.diskStorage({
  destination(req, file, cb) {
    console.log(file);

    cb(null, "static/avatar");
  },
  filename(req, file, cb) {
    console.log(file);

    const date = moment().format("DDMMYYYY-HHmmss_SSS");
    cb(null, `${file.fieldname}-${date}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  console.log(file);
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const limits = {
  fileSize: 1024 * 1025 * 5,
};

module.exports = multer({
  storage,
  fileFilter,
  limits,
});
