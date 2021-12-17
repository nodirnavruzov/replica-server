module.exports.uploader = async (req, res) => {
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
}