const { transcribeAudio } = require("../services/stt.service");
const fs = require("fs");

const convertAudioToText = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ error: "Vui lòng upload file audio." });

    const filePath = req.file.path;

    // Gọi service chuyển đổi
    const text = await transcribeAudio(filePath);

    // Xóa file tạm sau khi xử lý
    fs.unlinkSync(filePath);

    res.json({ text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Đã xảy ra lỗi khi chuyển đổi audio." });
  }
};

module.exports = { convertAudioToText };
