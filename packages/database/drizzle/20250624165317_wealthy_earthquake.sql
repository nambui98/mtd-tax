CREATE TABLE "assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"staff_user_id" uuid NOT NULL,
	"created_by" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "clients" ALTER COLUMN "county" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "clients" ALTER COLUMN "client_category" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_staff_user_id_users_id_fk" FOREIGN KEY ("staff_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clients" DROP COLUMN "business_name";--> statement-breakpoint
ALTER TABLE "clients" DROP COLUMN "business_type";--> statement-breakpoint
ALTER TABLE "clients" DROP COLUMN "accounting_period_start";--> statement-breakpoint
ALTER TABLE "clients" DROP COLUMN "accounting_period_end";--> statement-breakpoint
ALTER TABLE "clients" DROP COLUMN "vat_number";