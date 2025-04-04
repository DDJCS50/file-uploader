const { prisma } = require("./client");
// const db = require("../db/index.js");

async function getAllCurrentUsers() {
  const allUsers = await prisma.buyer.findMany();
  console.log(allUsers);
}

module.exports = {
  getAllCurrentUsers,
};
