CREATE TYPE "public"."content_visibility" AS ENUM('public', 'protected');--> statement-breakpoint
CREATE TABLE "content_page" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"visibility" "content_visibility" DEFAULT 'protected' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_page_revision" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"page_id" uuid NOT NULL,
	"version_number" integer NOT NULL,
	"content_json" jsonb NOT NULL,
	"change_note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "content_page" ADD CONSTRAINT "content_page_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "content_page" ADD CONSTRAINT "content_page_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "content_page_revision" ADD CONSTRAINT "content_page_revision_page_id_content_page_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."content_page"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "content_page_revision" ADD CONSTRAINT "content_page_revision_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
CREATE UNIQUE INDEX "content_page_slug_uq" ON "content_page" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "content_page_visibility_idx" ON "content_page" USING btree ("visibility");--> statement-breakpoint
CREATE UNIQUE INDEX "content_page_revision_page_version_uq" ON "content_page_revision" USING btree ("page_id","version_number");--> statement-breakpoint
CREATE INDEX "content_page_revision_page_id_idx" ON "content_page_revision" USING btree ("page_id");--> statement-breakpoint
CREATE INDEX "content_page_revision_created_at_idx" ON "content_page_revision" USING btree ("created_at");