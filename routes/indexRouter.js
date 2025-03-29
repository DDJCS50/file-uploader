const { Router } = require("express");
const indexController = require("../controllers/indexController");
const indexRouter = Router();
const passport = require("../controllers/passportController");

indexRouter.get("/", indexController.indexPageGet);

indexRouter.use((req, res, next) => {
  console.log("Route does not exist");
  res.status(404).send({
    status: 404,
    message: "Route does not exist",
    type: "internal",
  });
});

module.exports = indexRouter;
