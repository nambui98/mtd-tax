ALTER TABLE "document_folders" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "document_folders" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "document_transactions" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "document_transactions" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "documents" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "documents" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "hmrc_submissions" RENAME COLUMN "submittedAt" TO "submitted_at";--> statement-breakpoint
ALTER TABLE "hmrc_submissions" RENAME COLUMN "processedAt" TO "processed_at";--> statement-breakpoint
ALTER TABLE "hmrc_submissions" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "hmrc_submissions" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "hmrc_transactions" RENAME COLUMN "submittedAt" TO "submitted_at";--> statement-breakpoint
ALTER TABLE "hmrc_transactions" RENAME COLUMN "processedAt" TO "processed_at";--> statement-breakpoint
ALTER TABLE "hmrc_transactions" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "hmrc_transactions" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "document_folder_assignments" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "document_folder_assignments" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "document_folder_assignments" ALTER COLUMN "documentId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "document_folder_assignments" ALTER COLUMN "folderId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "document_folders" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "document_folders" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "document_folders" ALTER COLUMN "userId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "document_folders" ALTER COLUMN "clientId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "document_folders" ALTER COLUMN "parentFolderId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "document_transactions" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "document_transactions" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "document_transactions" ALTER COLUMN "documentId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "document_transactions" ALTER COLUMN "userId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "document_transactions" ALTER COLUMN "clientId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "documents" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "documents" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "documents" ALTER COLUMN "userId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "documents" ALTER COLUMN "clientId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "hmrc_submissions" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "hmrc_submissions" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "hmrc_submissions" ALTER COLUMN "userId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "hmrc_submissions" ALTER COLUMN "clientId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "hmrc_submissions" ALTER COLUMN "documentId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "hmrc_transactions" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "hmrc_transactions" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "hmrc_transactions" ALTER COLUMN "userId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "hmrc_transactions" ALTER COLUMN "clientId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "hmrc_transactions" ALTER COLUMN "documentTransactionId" SET DATA TYPE uuid;