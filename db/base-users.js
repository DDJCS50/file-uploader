const { Prisma } = require("../generated/client");
const { prisma } = require("./client");
// const db = require("../db/index.js");

async function createCurrentUser() {
  const firstUser = await prisma.buyer.upsert({
    where: {
      email: "coolalice@prisma.io",
    },
    update: {
      name: "Alice",
      email: "coolalice@prisma.io",
    },
    create: {
      name: "Alice",
      email: "coolalice@prisma.io",
    },
  });
  console.log(firstUser);
}

module.exports = {
  createCurrentUser,
};
