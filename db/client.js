const { PrismaClient } = require("../generated/client");

let prisma = new PrismaClient();

module.exports = { prisma };
