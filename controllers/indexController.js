const { body, validationResult } = require("express-validator");
const db = require("../db/queries");
const { prisma } = require("../db/client");
// instantiate userbase
const { createCurrentUser } = require("../db/base-users.js");
const bcrypt = require("bcryptjs");

const alphaErr = "must only contain letters.";
const passErr = "must be at least 8 characters long, contain at least one of each: lowercase letter, uppercase letter, number, symbol";
const emailErr = "must be a valid email, example@gmail.com";

const validateFirstNameInput = [body("firstName").trim().isAlpha("en-US", { ignore: " " }).withMessage(`First name ${alphaErr}`)];
const validateLastNameInput = [body("lastName").trim().isAlpha("en-US", { ignore: " " }).withMessage(`Last name ${alphaErr}`)];
const validatePassword = [body("password").trim().isStrongPassword().withMessage(`Password ${passErr}`)];
const validateEmailInput = [body("email").trim().isEmail().withMessage(`Email ${emailErr}`)];

exports.indexPageGet = async (req, res, next) => {
  try {
    res.render("index-page");
  } catch (err) {
    return next(err);
  }
};

exports.loginGet = (req, res, next) => {
  try {
    res.render("login");
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

exports.signupGet = (req, res, next) => {
  try {
    res.render("signup");
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

exports.signupPost = [
  validateFirstNameInput,
  validateLastNameInput,
  validateEmailInput,
  validatePassword,
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).render("signup", {
        errors: errors.array(),
      });
    }

    let { firstName, lastName, email, username, password, passwordConfirm } = req.body;

    const usernameSelected = await db.getUserByUsername(username);
    const usernameError = [{ msg: "Username already exists" }];
    const passwordError = [{ msg: "Passwords do not match" }];

    if (usernameSelected) {
      return res.status(400).render("signup", {
        errors: usernameError,
      });
    }

    if (passwordConfirm != password) {
      return res.status(400).render("signup", {
        errors: passwordError,
      });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.insertUser(firstName, lastName, email, username, hashedPassword);

      res.redirect("/");
    } catch (err) {
      console.error("Error creating user:", err);
      return next(err);
    }
  },
];
