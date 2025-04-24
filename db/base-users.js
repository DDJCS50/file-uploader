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

async function createBaseFiles() {
  const folderSelected = await prisma.Folders.update({
    where: { name: "careers" },
    data: {
      files: {
        connectOrCreate: [
          { where: { name: "firstFile" }, create: { name: "firstFile" } },
          { where: { name: "secondFile" }, create: { name: "secondFile" } },
        ],
      },
    },
  });
  console.log(folderSelected);
}

module.exports = {
  createCurrentUser,
  createBaseFiles,
};
