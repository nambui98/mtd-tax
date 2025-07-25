ALTER TABLE "documents" ALTER COLUMN "documentType" SET DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "documents" ALTER COLUMN "documentType" DROP NOT NULL;