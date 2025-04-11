const { Router } = require("express");
const indexController = require("../controllers/indexController");
const indexRouter = Router();
const passport = require("../db/passport-controller");

indexRouter.get("/", indexController.indexPageGet);
indexRouter.get("/login", indexController.loginGet);
indexRouter.get("/signup", indexController.signupGet);

indexRouter.post("/signup", indexController.signupPost);
indexRouter.post(
  "/login",
  passport.authenticate("MyLocalStrategy", {
    successRedirect: "/",
    failureRedirect: "/",
  })
);

indexRouter.use((req, res, next) => {
  console.log("Route does not exist");
  res.status(404).send({
    status: 404,
    message: "Route does not exist",
    type: "internal",
  });
});

module.exports = indexRouter;
