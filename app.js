require("dotenv").config();
const express = require("express");
const app = express();
const path = require("node:path");
const { mountRoutes } = require("./routes/index");
const { exportedSession } = require("./db/session-controller");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
const assetsPath = path.join(__dirname, "public");
const passport = require("passport");
const session = require("express-session");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(assetsPath));

app.use(exportedSession);
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

mountRoutes(app);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).send(err.message);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));
