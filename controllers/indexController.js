const { body, validationResult, query } = require("express-validator");
const db = require("../db/queries");
const { prisma } = require("../db/client");
// instantiate userbase
const { createCurrentUser } = require("../db/base-users.js");
const bcrypt = require("bcryptjs");

exports.indexPageGet = async (req, res, next) => {
  try {
    res.render("index-page");
  } catch (err) {
    return next(err);
  }
};

////TODO CREATE SIGNUP FUNCTIONALITY

// exports.signUpPost = [
//   validateFirstNameInput,
//   validateLastNameInput,
//   validatePassword,
//   async (req, res, next) => {
//     const errors = validationResult(req);

//     if (!errors.isEmpty()) {
//       console.log(errors);
//       return res.status(400).render("signUp", {
//         errors: errors.array(),
//       });
//     }

//     let { firstName, lastName, username, password, adminStatus, passwordConfirm } = req.body;

//     if (adminStatus == undefined || adminStatus == null) {
//       adminStatus = false;
//     }

//     const usernameSelected = await db.getUserByUsername(username);
//     const usernameError = [{ msg: "Username already exists" }];
//     const passwordError = [{ msg: "Passwords do not match" }];

//     if (usernameSelected.length > 0) {
//       return res.status(400).render("signUp", {
//         errors: usernameError,
//       });
//     }

//     if (passwordConfirm != password) {
//       return res.status(400).render("signUp", {
//         errors: passwordError,
//       });
//     }

//     try {
//       const hashedPassword = await bcrypt.hash(password, 10);
//       await db.insertUser(firstName, lastName, username, hashedPassword, adminStatus);

//       res.redirect("/");
//     } catch (err) {
//       console.error("Error creating user:", err);
//       return next(err);
//     }
//   },
// ];

exports.loginGet = (req, res, next) => {
  try {
    res.render("login");
  } catch (error) {
    console.error(error);
    return next(error);
  }
};
