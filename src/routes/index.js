const adminRoute = require("./admin.route");
const authRoute = require("./auth.route");
const chatbotRoute = require("./chatbot.route");
const sttRoute = require("./stt.route");
const chathisory = require('./chathisory.route')
const lession = require('./lession.route')
const subject = require('./subject.route')
const recommendationRoute = require("./recommendation.route");
const route = (app) => {
  app.use("/api/admin", adminRoute);
  app.use("/api/auth", authRoute);
  app.use("/api/chatbot/", chatbotRoute);
  app.use("/api/stt/", sttRoute);
  app.use("/api/chathisory",chathisory)
  app.use("/api/lession",lession)
  app.use("/api/subject",subject)
  app.use("/api/recommendation", recommendationRoute);
};

module.exports = route;
