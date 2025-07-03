const { Router } = require("express");
const indexController = require("../controllers/indexController");
const indexRouter = Router();
const passport = require("../db/passport-controller");
const multer = require("multer");
const path = require("path");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname, "../uploads"));
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = 1;
//     cb(null, file.originalname + "-" + uniqueSuffix);
//   },
// });

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

indexRouter.get("/", indexController.indexPageGet);
indexRouter.get("/login", indexController.loginGet);
indexRouter.get("/signup", indexController.signupGet);
indexRouter.get("/upload-file/:name", indexController.uploadFileGet);
indexRouter.get("/create-folder", indexController.createFolderGet);
indexRouter.get("/open-folder/:name", indexController.openFolderGet);
indexRouter.get("/update-folder/:name", indexController.updateFolderGet);

indexRouter.post("/delete-folder/:id", indexController.deleteFolderPost);
indexRouter.post("/update-folder/:name", indexController.updateFolderPost);
indexRouter.post("/create-folder", indexController.createFolderPost);
indexRouter.post("/upload-file/:name", upload.single("file"), indexController.uploadFilePost);
indexRouter.post("/signup", indexController.signupPost);
indexRouter.post(
  "/login",
  passport.authenticate("MyLocalStrategy", {
    successRedirect: "/",
    failureRedirect: "/",
  })
);

indexRouter.get("*", (req, res, next) => {
  console.log("Route does not exist");
  res.status(404).send({
    status: 404,
    message: "Route does not exist",
    type: "internal",
  });
});

module.exports = indexRouter;
