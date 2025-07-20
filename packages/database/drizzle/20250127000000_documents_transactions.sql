-- Create documents table
CREATE TABLE IF NOT EXISTS "documents" (
    "id" text PRIMARY KEY NOT NULL,
    "userId" uuid NOT NULL REFERENCES "users"("id"),
    "clientId" uuid NOT NULL REFERENCES "clients"("id"),
    "businessId" text,
    "fileName" text NOT NULL,
    "originalFileName" text NOT NULL,
    "fileSize" integer NOT NULL,
    "fileType" text NOT NULL,
    "mimeType" text NOT NULL,
    "filePath" text NOT NULL,
    "documentType" text NOT NULL,
    "status" text NOT NULL DEFAULT 'uploaded',
    "processingStatus" text NOT NULL DEFAULT 'pending',
    "aiExtractedTransactions" integer DEFAULT 0,
    "aiAccuracy" decimal(3,2) DEFAULT 0.00,
    "hmrcSubmissionId" text,
    "hmrcBusinessId" text,
    "hmrcClientId" text,
    "metadata" jsonb,
    "uploadedAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" timestamp(3),
    "submittedToHmrcAt" timestamp(3),
    "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create document_transactions table
CREATE TABLE IF NOT EXISTS "document_transactions" (
    "id" text PRIMARY KEY NOT NULL,
    "documentId" text NOT NULL REFERENCES "documents"("id") ON DELETE CASCADE,
    "userId" uuid NOT NULL REFERENCES "users"("id"),
    "clientId" uuid NOT NULL REFERENCES "clients"("id"),
    "businessId" text,
    "transactionDate" date NOT NULL,
    "description" text NOT NULL,
    "category" text NOT NULL,
    "amount" decimal(10,2) NOT NULL,
    "currency" text NOT NULL DEFAULT 'GBP',
    "status" text NOT NULL DEFAULT 'pending',
    "isAIGenerated" boolean NOT NULL DEFAULT false,
    "aiConfidence" decimal(3,2) DEFAULT 0.00,
    "hmrcTransactionId" text,
    "hmrcCategory" text,
    "hmrcBusinessId" text,
    "hmrcClientId" text,
    "notes" text,
    "metadata" jsonb,
    "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create document_folders table
CREATE TABLE IF NOT EXISTS "document_folders" (
    "id" text PRIMARY KEY NOT NULL,
    "userId" uuid NOT NULL REFERENCES "users"("id"),
    "clientId" uuid NOT NULL REFERENCES "clients"("id"),
    "name" text NOT NULL,
    "description" text,
    "color" text DEFAULT '#2563eb',
    "icon" text DEFAULT 'folder',
    "parentFolderId" text,
    "isDefault" boolean NOT NULL DEFAULT false,
    "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create document_folder_assignments table
CREATE TABLE IF NOT EXISTS "document_folder_assignments" (
    "id" text PRIMARY KEY NOT NULL,
    "documentId" text NOT NULL REFERENCES "documents"("id") ON DELETE CASCADE,
    "folderId" text NOT NULL REFERENCES "document_folders"("id") ON DELETE CASCADE,
    "assignedAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("documentId", "folderId")
);

-- Create hmrc_submissions table
CREATE TABLE IF NOT EXISTS "hmrc_submissions" (
    "id" text PRIMARY KEY NOT NULL,
    "userId" uuid NOT NULL REFERENCES "users"("id"),
    "clientId" uuid NOT NULL REFERENCES "clients"("id"),
    "businessId" text NOT NULL,
    "documentId" text REFERENCES "documents"("id") ON DELETE SET NULL,
    "submissionType" text NOT NULL,
    "taxYear" text NOT NULL,
    "periodKey" text,
    "status" text NOT NULL DEFAULT 'draft',
    "hmrcSubmissionId" text,
    "hmrcResponse" jsonb,
    "submittedAt" timestamp(3),
    "processedAt" timestamp(3),
    "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create hmrc_transactions table
CREATE TABLE IF NOT EXISTS "hmrc_transactions" (
    "id" text PRIMARY KEY NOT NULL,
    "userId" uuid NOT NULL REFERENCES "users"("id"),
    "clientId" uuid NOT NULL REFERENCES "clients"("id"),
    "businessId" text NOT NULL,
    "documentTransactionId" text REFERENCES "document_transactions"("id") ON DELETE SET NULL,
    "hmrcTransactionId" text NOT NULL,
    "transactionType" text NOT NULL,
    "category" text NOT NULL,
    "amount" decimal(10,2) NOT NULL,
    "currency" text NOT NULL DEFAULT 'GBP',
    "transactionDate" date NOT NULL,
    "description" text NOT NULL,
    "status" text NOT NULL DEFAULT 'pending',
    "hmrcResponse" jsonb,
    "submittedAt" timestamp(3),
    "processedAt" timestamp(3),
    "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "documents_userId_idx" ON "documents"("userId");
CREATE INDEX IF NOT EXISTS "documents_clientId_idx" ON "documents"("clientId");
CREATE INDEX IF NOT EXISTS "documents_status_idx" ON "documents"("status");
CREATE INDEX IF NOT EXISTS "documents_uploadedAt_idx" ON "documents"("uploadedAt");

CREATE INDEX IF NOT EXISTS "document_transactions_documentId_idx" ON "document_transactions"("documentId");
CREATE INDEX IF NOT EXISTS "document_transactions_userId_idx" ON "document_transactions"("userId");
CREATE INDEX IF NOT EXISTS "document_transactions_clientId_idx" ON "document_transactions"("clientId");
CREATE INDEX IF NOT EXISTS "document_transactions_transactionDate_idx" ON "document_transactions"("transactionDate");
CREATE INDEX IF NOT EXISTS "document_transactions_category_idx" ON "document_transactions"("category");

CREATE INDEX IF NOT EXISTS "document_folders_userId_idx" ON "document_folders"("userId");
CREATE INDEX IF NOT EXISTS "document_folders_clientId_idx" ON "document_folders"("clientId");

CREATE INDEX IF NOT EXISTS "hmrc_submissions_userId_idx" ON "hmrc_submissions"("userId");
CREATE INDEX IF NOT EXISTS "hmrc_submissions_clientId_idx" ON "hmrc_submissions"("clientId");
CREATE INDEX IF NOT EXISTS "hmrc_submissions_status_idx" ON "hmrc_submissions"("status");

CREATE INDEX IF NOT EXISTS "hmrc_transactions_userId_idx" ON "hmrc_transactions"("userId");
CREATE INDEX IF NOT EXISTS "hmrc_transactions_clientId_idx" ON "hmrc_transactions"("clientId");
CREATE INDEX IF NOT EXISTS "hmrc_transactions_hmrcTransactionId_idx" ON "hmrc_transactions"("hmrcTransactionId");

-- Insert default folders
INSERT INTO "document_folders" ("id", "userId", "clientId", "name", "description", "color", "icon", "isDefault") VALUES
('default-receipts', '00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', 'Receipts & Expenses', 'Business receipts and expense documents', '#dc2626', 'receipt', true),
('default-invoices', '00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', 'Invoices', 'Customer invoices and sales documents', '#2563eb', 'file-text', true),
('default-bank-statements', '00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', 'Bank Statements', 'Bank account statements and transactions', '#059669', 'credit-card', true),
('default-tax-documents', '00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', 'Tax Documents', 'Tax returns and related documents', '#d97706', 'file-check', true); 