const multer = require("multer");
const path = require("path");

const UPLOADS_DIR_FINAL = path.join(__dirname, "..", "..", "src/uploads");

const fs = require("fs");

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

// Middleware Multer để xử lý upload
const upload = multer({
  storage: storage,
  // Thêm giới hạn và bộ lọc nếu cần
  limits: { fileSize: 1024 * 1024 * 5 }, // Ví dụ: giới hạn 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});

// Export middleware này để sử dụng trong router
module.exports = upload;
