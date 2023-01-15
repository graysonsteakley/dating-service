/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT NOT NULL DEFAULT '@Steakley143',
ADD COLUMN     "username" TEXT NOT NULL DEFAULT 'gsteakley';

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
