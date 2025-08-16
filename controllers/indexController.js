const { body, validationResult } = require("express-validator");
const db = require("../db/queries");
const bcrypt = require("bcryptjs");
const { createBaseFiles } = require("../db/base-users");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  secure: true,
});

const alphaErr = "must only contain letters.";
const passErr = "must be at least 8 characters long, contain at least one of each: lowercase letter, uppercase letter, number, symbol";
const emailErr = "must be a valid email, example@gmail.com";
const folderNameErr = [{ msg: "Folder Not Found" }];
const folderFoundErr = [{ msg: "Folder Already Exists" }];
const fileFoundsErr = [{ msg: "File Already Exists" }];
const noUserErr = [{ msg: "No user found" }];

const validateFirstNameInput = [body("firstName").trim().isAlpha("en-US", { ignore: " " }).withMessage(`First name ${alphaErr}`)];
const validateLastNameInput = [body("lastName").trim().isAlpha("en-US", { ignore: " " }).withMessage(`Last name ${alphaErr}`)];
const validatePassword = [body("password").trim().isStrongPassword().withMessage(`Password ${passErr}`)];
const validateEmailInput = [body("email").trim().isEmail().withMessage(`Email ${emailErr}`)];
const validateFolderNameInput = [body("name").trim().isAlpha("en-US", { ignore: " " }).withMessage(`File name ${alphaErr}`)];

exports.indexPageGet = async (req, res, next) => {
  let userSelected = res.locals.currentUser;
  const folders = await db.getAllFolders(userSelected);

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

  const folders = await db.getAllFolders(res.locals.currentUser);
  if (!folder) {
    return res.status(400).render("index-page", {
      errors: folderNameErr,
      folders: folders,
    });
  }

  try {
    res.render("upload-file", { folder: folder });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

exports.downloadFileGet = async (req, res, next) => {
  const nameSelected = req.params.name;
  const folder = await db.getFolderByName(nameSelected);

  const fileNameSelected = req.params.fileName;
  let fileAlreadyExists = await db.getFileByName(fileNameSelected);

  const folders = await db.getAllFolders(res.locals.currentUser);
  if (!fileAlreadyExists) {
    return res.status(400).render("index-page", {
      errors: fileFoundsErr,
      folders: folders,
    });
  }

  if (!folder) {
    return res.status(400).render("index-page", {
      errors: folderNameErr,
      folders: folders,
    });
  }

  console.log(fileAlreadyExists);

  let content = Buffer.from(fileAlreadyExists.buffer.buffer);

  res.contentType(fileAlreadyExists.mimetype);
  res.attachment(`${fileAlreadyExists.name}`);

  try {
    res.send(content);
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
  const foldersSelected = res.locals.folders;

  const folders = await db.getAllFolders(res.locals.currentUser);
  if (!folder) {
    return res.status(400).render("index-page", {
      errors: folderNameErr,
      folders: folders,
    });
  }
  /// TODO CREATE FILES AND DISPLAY THEM IN FOLDER PAGE
  const files = folder.files;

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

exports.uploadFilePost = async (req, res, next) => {
  const fileSelected = req.file;
  const fileType = fileSelected.originalname.slice(fileSelected.originalname.indexOf("."));
  const renamedFile = fileSelected.originalname.slice(0, fileSelected.originalname.indexOf(".")).concat("-2");
  let fileAlreadyExists = await db.getFileByName(renamedFile);

  const folders = await db.getAllFolders(res.locals.currentUser);

  if (fileAlreadyExists) {
    return res.status(400).render("index-page", {
      errors: fileFoundsErr,
      folders: folders,
    });
  }

  const folderSelect = req.params.name;
  let folderExists = await db.getFolderByName(folderSelect);

  const user = res.locals.currentUser;

  if (!folderExists) {
    return res.status(400).render("index-page", {
      errors: folderNameErr,
      folders: folders,
    });
  }

  if (!user) {
    return res.status(400).render("index-page", {
      errors: noUserErr,
      folders: folders,
    });
  }

  let stringyData = JSON.stringify(fileSelected.buffer).toString("base64");
  let unStringedData = JSON.parse(stringyData);

  // console.log(unStringedData.data);

  let realizedBuffer = Buffer.from(unStringedData.data);
  console.log(realizedBuffer);

  // Use the uploaded file's name as the asset's public ID and
  // allow overwriting the asset with new versions
  const options = {
    use_filename: false,
    public_id: renamedFile,
    unique_filename: false,
    overwrite: true,
    resource_type: "auto",
  };

  try {
    //     // Upload the image

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(options, (error, uploadResult) => {
          if (error) {
            return reject(error);
          }
          return resolve(uploadResult);
        })
        .end(realizedBuffer);
    });
    console.log("success", JSON.stringify(uploadResult, null, 2));

    // await db.insertFile(folderSelect, renamedFile, fileSelected.size, fileSelected.mimetype, unStringedData.data);
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
    let userSelected = res.locals.currentUser;

    const folderSelected = await db.getFolderByName(name);

    if (folderSelected) {
      return res.status(400).render("create-folder", {
        errors: folderFoundErr,
      });
    }

    try {
      await db.insertFolderByName(name, userSelected);
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

    const { name } = req.body;

    const folderSelected = await db.getFolderByName(name);

    if (folderSelected) {
      return res.status(400).render("update-folder", {
        errors: folderNameErr,
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

  const folders = await db.getAllFolders(res.locals.currentUser);
  if (!folderId) {
    return res.status(400).render("index-page", {
      errors: folderNameErr,
      folders: folders,
    });
  }

  const selectedFolder = await db.getFolderById(Number(folderId));

  try {
    await db.deleteFolderById(selectedFolder.id);
    res.redirect("/");
  } catch (err) {
    console.error("Error deleting folder:", err);
    return next(err);
  }
};
