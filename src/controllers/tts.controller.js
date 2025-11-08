const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const TMP_DIR = path.join(__dirname, "tmp");
if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR);

const convertTextToAudio = async (req, res) => {
  const text = req.body.text;
  if (!text)
    return res.status(400).json({ success: false, error: "No text provided" });

  const mp3File = path.join(TMP_DIR, `tts_${Date.now()}.mp3`);

  // ⚠️ Dùng dấu nháy kép bao quanh text để tránh bị tách từ
  const tts = spawn(
    "python",
    [path.join(__dirname, "..", "AI", "tts.py"), `"${text}"`, mp3File, "vi"],
    { shell: true }
  ); // ⚠️ thêm { shell: true } để đảm bảo quotes hoạt động trên Windows

  let output = "";
  tts.stdout.on("data", (data) => (output += data.toString()));
  tts.stderr.on("data", (data) => console.error("TTS error:", data.toString()));

  tts.on("close", () => {
    try {
      console.log("Python output:", output);
      const result = JSON.parse(output.trim());
      if (!result.success) return res.status(500).json(result);

      const mp3Buffer = fs.readFileSync(mp3File);

      res.setHeader("Content-Type", "audio/mpeg");
      res.send(mp3Buffer);

      // fs.unlinkSync(mp3File);
    } catch (err) {
      console.error("Parse error:", output);
      res.status(500).json({ success: false, error: "Invalid JSON from TTS" });
    }
  });
};

module.exports = { convertTextToAudio };
