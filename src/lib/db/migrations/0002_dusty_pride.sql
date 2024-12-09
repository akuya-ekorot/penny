CREATE TABLE IF NOT EXISTS "budgets" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"is_recurring" boolean NOT NULL,
	"recurring_period" text,
	"recurring_frequency" integer,
	"target_amount" integer NOT NULL,
	"assigned_amount" integer NOT NULL,
	"spent_amount" integer NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "budgets" ADD CONSTRAINT "budgets_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
