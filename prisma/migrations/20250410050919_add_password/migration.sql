/*
  Warnings:

  - You are about to drop the `Buyer` table. If the table is not empty, all the data it contains will be lost.

*/

--Alter table and sequence
ALTER TABLE "Buyer" RENAME CONSTRAINT "Buyer_pkey" TO "EndUser_pkey";
ALTER SEQUENCE "Buyer_id_seq" RENAME TO "EndUser_id_seq";
ALTER TABLE "Buyer" RENAME TO "EndUser";

-- CreateIndex
CREATE UNIQUE INDEX "EndUser_email_key" ON "EndUser"("email");
