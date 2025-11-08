const express = require("express");
const multer = require("multer");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(express.json());

// Endpoint: upload audio -> whisper -> tts
app.post("/process-audio", upload.single("audio"), (req, res) => {});

app.listen(5000, () => console.log("Server running at http://localhost:5000"));
