/*
  Warnings:

  - You are about to drop the column `completed` on the `AppointmentFeedback` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `AppointmentFeedback` table. All the data in the column will be lost.
  - You are about to drop the column `objective` on the `AppointmentFeedback` table. All the data in the column will be lost.
  - Added the required column `evaluationItemId` to the `AppointmentFeedback` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AppointmentFeedback" DROP CONSTRAINT "AppointmentFeedback_appointmentId_fkey";

-- AlterTable
ALTER TABLE "AppointmentFeedback" DROP COLUMN "completed",
DROP COLUMN "createdAt",
DROP COLUMN "objective",
ADD COLUMN     "comment" TEXT,
ADD COLUMN     "evaluationItemId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "EvaluationItem" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "patientId" INTEGER NOT NULL,
    "isClosed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EvaluationItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EvaluationItem" ADD CONSTRAINT "EvaluationItem_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentFeedback" ADD CONSTRAINT "AppointmentFeedback_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentFeedback" ADD CONSTRAINT "AppointmentFeedback_evaluationItemId_fkey" FOREIGN KEY ("evaluationItemId") REFERENCES "EvaluationItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
