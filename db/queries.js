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

async function insertUser(email, hashedPassword, name) {
  const createdUser = await db.query(prisma.EndUser.create, {
    data: {
      email: email,
      name: name,
      password: hashedPassword,
    },
  });
  // console.log(createdUser);
  return createdUser;
}

module.exports = {
  getUserByEmail,
  getAllCurrentUsersNew,
  getUserById,
  insertUser,
};
