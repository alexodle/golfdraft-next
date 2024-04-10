alter table "public"."draft_settings" add column "draftStart" timestamp with time zone not null default now();
