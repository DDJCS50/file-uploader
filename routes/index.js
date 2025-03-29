const indexRouter = require("./indexRouter.js");

exports.mountRoutes = (app) => {
  app.use("/", indexRouter);
};
