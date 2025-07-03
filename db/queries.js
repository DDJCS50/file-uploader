const { prisma } = require("./client");
const db = require("./index.js");

async function getUserByEmail(emailSelected) {
  const foundEmail = await db.query(prisma.EndUser.findUnique, {
    where: {
      email: emailSelected,
    },
  });

  return foundEmail;
}

async function getAllFolders() {
  const rows = await db.query(prisma.Folders.findMany);

  return rows;
}

async function getUserById(searchedId) {
  const foundId = await db.query(prisma.EndUser.findUnique, {
    where: {
      id: searchedId,
    },
  });

  return foundId;
}

async function getUserByUsername(usernameSelected) {
  const foundUser = await db.query(prisma.EndUser.findUnique, {
    where: {
      username: usernameSelected,
    },
  });
  return foundUser;
}

async function getFolderByName(name) {
  const foundFolder = await db.query(prisma.Folders.findUnique, {
    where: {
      name: name,
    },
    include: {
      files: true,
    },
  });
  return foundFolder;
}

async function getFolderById(idSelected) {
  const foundFolder = await db.query(prisma.Folders.findUnique, {
    where: {
      id: idSelected,
    },
    include: {
      files: true,
    },
  });
  return foundFolder;
}

async function insertUser(firstName, lastName, email, username, hashedPassword) {
  const createdUser = await db.query(prisma.EndUser.create, {
    data: {
      email: email,
      username: username,
      firstName: firstName,
      lastName: lastName,
      password: hashedPassword,
    },
  });

  return createdUser;
}

async function insertFolderByName(name, userSelected) {
  const createdFolder = await db.query(prisma.Folders.create, {
    data: {
      name: name,
      endUser: {
        connect: {
          email: userSelected.email,
        },
      },
    },
  });

  return createdFolder;
}

async function insertFile(folderName, fileName, fileSize, fileMimetype, fileBuffer) {
  const updatedFolder = await db.query(prisma.Folders.update, {
    where: {
      name: folderName,
    },
    data: {
      files: {
        create: { size: fileSize, name: fileName, mimetype: fileMimetype, buffer: Uint8Array.from(fileBuffer) },
      },
    },
  });

  return updatedFolder;
}

async function getFileByName(fileName) {
  const fileFound = await db.query(prisma.Files.findUnique, {
    where: {
      name: fileName,
    },
  });

  return fileFound;
}

async function updateFolderByName(newName, oldName) {
  const updateFolder = await prisma.Folders.update({
    where: {
      name: oldName,
    },
    data: {
      name: newName,
    },
  });

  return updateFolder;
}

async function deleteFolderById(folderIdSelected) {
  const deleteFiles = prisma.Files.deleteMany({
    where: {
      folderId: folderIdSelected,
    },
  });

  const deleteFolder = prisma.Folders.delete({
    where: {
      id: folderIdSelected,
    },
  });

  const transaction = await prisma.$transaction([deleteFiles, deleteFolder]);
}

module.exports = {
  getUserByEmail,
  getUserById,
  insertUser,
  getFolderByName,
  getUserByUsername,
  insertFolderByName,
  updateFolderByName,
  deleteFolderById,
  getFolderById,
  getAllFolders,
  insertFile,
  getFileByName,
};
