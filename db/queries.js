const { prisma } = require("./client");
const db = require("../db/index.js");

async function getAllCurrentUsers() {
  const allUsers = await prisma.buyer.findMany();
  console.log(allUsers);
}

async function getAllCurrentUsersNew() {
  const { rows } = await db.query(prisma.buyer.findMany);
  console.log(rows);
  return rows;
}

module.exports = {
  getAllCurrentUsers,
  getAllCurrentUsersNew,
};
