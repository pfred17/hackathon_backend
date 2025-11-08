const adminRoute = require("./admin.route");
const authRoute = require("./auth.route");

const route = (app) => {
  app.use("/api/admin", adminRoute);
  app.use("/api/auth", authRoute);
};

module.exports = route;
