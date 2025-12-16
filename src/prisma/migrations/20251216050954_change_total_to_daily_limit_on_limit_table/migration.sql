/*
  Warnings:

  - You are about to drop the column `total` on the `ScanLimit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ScanLimit" DROP COLUMN "total",
ADD COLUMN     "dailyLimit" INTEGER NOT NULL DEFAULT 0;
