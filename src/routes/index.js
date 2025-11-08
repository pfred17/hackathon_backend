const adminRoute = require("./admin.route");
const authRoute = require("./auth.route");
const chatbotRoute = require("./chatbot.route");
const sttRoute = require("./stt.route");

const route = (app) => {
  app.use("/api/admin", adminRoute);
  app.use("/api/auth", authRoute);
  app.use("/api/chatbot/", chatbotRoute);
  app.use("/api/stt/", sttRoute);
};

module.exports = route;
