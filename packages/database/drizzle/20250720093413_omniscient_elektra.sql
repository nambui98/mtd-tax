CREATE TABLE "document_folder_assignments" (
	"id" text PRIMARY KEY NOT NULL,
	"documentId" text NOT NULL,
	"folderId" text NOT NULL,
	"assignedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "document_folders" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"clientId" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"color" text DEFAULT '#2563eb',
	"icon" text DEFAULT 'folder',
	"parentFolderId" text,
	"isDefault" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "document_transactions" (
	"id" text PRIMARY KEY NOT NULL,
	"documentId" text NOT NULL,
	"userId" text NOT NULL,
	"clientId" text NOT NULL,
	"businessId" text,
	"transactionDate" date NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"currency" text DEFAULT 'GBP' NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"isAIGenerated" boolean DEFAULT false NOT NULL,
	"aiConfidence" numeric(3, 2) DEFAULT '0.00',
	"hmrcTransactionId" text,
	"hmrcCategory" text,
	"hmrcBusinessId" text,
	"hmrcClientId" text,
	"notes" text,
	"metadata" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"clientId" text NOT NULL,
	"businessId" text,
	"fileName" text NOT NULL,
	"originalFileName" text NOT NULL,
	"fileSize" integer NOT NULL,
	"fileType" text NOT NULL,
	"mimeType" text NOT NULL,
	"filePath" text NOT NULL,
	"documentType" text NOT NULL,
	"status" text DEFAULT 'uploaded' NOT NULL,
	"processingStatus" text DEFAULT 'pending' NOT NULL,
	"aiExtractedTransactions" integer DEFAULT 0,
	"aiAccuracy" numeric(3, 2) DEFAULT '0.00',
	"hmrcSubmissionId" text,
	"hmrcBusinessId" text,
	"hmrcClientId" text,
	"metadata" jsonb,
	"uploadedAt" timestamp DEFAULT now() NOT NULL,
	"processedAt" timestamp,
	"submittedToHmrcAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hmrc_submissions" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"clientId" text NOT NULL,
	"businessId" text NOT NULL,
	"documentId" text,
	"submissionType" text NOT NULL,
	"taxYear" text NOT NULL,
	"periodKey" text,
	"status" text DEFAULT 'draft' NOT NULL,
	"hmrcSubmissionId" text,
	"hmrcResponse" jsonb,
	"submittedAt" timestamp,
	"processedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hmrc_transactions" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"clientId" text NOT NULL,
	"businessId" text NOT NULL,
	"documentTransactionId" text,
	"hmrcTransactionId" text NOT NULL,
	"transactionType" text NOT NULL,
	"category" text NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"currency" text DEFAULT 'GBP' NOT NULL,
	"transactionDate" date NOT NULL,
	"description" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"hmrcResponse" jsonb,
	"submittedAt" timestamp,
	"processedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "document_folder_assignments" ADD CONSTRAINT "document_folder_assignments_documentId_documents_id_fk" FOREIGN KEY ("documentId") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_folder_assignments" ADD CONSTRAINT "document_folder_assignments_folderId_document_folders_id_fk" FOREIGN KEY ("folderId") REFERENCES "public"."document_folders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_folders" ADD CONSTRAINT "document_folders_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_folders" ADD CONSTRAINT "document_folders_clientId_clients_id_fk" FOREIGN KEY ("clientId") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_transactions" ADD CONSTRAINT "document_transactions_documentId_documents_id_fk" FOREIGN KEY ("documentId") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_transactions" ADD CONSTRAINT "document_transactions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_transactions" ADD CONSTRAINT "document_transactions_clientId_clients_id_fk" FOREIGN KEY ("clientId") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_clientId_clients_id_fk" FOREIGN KEY ("clientId") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hmrc_submissions" ADD CONSTRAINT "hmrc_submissions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hmrc_submissions" ADD CONSTRAINT "hmrc_submissions_clientId_clients_id_fk" FOREIGN KEY ("clientId") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hmrc_submissions" ADD CONSTRAINT "hmrc_submissions_documentId_documents_id_fk" FOREIGN KEY ("documentId") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hmrc_transactions" ADD CONSTRAINT "hmrc_transactions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hmrc_transactions" ADD CONSTRAINT "hmrc_transactions_clientId_clients_id_fk" FOREIGN KEY ("clientId") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hmrc_transactions" ADD CONSTRAINT "hmrc_transactions_documentTransactionId_document_transactions_id_fk" FOREIGN KEY ("documentTransactionId") REFERENCES "public"."document_transactions"("id") ON DELETE set null ON UPDATE no action;