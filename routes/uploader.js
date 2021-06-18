var express = require("express");
var router = express.Router();

const upload = require("../middleware/upload");

router.post("/upload-image", upload.single("image"), async (req, res) => {
  console.log(upload);

  try {
    res.json({
      success: 1,
      file: {
        url: "http://localhost:3000/" + req.file.filename,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong, please try again" });
  }
});
// router.post("/content-link", async (req, res) => {
//   console.log(req.body);

//   try {
//     res.json({
//       success: 1,
//       meta: {},
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Something went wrong, please try again" });
//   }
// });

module.exports = router;
