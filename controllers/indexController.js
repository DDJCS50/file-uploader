const { body, validationResult, query } = require("express-validator");
const db = require("../db/queries");
const { prisma } = require("../db/client");
// instantiate userbase
const { createCurrentUser } = require("../db/base-users.js");
const bcrypt = require("bcryptjs");

exports.indexPageGet = async (req, res, next) => {
  try {
    // const allUsers = await prisma.buyer.create({
    //   data: {
    //     name: "Alice",
    //     email: "alice@prisma.io",
    //   },
    // });

    // console.log(allUsers);

    // await createCurrentUser();
    // await db.getAllCurrentUsers();
    await db.getAllCurrentUsersNew();
    res.send("This is the main page");
  } catch (err) {
    return next(err);
  }
};
