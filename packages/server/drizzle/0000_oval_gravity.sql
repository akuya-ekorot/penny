CREATE TYPE "public"."message_status" AS ENUM('delivered', 'read', 'sent');--> statement-breakpoint
CREATE TYPE "public"."message_types" AS ENUM('audio', 'contacts', 'document', 'image', 'interactive', 'location', 'reaction', 'sticker', 'template', 'text', 'video');--> statement-breakpoint
CREATE TYPE "public"."pricing_categories" AS ENUM('authentication', 'authentication_international', 'marketing', 'utility', 'service', 'referral_conversion');--> statement-breakpoint
CREATE TABLE "changes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"field" text DEFAULT 'messages' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"whatsapp_id" text NOT NULL,
	"whatsapp_user_id" text,
	"profile_name" text,
	"value_id" uuid,
	CONSTRAINT "contacts_whatsapp_id_unique" UNIQUE("whatsapp_id")
);
--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"whatsapp_id" text NOT NULL,
	"notification_id" uuid
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"message_id" text,
	"type" "message_types",
	"from" text,
	"timestamp" timestamp,
	"forwarded" boolean,
	"frequently_forwarded" boolean,
	"reply_to" uuid,
	"value_id" uuid
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"object" text DEFAULT 'whatsapp_business_account'
);
--> statement-breakpoint
CREATE TABLE "statuses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"message_id" uuid,
	"biz_opaque_callback_data" text,
	"conversation_id" uuid,
	"pricing_category" "pricing_categories",
	"pricing_model" text DEFAULT 'CPB',
	"recepient_id" text,
	"status" "message_status",
	"timestamp" timestamp
);
--> statement-breakpoint
CREATE TABLE "values" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"messaging_product" text DEFAULT 'whatsapp' NOT NULL,
	"change_id" uuid,
	"display_phone_number" text,
	"phone_number_id" text
);
--> statement-breakpoint
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_value_id_values_id_fk" FOREIGN KEY ("value_id") REFERENCES "public"."values"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "entries" ADD CONSTRAINT "entries_notification_id_notifications_id_fk" FOREIGN KEY ("notification_id") REFERENCES "public"."notifications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_value_id_values_id_fk" FOREIGN KEY ("value_id") REFERENCES "public"."values"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_reply_to_messages_id_fk" FOREIGN KEY ("reply_to") REFERENCES "public"."messages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "statuses" ADD CONSTRAINT "statuses_message_id_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."messages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "statuses" ADD CONSTRAINT "statuses_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "values" ADD CONSTRAINT "values_change_id_changes_id_fk" FOREIGN KEY ("change_id") REFERENCES "public"."changes"("id") ON DELETE no action ON UPDATE no action;