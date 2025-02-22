ALTER TABLE "messages" DROP CONSTRAINT "parent";
--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."messages"("id") ON DELETE no action ON UPDATE no action;