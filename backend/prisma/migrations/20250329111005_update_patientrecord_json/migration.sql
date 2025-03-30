/*
  Warnings:

  - The `personalSituation` column on the `PatientRecord` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `therapeuticPerspective` column on the `PatientRecord` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "PatientRecord" DROP COLUMN "personalSituation",
ADD COLUMN     "personalSituation" JSONB,
DROP COLUMN "therapeuticPerspective",
ADD COLUMN     "therapeuticPerspective" JSONB;
