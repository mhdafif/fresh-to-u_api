/*
  Warnings:

  - You are about to drop the column `meta` on the `History` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "History" DROP COLUMN "meta",
ADD COLUMN     "detail" JSONB;
