/*
  Warnings:

  - You are about to drop the column `patientId` on the `LongTermObjective` table. All the data in the column will be lost.
  - Added the required column `interventionReasonId` to the `LongTermObjective` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "LongTermObjective" DROP CONSTRAINT "LongTermObjective_patientId_fkey";

-- AlterTable
ALTER TABLE "LongTermObjective" DROP COLUMN "patientId",
ADD COLUMN     "interventionReasonId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "LongTermObjective" ADD CONSTRAINT "LongTermObjective_interventionReasonId_fkey" FOREIGN KEY ("interventionReasonId") REFERENCES "InterventionReason"("id") ON DELETE CASCADE ON UPDATE CASCADE;
