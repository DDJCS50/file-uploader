const { prisma } = require("./client");
const db = require("./index.js");

async function getUserByEmail(emailSelected) {
  const foundEmail = await db.query(prisma.EndUser.findUnique, {
    where: {
      email: emailSelected,
    },
  });
  // console.log(foundEmail);
  return foundEmail;
}

async function getAllCurrentUsersNew() {
  const { rows } = await db.query(prisma.EndUser.findMany);
  // console.log(rows);
  return rows;
}

async function getUserById(searchedId) {
  const foundId = await db.query(prisma.EndUser.findUnique, {
    where: {
      id: searchedId,
    },
  });
  // console.log(foundId);
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
  // console.log(createdUser);
  return createdUser;
}

async function insertFolder(name) {
  const createdFolder = await db.query(prisma.Folders.create, {
    data: {
      name: name,
    },
  });
  // console.log(createdUser);
  return createdFolder;
}

module.exports = {
  getUserByEmail,
  getAllCurrentUsersNew,
  getUserById,
  insertUser,
  getFolderByName,
  getUserByUsername,
  insertFolder,
};
