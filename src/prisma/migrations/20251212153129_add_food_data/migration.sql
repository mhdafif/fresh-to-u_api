/*
  Warnings:

  - A unique constraint covering the columns `[name,variety]` on the table `FoodItem` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "FoodItem_name_category_key";

-- AlterTable
ALTER TABLE "FoodItem" ADD COLUMN     "detail" JSONB,
ADD COLUMN     "timesSearched" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "variety" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "FoodItem_name_variety_key" ON "FoodItem"("name", "variety");
