const fs = require("fs");
const { spawn } = require("child_process");

const convertAudioToText = async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, error: "No audio file uploaded" });
  }
  const userId = req.body.userId || "unknown_user";

  // Spawn Python script
  const pythonProcess = spawn("python", [
    "../hackathon_backend/src/AI/app.py",
    req.file.path,
    userId,
  ]);

  let output = "";
  pythonProcess.stdout.on("data", (data) => {
    output += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error("Python error:", data.toString());
  });

  pythonProcess.on("close", (code) => {
    try {
      const result = JSON.parse(output); // JSON từ Python
      res.json(result); // trả về FE
    } catch (err) {
      res
        .status(500)
        .json({ success: false, error: "Invalid JSON from Python" });
    }
  });
};

module.exports = { convertAudioToText };
