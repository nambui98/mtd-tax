ALTER TABLE "companies" ALTER COLUMN "owner_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "password_hash";