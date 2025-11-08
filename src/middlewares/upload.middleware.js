const multer = require("multer");
const path = require("path");
const fs = require("fs");

const UPLOADS_DIR_FINAL = path.join(__dirname, "..", "..", "src/uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(UPLOADS_DIR_FINAL)) {
      fs.mkdirSync(UPLOADS_DIR_FINAL, { recursive: true });
    }
    cb(null, UPLOADS_DIR_FINAL);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 20 }, // giới hạn 20MB
  fileFilter: (req, file, cb) => {
    // ✅ Danh sách mime types hợp lệ
    const allowedMimes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "audio/mpeg", // .mp3
      "audio/mp3",
      "audio/x-m4a", // .m4a (nhiều trình duyệt dùng)
      "audio/mp4", // .m4a (một số khác)
      "audio/wav", // .wav
      "audio/x-wav",
      "audio/webm",
    ];

    // ✅ Cho phép các đuôi file hợp lệ
    const extname = /jpeg|jpg|png|gif|mp3|m4a|wav|webm/.test(
      path.extname(file.originalname).toLowerCase()
    );

    const mimetype = allowedMimes.includes(file.mimetype);

    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new Error("Only image and audio files (mp3, m4a, wav) are allowed!"));
    }
  },
});

module.exports = upload;
