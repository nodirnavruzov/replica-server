const config = require('../config/default.json')
module.exports.uploader = async (req, res) => {
  try {
    res.json({
      success: 1,
      file: {
        url: `${config.baseUrl}:${config.port}/${req.file.filename}`,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong, please try again" });
  }
}