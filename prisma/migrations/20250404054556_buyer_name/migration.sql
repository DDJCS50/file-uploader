/*
  Warnings:

  - You are about to drop the `CurrentUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "CurrentUser";

-- CreateTable
CREATE TABLE "Buyer" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "Buyer_pkey" PRIMARY KEY ("id")
);

-- ALTER TABLE "CurrentUser" RENAME CONSTRAINT "CurrentUser_pkey" TO "Buyer_pkey";
-- ALTER SEQUENCE "CurrentUser_id_seq" RENAME TO "Buyer_id_seq";
-- ALTER TABLE "CurrentUser" RENAME TO "buyer";

-- CreateIndex
CREATE UNIQUE INDEX "Buyer_email_key" ON "Buyer"("email");
