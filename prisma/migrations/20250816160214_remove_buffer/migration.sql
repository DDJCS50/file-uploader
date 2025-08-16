/*
  Warnings:

  - You are about to drop the column `buffer` on the `Files` table. All the data in the column will be lost.
  - You are about to drop the column `mimetype` on the `Files` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Files" DROP COLUMN "buffer",
DROP COLUMN "mimetype";
