const { body, validationResult, query } = require("express-validator");
const db = require("../db/queries");
const bcrypt = require("bcryptjs");

exports.indexPageGet = async (req, res, next) => {
  try {
    res.send("This is the main page");
  } catch (err) {
    return next(err);
  }
};
