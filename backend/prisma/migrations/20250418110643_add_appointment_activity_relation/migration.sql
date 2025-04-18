/*
  Warnings:

  - You are about to drop the column `activityId` on the `Appointment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_activityId_fkey";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "activityId",
ADD COLUMN     "sessionReport" TEXT;

-- CreateTable
CREATE TABLE "AppointmentActivity" (
    "appointmentId" INTEGER NOT NULL,
    "activityId" INTEGER NOT NULL,

    CONSTRAINT "AppointmentActivity_pkey" PRIMARY KEY ("appointmentId","activityId")
);

-- CreateTable
CREATE TABLE "AppointmentFeedback" (
    "id" SERIAL NOT NULL,
    "appointmentId" INTEGER NOT NULL,
    "objective" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AppointmentFeedback_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AppointmentActivity" ADD CONSTRAINT "AppointmentActivity_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentActivity" ADD CONSTRAINT "AppointmentActivity_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentFeedback" ADD CONSTRAINT "AppointmentFeedback_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
