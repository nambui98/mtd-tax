ALTER TYPE "public"."user_role" ADD VALUE 'staff';--> statement-breakpoint
ALTER TYPE "public"."user_role" ADD VALUE 'client';

-- Add staff role if not exists
INSERT INTO roles (name, description)
SELECT 'staff', 'Staff user with limited access'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'staff');