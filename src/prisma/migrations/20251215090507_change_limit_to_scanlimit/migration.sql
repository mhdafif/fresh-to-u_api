/*
  Warnings:

  - You are about to drop the `Limit` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Limit" DROP CONSTRAINT "Limit_guestId_fkey";

-- DropForeignKey
ALTER TABLE "Limit" DROP CONSTRAINT "Limit_userId_fkey";

-- DropTable
DROP TABLE "Limit";

-- CreateTable
CREATE TABLE "ScanLimit" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "guestId" TEXT,
    "remaining" INTEGER NOT NULL DEFAULT 0,
    "total" INTEGER NOT NULL DEFAULT 0,
    "resetAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScanLimit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ScanLimit_userId_key" ON "ScanLimit"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ScanLimit_guestId_key" ON "ScanLimit"("guestId");

-- AddForeignKey
ALTER TABLE "ScanLimit" ADD CONSTRAINT "ScanLimit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScanLimit" ADD CONSTRAINT "ScanLimit_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
