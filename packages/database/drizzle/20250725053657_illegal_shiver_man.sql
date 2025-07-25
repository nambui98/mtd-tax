ALTER TABLE "documents" ADD COLUMN "fileName" text NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "originalFileName" text NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "fileSize" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "fileType" text NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "mimeType" text NOT NULL;