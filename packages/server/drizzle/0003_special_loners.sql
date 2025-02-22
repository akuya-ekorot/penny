ALTER TABLE "messages" RENAME COLUMN "reply_to" TO "parent_id";--> statement-breakpoint
ALTER TABLE "messages" DROP CONSTRAINT "replies";
--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "parent" FOREIGN KEY ("parent_id") REFERENCES "public"."messages"("id") ON DELETE no action ON UPDATE no action;