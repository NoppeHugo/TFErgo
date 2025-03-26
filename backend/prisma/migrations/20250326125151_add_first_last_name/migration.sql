/*
  Warnings:

  - You are about to drop the column `ct1` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `ct2` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `insurance` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `thirdPartyPayer` on the `Patient` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "ct1",
DROP COLUMN "ct2",
DROP COLUMN "insurance",
DROP COLUMN "thirdPartyPayer",
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT;
