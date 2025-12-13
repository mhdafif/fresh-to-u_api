/*
  Warnings:

  - You are about to drop the `FoodItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PriceSnapshot` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SeasonalInfo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PriceSnapshot" DROP CONSTRAINT "PriceSnapshot_cityId_fkey";

-- DropForeignKey
ALTER TABLE "PriceSnapshot" DROP CONSTRAINT "PriceSnapshot_foodId_fkey";

-- DropForeignKey
ALTER TABLE "SeasonalInfo" DROP CONSTRAINT "SeasonalInfo_cityId_fkey";

-- DropForeignKey
ALTER TABLE "SeasonalInfo" DROP CONSTRAINT "SeasonalInfo_foodId_fkey";

-- DropTable
DROP TABLE "FoodItem";

-- DropTable
DROP TABLE "PriceSnapshot";

-- DropTable
DROP TABLE "SeasonalInfo";

-- DropEnum
DROP TYPE "Category";

-- CreateTable
CREATE TABLE "Food" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "variety" TEXT,
    "detail" JSONB,
    "timesSearched" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Food_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Food_name_variety_key" ON "Food"("name", "variety");
