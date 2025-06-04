CREATE TYPE "public"."practice_type" AS ENUM('accountancy_practice', 'bookkeeping_service', 'tax_advisory_firm');--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "name" TO "first_name";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_name" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "phone_number" varchar(50);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "job_title" varchar(150);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password_hash" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "practice_type" "practice_type" DEFAULT 'accountancy_practice';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "hmrc_connected" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "agent_reference_number" varchar(20);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "utr" varchar(10);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "nino" varchar(9);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "hmrc_gateway_credentials" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "authority_to_act" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "hmrc_connected_at" timestamp;