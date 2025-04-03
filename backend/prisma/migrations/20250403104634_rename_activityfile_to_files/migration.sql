-- CreateTable
CREATE TABLE "ActivityFile" (
    "id" SERIAL NOT NULL,
    "activityId" INTEGER NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,

    CONSTRAINT "ActivityFile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ActivityFile" ADD CONSTRAINT "ActivityFile_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
