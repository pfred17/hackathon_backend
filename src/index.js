require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const passport = require("./config/passport");
const route = require("./routes/index");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/error.middleware");
const initializeSocket = require("./config/socket");

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
route(app);

// Error handler
app.use(errorHandler);

// Initialize Socket.IO
const io = initializeSocket(server);

// Cấu hình cổng
const PORT = process.env.PORT || 5001;

// Kết nối MongoDB
connectDB();

// Khởi chạy server
server.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
  console.log(`Socket.IO server đã sẵn sàng`);
});