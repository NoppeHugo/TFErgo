/*
  Warnings:

  - You are about to drop the `CifCode` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CifCode" DROP CONSTRAINT "CifCode_patientRecordId_fkey";

-- DropTable
DROP TABLE "CifCode";

-- CreateTable
CREATE TABLE "Material" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaterialLink" (
    "activityId" INTEGER NOT NULL,
    "materialId" INTEGER NOT NULL,

    CONSTRAINT "MaterialLink_pkey" PRIMARY KEY ("activityId","materialId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Material_name_key" ON "Material"("name");

-- AddForeignKey
ALTER TABLE "MaterialLink" ADD CONSTRAINT "MaterialLink_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialLink" ADD CONSTRAINT "MaterialLink_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;
