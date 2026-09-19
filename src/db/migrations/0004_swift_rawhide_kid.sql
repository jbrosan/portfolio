CREATE TABLE "content_page_publication" (
	"page_id" uuid NOT NULL,
	"revision_id" uuid NOT NULL,
	"published_at" timestamp with time zone DEFAULT now() NOT NULL,
	"published_by" uuid NOT NULL,
	CONSTRAINT "content_page_publication_pkey" PRIMARY KEY("page_id")
);
--> statement-breakpoint
ALTER TABLE "content_page_publication" ADD CONSTRAINT "content_page_publication_published_by_user_id_fk" FOREIGN KEY ("published_by") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "content_page_publication" ADD CONSTRAINT "content_page_publication_page_id_content_page_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."content_page"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
CREATE UNIQUE INDEX "content_page_revision_page_id_id_uq" ON "content_page_revision" USING btree ("page_id","id");
--> statement-breakpoint
ALTER TABLE "content_page_publication" ADD CONSTRAINT "content_page_publication_page_revision_fk" FOREIGN KEY ("page_id","revision_id") REFERENCES "public"."content_page_revision"("page_id","id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
