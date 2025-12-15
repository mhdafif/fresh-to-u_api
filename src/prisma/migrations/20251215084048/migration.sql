/*
  Warnings:

  - You are about to drop the `limits` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "limits" DROP CONSTRAINT "limits_guestId_fkey";

-- DropForeignKey
ALTER TABLE "limits" DROP CONSTRAINT "limits_userId_fkey";

-- DropTable
DROP TABLE "limits";

-- CreateTable
CREATE TABLE "Limit" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "guestId" TEXT,
    "remaining" INTEGER NOT NULL DEFAULT 0,
    "total" INTEGER NOT NULL DEFAULT 0,
    "resetAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
