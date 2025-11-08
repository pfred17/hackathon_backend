const express = require("express");
const multer = require("multer");
const { spawn } = require("child_process");

const app = express();
const upload = multer({ dest: "uploads/" });

app.post("/whisper", upload.single("audio"), (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, error: "No audio file uploaded" });
  }
  const userId = req.body.userId || "unknown_user";

  // Spawn Python script
  const pythonProcess = spawn("python", [
    "../AI/app.py",
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
});

app.listen(5000, () =>
  console.log("Node server running at http://localhost:5000")
);
