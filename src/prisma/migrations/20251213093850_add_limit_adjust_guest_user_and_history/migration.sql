/*
  Warnings:

  - The primary key for the `Guest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `sessionId` on the `Guest` table. All the data in the column will be lost.
  - The required column `id` was added to the `Guest` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "History" DROP CONSTRAINT "History_guestId_fkey";

-- AlterTable
ALTER TABLE "Guest" DROP CONSTRAINT "Guest_pkey",
DROP COLUMN "sessionId",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "ipAddress" TEXT,
ADD CONSTRAINT "Guest_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "Limit" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "guestId" TEXT,
    "remaining" INTEGER NOT NULL DEFAULT 0,
    "total" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Limit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Limit_userId_key" ON "Limit"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Limit_guestId_key" ON "Limit"("guestId");

-- AddForeignKey
ALTER TABLE "Limit" ADD CONSTRAINT "Limit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Limit" ADD CONSTRAINT "Limit_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
