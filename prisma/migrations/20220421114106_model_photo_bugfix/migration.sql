/*
  Warnings:

  - You are about to drop the column `cation` on the `Photo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Photo" DROP COLUMN "cation",
ADD COLUMN     "caption" TEXT;
