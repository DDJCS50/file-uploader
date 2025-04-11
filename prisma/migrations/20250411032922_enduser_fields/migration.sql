/*
  Warnings:

  - You are about to drop the column `name` on the `EndUser` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `EndUser` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `firstName` to the `EndUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `EndUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `EndUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EndUser" DROP COLUMN "name",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "EndUser_username_key" ON "EndUser"("username");
