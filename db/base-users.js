const { prisma } = require("./client");

async function createCurrentUser() {
  const firstUser = await prisma.EndUser.upsert({
    where: {
      email: "coolalice@prisma.io",
    },
    update: {
      name: "Alice",
      email: "coolalice@prisma.io",
      password: "password",
    },
    create: {
      name: "Alice",
      email: "coolalice@prisma.io",
      password: "password",
    },
  });
  console.log(firstUser);
}

module.exports = {
  createCurrentUser,
};
