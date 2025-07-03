/*
  Warnings:

  - Added the required column `buffer` to the `Files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mimetype` to the `Files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Files" ADD COLUMN     "buffer" BYTEA NOT NULL,
ADD COLUMN     "mimetype" TEXT NOT NULL;
