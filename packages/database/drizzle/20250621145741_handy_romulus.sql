CREATE TYPE "public"."business_type" AS ENUM('sole_trader', 'landlord', 'partnership');--> statement-breakpoint
CREATE TYPE "public"."client_category" AS ENUM('standard', 'premium', 'vip');--> statement-breakpoint
CREATE TYPE "public"."client_status" AS ENUM('mtd_ready', 'mtd_not_ready', 'action_needed', 'critical_issues');--> statement-breakpoint
CREATE TYPE "public"."client_type" AS ENUM('individual', 'landlord', 'both');--> statement-breakpoint
CREATE TABLE "clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_type" "client_type" NOT NULL,
	"mtd_status" boolean DEFAULT false NOT NULL,
	"title" varchar(100) NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"date_of_birth" date NOT NULL,
	"national_insurance_number" varchar(10) NOT NULL,
	"unique_taxpayer_reference" varchar(10) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone_number" varchar(20),
	"address_line_1" varchar(100) NOT NULL,
	"address_line_2" varchar(100),
	"city" varchar(100) NOT NULL,
	"county" varchar(100) NOT NULL,
	"postcode" varchar(100) NOT NULL,
	"business_name" varchar(100),
	"business_type" "business_type" NOT NULL,
	"accounting_period_start" date NOT NULL,
	"accounting_period_end" date NOT NULL,
	"vat_number" varchar(10),
	"assigned_to" uuid,
	"client_category" "client_category" NOT NULL,
	"notes" text,
	"send_welcome_email" boolean DEFAULT false,
	"hmrc_authorization" boolean DEFAULT false,
	"hmrc_connected" boolean DEFAULT false,
	"status" "client_status" DEFAULT 'mtd_ready' NOT NULL,
	"deadline" date NOT NULL,
	"total_revenue" integer NOT NULL,
	"created_by" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "clients_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;