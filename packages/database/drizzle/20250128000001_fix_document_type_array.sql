-- Fix documentType column to be text array
-- First, add a temporary column
ALTER TABLE "documents" ADD COLUMN "documentType_new" text[];

-- Convert existing single text values to arrays
UPDATE "documents" SET "documentType_new" = ARRAY["documentType"] WHERE "documentType" IS NOT NULL;

-- Drop the old column
ALTER TABLE "documents" DROP COLUMN "documentType";

-- Rename the new column to the original name
ALTER TABLE "documents" RENAME COLUMN "documentType_new" TO "documentType";

-- Make it not null
ALTER TABLE "documents" ALTER COLUMN "documentType" SET NOT NULL; 