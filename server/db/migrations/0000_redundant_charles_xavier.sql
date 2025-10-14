CREATE TABLE "career" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"slug" text NOT NULL,
	"company_id" uuid NOT NULL,
	"position" text NOT NULL,
	"start_date" text,
	"end_date" text,
	"card_color" text,
	"description" text,
	"company_overview" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_At" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "career_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "career_achievement" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"career_id" uuid NOT NULL,
	"body" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "career_attachment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"career_id" uuid NOT NULL,
	"url" text NOT NULL,
	"title" text
);
--> statement-breakpoint
CREATE TABLE "career_sub_role" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"career_id" uuid NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "company" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"logo_url" text,
	"employees" text,
	"revenue" text,
	"funding" text,
	"industry" text,
	"location" text,
	"overview" text,
	"parent_company_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "company_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "career_competency" (
	"career_id" uuid NOT NULL,
	"competency_id" uuid NOT NULL,
	CONSTRAINT "career_competency_career_id_competency_id_pk" PRIMARY KEY("career_id","competency_id")
);
--> statement-breakpoint
CREATE TABLE "competency" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "competency_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "competency_category" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "competency_category_name_unique" UNIQUE("name"),
	CONSTRAINT "competency_category_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "career" ADD CONSTRAINT "career_company_id_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "career_achievement" ADD CONSTRAINT "career_achievement_career_id_career_id_fk" FOREIGN KEY ("career_id") REFERENCES "public"."career"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "career_attachment" ADD CONSTRAINT "career_attachment_career_id_career_id_fk" FOREIGN KEY ("career_id") REFERENCES "public"."career"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "career_sub_role" ADD CONSTRAINT "career_sub_role_career_id_career_id_fk" FOREIGN KEY ("career_id") REFERENCES "public"."career"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "career_competency" ADD CONSTRAINT "career_competency_career_id_career_id_fk" FOREIGN KEY ("career_id") REFERENCES "public"."career"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "career_competency" ADD CONSTRAINT "career_competency_competency_id_competency_id_fk" FOREIGN KEY ("competency_id") REFERENCES "public"."competency"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "competency" ADD CONSTRAINT "competency_category_id_competency_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."competency_category"("id") ON DELETE restrict ON UPDATE cascade;