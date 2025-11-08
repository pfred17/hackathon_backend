const adminRoute = require("./admin.route");
const authRoute = require("./auth.route");
const chatbotRoute = require("./chatbot.route");
const sttRoute = require("./stt.route");
const ttsRoute = require("./tts.route");
const subjectRoute = require("./subject.route");
const lessonRoute = require("./lession.route");
const userRoute = require("./user.routes");
const sessionsRoute = require("./sessions.route");
const route = (app) => {
  app.use("/api/admin", adminRoute);
  app.use("/api/auth", authRoute);
  app.use("/api/chatbot/", chatbotRoute);
  app.use("/api/stt/", sttRoute);
  app.use("/api/tts/", ttsRoute);
  app.use("/api/subject/", subjectRoute);
  app.use("/api/lesson/", lessonRoute);
  app.use("/api/user/", userRoute);
  app.use("/api/sessions/", sessionsRoute);
};

module.exports = route;
