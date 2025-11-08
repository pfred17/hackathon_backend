const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const cloudinary = require("../config/cloudinary");

const TMP_DIR = path.join(__dirname, "tmp");
if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR);

const convertTextToAudio = async (req, res) => {
  const text = req.body.text;
  if (!text)
    return res.status(400).json({ success: false, error: "No text provided" });

  const mp3File = path.join(TMP_DIR, `tts_${Date.now()}.mp3`);

  const tts = spawn(
    "python",
    [path.join(__dirname, "..", "AI", "tts.py"), `"${text}"`, mp3File, "vi"],
    { shell: true }
  );

  let output = "";
  tts.stdout.on("data", (data) => (output += data.toString()));
  tts.stderr.on("data", (data) => console.error("TTS error:", data.toString()));

  tts.on("close", async () => {
    try {
      console.log("Python output:", output);
      const result = JSON.parse(output.trim());
      if (!result.success) return res.status(500).json(result);

      // ✅ Upload file lên Cloudinary
      const uploadResult = await cloudinary.uploader.upload(mp3File, {
        resource_type: "video", // cần thiết vì Cloudinary phân loại audio là "video"
        folder: "tts_audio",
      });

      // ✅ Xóa file tạm sau khi upload
      fs.unlinkSync(mp3File);

      // ✅ Trả về JSON chứa link
      return res.status(200).json({
        success: true,
        link_audio: uploadResult.secure_url,
      });
    } catch (err) {
      console.error("Parse or upload error:", err, output);
      return res
        .status(500)
        .json({ success: false, error: "Failed to process TTS" });
    }
  });
};

module.exports = { convertTextToAudio };
