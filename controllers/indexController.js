const { body, validationResult } = require("express-validator");
const db = require("../db/queries");
const bcrypt = require("bcryptjs");
const { createBaseFiles } = require("../db/base-users");

const alphaErr = "must only contain letters.";
const passErr = "must be at least 8 characters long, contain at least one of each: lowercase letter, uppercase letter, number, symbol";
const emailErr = "must be a valid email, example@gmail.com";
const folderNameError = [{ msg: "Folder Not Found" }];

const validateFirstNameInput = [body("firstName").trim().isAlpha("en-US", { ignore: " " }).withMessage(`First name ${alphaErr}`)];
const validateLastNameInput = [body("lastName").trim().isAlpha("en-US", { ignore: " " }).withMessage(`Last name ${alphaErr}`)];
const validatePassword = [body("password").trim().isStrongPassword().withMessage(`Password ${passErr}`)];
const validateEmailInput = [body("email").trim().isEmail().withMessage(`Email ${emailErr}`)];
const validateFolderNameInput = [body("name").trim().isAlpha("en-US", { ignore: " " }).withMessage(`File name ${alphaErr}`)];

exports.indexPageGet = async (req, res, next) => {
  // const files = createBaseFiles();
  const folders = await db.getAllFolders();
  console.log(folders);
  try {
    res.render("index-page", { folders: folders });
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

exports.uploadFileGet = async (req, res, next) => {
  const nameSelected = req.params.name;
  const folder = await db.getFolderByName(nameSelected);

  if (!folder) {
    return res.status(400).render("index-page", {
      errors: folderNameError,
    });
  }
  try {
    res.render("upload-file", { folder: folder });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

exports.createFolderGet = (req, res, next) => {
  try {
    res.render("create-folder");
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

exports.openFolderGet = async (req, res, next) => {
  const nameSelected = req.params.name;
  const folder = await db.getFolderByName(nameSelected);

  if (!folder) {
    return res.status(400).render("index-page", {
      errors: folderNameError,
    });
  }
  /// TODO CREATE FILES AND DISPLAY THEM IN FOLDER PAGE
  const files = folder.files;
  console.log(files);

  try {
    res.render("open-folder", { folder: folder, files: files });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

exports.updateFolderGet = async (req, res, next) => {
  const nameSelected = req.params.name;
  const folder = await db.getFolderByName(nameSelected);

  const files = folder.files;

  try {
    res.render("update-folder", { folder: folder, files: files });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

exports.uploadFilePost = (req, res, next) => {
  let fileSelected = req.file;
  let size = fileSelected.size;
  console.log(fileSelected, size);
  ///TEST FILE UPLOADING
  try {
    res.redirect("/");
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

exports.createFolderPost = [
  validateFolderNameInput,
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).render("create-folder", {
        errors: errors.array(),
      });
    }

    let { name } = req.body;

    const folderSelected = await db.getFolderByName(name);

    if (folderSelected) {
      return res.status(400).render("create-folder", {
        errors: folderNameError,
      });
    }

    try {
      await db.insertFolderByName(name);
      res.redirect("/");
    } catch (err) {
      console.error("Error creating folder:", err);
      return next(err);
    }
  },
];

exports.updateFolderPost = [
  validateFolderNameInput,
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).render("create-folder", {
        errors: errors.array(),
      });
    }

    const oldName = req.params.name;
    console.log(oldName);
    const { name } = req.body;
    console.log(name);

    const folderSelected = await db.getFolderByName(name);

    if (folderSelected) {
      return res.status(400).render("update-folder", {
        errors: folderNameError,
      });
    }

    try {
      await db.updateFolderByName(name, oldName);
      res.redirect("/");
    } catch (err) {
      console.error("Error updating folder:", err);
      return next(err);
    }
  },
];

exports.deleteFolderPost = async (req, res, next) => {
  const errors = validationResult(req);
  const folderId = req.params.id;
  if (!folderId) {
    return res.status(400).render("index-page", {
      errors: folderNameError,
    });
  }

  const selectedFolder = await db.getFolderById(Number(folderId));
  console.log(selectedFolder.id);

  try {
    await db.deleteFolderById(selectedFolder.id);
    res.redirect("/");
  } catch (err) {
    console.error("Error deleting folder:", err);
    return next(err);
  }
};
