-- AlterTable
ALTER TABLE "InterventionReason" ADD COLUMN     "diagnostic" TEXT,
ADD COLUMN     "interventions" JSONB,
ADD COLUMN     "objectives" JSONB,
ADD COLUMN     "situation" JSONB,
ADD COLUMN     "synthese" TEXT,
ADD COLUMN     "therapeutic" JSONB;
