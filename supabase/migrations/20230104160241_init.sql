create table "public"."app_state" (
    "activeTourneyId" integer not null,
    "id" integer not null
);


create table "public"."commissioners" (
    "tourneyId" integer not null,
    "userId" integer not null
);


alter table "public"."commissioners" enable row level security;

create table "public"."draft_auto_pick" (
    "tourneyId" integer not null,
    "userId" integer not null
);


alter table "public"."draft_auto_pick" enable row level security;

create table "public"."draft_pick" (
    "tourneyId" integer not null,
    "pickNumber" integer not null,
    "userId" integer not null,
    "golferId" integer,
    "timestampEpochMillis" bigint,
    "clientTimestampEpochMillis" bigint,
    "pickedByUserId" integer
);


alter table "public"."draft_pick" enable row level security;

create table "public"."draft_pick_list" (
    "tourneyId" integer not null,
    "golferId" integer not null,
    "pickOrder" integer not null,
    "userId" integer not null
);


create table "public"."draft_settings" (
    "tourneyId" integer not null,
    "draftHasStarted" boolean not null default false,
    "isDraftPaused" boolean not null default false,
    "allowClock" boolean not null default true
);


create table "public"."gd_user" (
    "id" integer generated always as identity not null,
    "name" text not null,
    "username" text not null,
    "profileId" uuid
);


alter table "public"."gd_user" enable row level security;

create table "public"."golfer" (
    "id" integer generated always as identity not null,
    "tourneyId" integer not null,
    "name" text not null,
    "wgr" smallint
);


alter table "public"."golfer" enable row level security;

create table "public"."golfer_score" (
    "tourneyId" integer not null,
    "golferId" integer not null,
    "day" smallint,
    "thru" smallint,
    "scores" text not null
);


alter table "public"."golfer_score" enable row level security;

create table "public"."golfer_score_override" (
    "tourneyId" integer not null,
    "golferId" integer not null,
    "day" smallint,
    "thru" smallint,
    "scores" text not null
);


alter table "public"."golfer_score_override" enable row level security;

create table "public"."tourney" (
    "id" integer generated always as identity not null,
    "name" text not null,
    "startDateEpochMillis" bigint not null,
    "lastUpdatedEpochMillis" bigint not null,
    "config" text not null
);


alter table "public"."tourney" enable row level security;

create table "public"."tourney_standings" (
    "tourneyId" integer not null,
    "currentDay" integer,
    "worstScoresForDay" text
);


alter table "public"."tourney_standings" enable row level security;

create table "public"."tourney_standings_player_scores" (
    "tourneyId" integer not null,
    "userId" integer not null,
    "totalScore" integer not null,
    "standing" integer not null,
    "isTied" boolean not null,
    "currentDay" integer,
    "dayScores" text not null
);


alter table "public"."tourney_standings_player_scores" enable row level security;

CREATE UNIQUE INDEX app_state_pkey ON public.app_state USING btree (id);

CREATE UNIQUE INDEX comissioner_pkey ON public.commissioners USING btree ("tourneyId", "userId");

CREATE UNIQUE INDEX draft_auto_pick_pkey ON public.draft_auto_pick USING btree ("tourneyId", "userId");

CREATE UNIQUE INDEX draft_pick_list_pkey ON public.draft_pick_list USING btree ("tourneyId", "pickOrder", "userId");

CREATE UNIQUE INDEX draft_pick_pkey ON public.draft_pick USING btree ("tourneyId", "pickNumber");

CREATE UNIQUE INDEX "draft_pick_tourneyId_golferId_idx" ON public.draft_pick USING btree ("tourneyId", "golferId");

CREATE UNIQUE INDEX draft_pick_tourney_id_golfer_id ON public.draft_pick USING btree ("tourneyId", "golferId");

CREATE UNIQUE INDEX draft_settings_pkey ON public.draft_settings USING btree ("tourneyId");

CREATE UNIQUE INDEX "draft_settings_tourneyId_key" ON public.draft_settings USING btree ("tourneyId");

CREATE UNIQUE INDEX gd_user_pkey ON public.gd_user USING btree (id);

CREATE UNIQUE INDEX golfer_pkey ON public.golfer USING btree (id);

CREATE UNIQUE INDEX golfer_score_override_pkey ON public.golfer_score_override USING btree ("tourneyId", "golferId");

CREATE UNIQUE INDEX golfer_score_pkey ON public.golfer_score USING btree ("tourneyId", "golferId");

CREATE INDEX "golfer_tourneyId_idx" ON public.golfer USING btree ("tourneyId");

CREATE UNIQUE INDEX "golfer_tourneyId_name_idx" ON public.golfer USING btree ("tourneyId", name);

CREATE UNIQUE INDEX tourney_name_key ON public.tourney USING btree (name);

CREATE UNIQUE INDEX tourney_pkey ON public.tourney USING btree (id);

CREATE UNIQUE INDEX tourney_standings_pkey ON public.tourney_standings USING btree ("tourneyId");

CREATE UNIQUE INDEX tourney_standings_player_scores_pkey ON public.tourney_standings_player_scores USING btree ("tourneyId", "userId");

alter table "public"."app_state" add constraint "app_state_pkey" PRIMARY KEY using index "app_state_pkey";

alter table "public"."commissioners" add constraint "comissioner_pkey" PRIMARY KEY using index "comissioner_pkey";

alter table "public"."draft_auto_pick" add constraint "draft_auto_pick_pkey" PRIMARY KEY using index "draft_auto_pick_pkey";

alter table "public"."draft_pick" add constraint "draft_pick_pkey" PRIMARY KEY using index "draft_pick_pkey";

alter table "public"."draft_pick_list" add constraint "draft_pick_list_pkey" PRIMARY KEY using index "draft_pick_list_pkey";

alter table "public"."draft_settings" add constraint "draft_settings_pkey" PRIMARY KEY using index "draft_settings_pkey";

alter table "public"."gd_user" add constraint "gd_user_pkey" PRIMARY KEY using index "gd_user_pkey";

alter table "public"."golfer" add constraint "golfer_pkey" PRIMARY KEY using index "golfer_pkey";

alter table "public"."golfer_score" add constraint "golfer_score_pkey" PRIMARY KEY using index "golfer_score_pkey";

alter table "public"."golfer_score_override" add constraint "golfer_score_override_pkey" PRIMARY KEY using index "golfer_score_override_pkey";

alter table "public"."tourney" add constraint "tourney_pkey" PRIMARY KEY using index "tourney_pkey";

alter table "public"."tourney_standings" add constraint "tourney_standings_pkey" PRIMARY KEY using index "tourney_standings_pkey";

alter table "public"."tourney_standings_player_scores" add constraint "tourney_standings_player_scores_pkey" PRIMARY KEY using index "tourney_standings_player_scores_pkey";

alter table "public"."app_state" add constraint "app_state_activeTourneyId_fkey" FOREIGN KEY ("activeTourneyId") REFERENCES tourney(id) not valid;

alter table "public"."app_state" validate constraint "app_state_activeTourneyId_fkey";

alter table "public"."commissioners" add constraint "comissioner_tourneyId_fkey" FOREIGN KEY ("tourneyId") REFERENCES tourney(id) not valid;

alter table "public"."commissioners" validate constraint "comissioner_tourneyId_fkey";

alter table "public"."commissioners" add constraint "comissioner_userId_fkey" FOREIGN KEY ("userId") REFERENCES gd_user(id) not valid;

alter table "public"."commissioners" validate constraint "comissioner_userId_fkey";

alter table "public"."draft_auto_pick" add constraint "draft_auto_pick_tourneyId_fkey" FOREIGN KEY ("tourneyId") REFERENCES tourney(id) not valid;

alter table "public"."draft_auto_pick" validate constraint "draft_auto_pick_tourneyId_fkey";

alter table "public"."draft_auto_pick" add constraint "draft_auto_pick_userId_fkey" FOREIGN KEY ("userId") REFERENCES gd_user(id) not valid;

alter table "public"."draft_auto_pick" validate constraint "draft_auto_pick_userId_fkey";

alter table "public"."draft_pick" add constraint "draft_pick_golferId_fkey" FOREIGN KEY ("golferId") REFERENCES golfer(id) not valid;

alter table "public"."draft_pick" validate constraint "draft_pick_golferId_fkey";

alter table "public"."draft_pick" add constraint "draft_pick_pickedByUserId_fkey" FOREIGN KEY ("pickedByUserId") REFERENCES gd_user(id) not valid;

alter table "public"."draft_pick" validate constraint "draft_pick_pickedByUserId_fkey";

alter table "public"."draft_pick" add constraint "draft_pick_tourneyId_fkey" FOREIGN KEY ("tourneyId") REFERENCES tourney(id) not valid;

alter table "public"."draft_pick" validate constraint "draft_pick_tourneyId_fkey";

alter table "public"."draft_pick" add constraint "draft_pick_userId_fkey" FOREIGN KEY ("userId") REFERENCES gd_user(id) not valid;

alter table "public"."draft_pick" validate constraint "draft_pick_userId_fkey";

alter table "public"."draft_pick_list" add constraint "draft_pick_list_golferId_fkey" FOREIGN KEY ("golferId") REFERENCES golfer(id) not valid;

alter table "public"."draft_pick_list" validate constraint "draft_pick_list_golferId_fkey";

alter table "public"."draft_pick_list" add constraint "draft_pick_list_tourneyId_fkey" FOREIGN KEY ("tourneyId") REFERENCES tourney(id) not valid;

alter table "public"."draft_pick_list" validate constraint "draft_pick_list_tourneyId_fkey";

alter table "public"."draft_pick_list" add constraint "draft_pick_list_userId_fkey" FOREIGN KEY ("userId") REFERENCES gd_user(id) not valid;

alter table "public"."draft_pick_list" validate constraint "draft_pick_list_userId_fkey";

alter table "public"."draft_settings" add constraint "draft_settings_tourneyId_fkey" FOREIGN KEY ("tourneyId") REFERENCES tourney(id) not valid;

alter table "public"."draft_settings" validate constraint "draft_settings_tourneyId_fkey";

alter table "public"."draft_settings" add constraint "draft_settings_tourneyId_key" UNIQUE using index "draft_settings_tourneyId_key";

alter table "public"."golfer" add constraint "golfer_tourneyId_fkey" FOREIGN KEY ("tourneyId") REFERENCES tourney(id) not valid;

alter table "public"."golfer" validate constraint "golfer_tourneyId_fkey";

alter table "public"."golfer_score" add constraint "golfer_score_golferId_fkey" FOREIGN KEY ("golferId") REFERENCES golfer(id) not valid;

alter table "public"."golfer_score" validate constraint "golfer_score_golferId_fkey";

alter table "public"."golfer_score" add constraint "golfer_score_tourneyId_fkey" FOREIGN KEY ("tourneyId") REFERENCES tourney(id) not valid;

alter table "public"."golfer_score" validate constraint "golfer_score_tourneyId_fkey";

alter table "public"."golfer_score_override" add constraint "golfer_score_override_golferId_fkey" FOREIGN KEY ("golferId") REFERENCES golfer(id) not valid;

alter table "public"."golfer_score_override" validate constraint "golfer_score_override_golferId_fkey";

alter table "public"."golfer_score_override" add constraint "golfer_score_override_tourneyId_fkey" FOREIGN KEY ("tourneyId") REFERENCES tourney(id) not valid;

alter table "public"."golfer_score_override" validate constraint "golfer_score_override_tourneyId_fkey";

alter table "public"."tourney" add constraint "tourney_name_key" UNIQUE using index "tourney_name_key";

alter table "public"."tourney_standings" add constraint "tourney_standings_tourneyId_fkey" FOREIGN KEY ("tourneyId") REFERENCES tourney(id) not valid;

alter table "public"."tourney_standings" validate constraint "tourney_standings_tourneyId_fkey";

alter table "public"."tourney_standings_player_scores" add constraint "tourney_standings_player_scores_tourneyId_fkey" FOREIGN KEY ("tourneyId") REFERENCES tourney(id) not valid;

alter table "public"."tourney_standings_player_scores" validate constraint "tourney_standings_player_scores_tourneyId_fkey";

alter table "public"."tourney_standings_player_scores" add constraint "tourney_standings_player_scores_tourneyId_fkey1" FOREIGN KEY ("tourneyId") REFERENCES tourney_standings("tourneyId") not valid;

alter table "public"."tourney_standings_player_scores" validate constraint "tourney_standings_player_scores_tourneyId_fkey1";

alter table "public"."tourney_standings_player_scores" add constraint "tourney_standings_player_scores_userId_fkey" FOREIGN KEY ("userId") REFERENCES gd_user(id) not valid;

alter table "public"."tourney_standings_player_scores" validate constraint "tourney_standings_player_scores_userId_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_next_pick(tourney_id integer)
 RETURNS draft_pick
 LANGUAGE sql
AS $function$  
  SELECT *
  FROM draft_pick
  WHERE "tourneyId" = tourney_id AND "golferId" IS NULL
  ORDER BY "pickNumber" ASC
  LIMIT 1;
$function$
;

CREATE OR REPLACE FUNCTION public.make_pick(tourney_id integer, user_id integer, pick_number integer, golfer_id integer)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  next_pick_user_id int;
  next_pick_number int;
  already_picked_golfer_id int;
  picked_by_user_id int;
  tx varchar;
BEGIN
  SELECT pg_try_advisory_xact_lock(tourney_id) INTO tx;
  IF tx <> 'true' THEN
    RETURN;
  END IF;

  -- Validate is current pick
  SELECT "userId", "pickNumber" INTO next_pick_user_id, next_pick_number
  FROM get_next_pick(tourney_id);
  IF next_pick_user_id <> user_id OR next_pick_number <> pick_number THEN
    raise exception 'Invalid user or pick_number';
  END IF;

--   -- Validate golfer not already picked
--   SELECT "golferId" INTO already_picked_golfer_id
--   FROM draft_pick
--   WHERE "tourneyId" = tourney_id AND "golferId" = golfer_id
--   LIMIT 1;
--   IF already_picked_golfer_id IS NOT NULL THEN
--     raise exception 'Golfer already picked';
--   END IF;
  
  SELECT "id" INTO picked_by_user_id
  FROM gd_user
  WHERE auth.uid() = "profileId"
  LIMIT 1;

  UPDATE draft_pick
  SET
    "golferId" = golfer_id,
    "pickedByUserId" = picked_by_user_id,
    "timestampEpochMillis" = extract(epoch from now()) * 1000,
    "clientTimestampEpochMillis" = extract(epoch from now()) * 1000
  WHERE
    "tourneyId" = tourney_id
    AND "pickNumber" = pick_number
    AND "userId" = user_id
    AND "golferId" IS NULL;
  
  RETURN;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.make_pick_list_or_wgr_pick(tourney_id integer, user_id integer, pick_number integer)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  next_pick_user_id int;
  next_pick_number int;
  pick_list_golfer_id int;
  wgr_golfer_id int;
  golfer_to_pick_id int;
  picked_by_user_id int;
  auto_pick_user_id int;
  tx varchar;
BEGIN
  SELECT pg_try_advisory_xact_lock(tourney_id) INTO tx;
  IF tx <> 'true' THEN
    RETURN;
  END IF;

  -- Validate is current pick
  SELECT "userId", "pickNumber" INTO next_pick_user_id, next_pick_number
  FROM get_next_pick(tourney_id);
  IF next_pick_user_id <> user_id OR next_pick_number <> pick_number THEN
    raise exception 'Invalid user or pick_number';
  END IF;

  SELECT "golferId" INTO pick_list_golfer_id
  FROM draft_pick_list
  WHERE "tourneyId" = tourney_id AND "userId" = user_id AND "golferId" NOT IN (
    SELECT "golferId"
    FROM draft_pick
    WHERE "tourneyId" = tourney_id AND "golferId" IS NOT NULL
  )
  ORDER BY "pickOrder" ASC
  LIMIT 1;

  SELECT "id" INTO wgr_golfer_id FROM (
    SELECT "id", "wgr"
    FROM golfer
    WHERE "tourneyId" = tourney_id AND "id" NOT IN (
      SELECT "golferId"
      FROM draft_pick
      WHERE "tourneyId" = tourney_id AND "golferId" IS NOT NULL
    )
    ORDER BY wgr ASC
    LIMIT 7 -- TODO configurable
  ) as next_golfers
  ORDER BY wgr DESC
  LIMIT 1;

  IF pick_list_golfer_id IS NOT NULL THEN
    golfer_to_pick_id := pick_list_golfer_id;
  ELSE
    golfer_to_pick_id := wgr_golfer_id;
  END IF;
  IF golfer_to_pick_id IS NULL THEN
     raise exception 'No golfer found for auto pick';
  END IF;

  SELECT "userId" INTO auto_pick_user_id
  FROM draft_auto_pick
  WHERE "tourneyId" = tourney_id AND "userId" = user_id;

  IF auto_pick_user_id IS NULL THEN
    SELECT "id" INTO picked_by_user_id
    FROM gd_user
    WHERE auth.uid() = "profileId"
    LIMIT 1;
  END IF;

  UPDATE draft_pick
  SET
    "golferId" = golfer_to_pick_id,
    "pickedByUserId" = picked_by_user_id,
    "timestampEpochMillis" = extract(epoch from now()) * 1000,
    "clientTimestampEpochMillis" = extract(epoch from now()) * 1000
  WHERE
    "tourneyId" = tourney_id
    AND "pickNumber" = pick_number
    AND "userId" = user_id
    AND "golferId" IS NULL;
  
  RETURN;
END;
$function$
;

create or replace view "public"."pick_list_user" as  SELECT draft_pick_list."tourneyId",
    draft_pick_list."userId"
   FROM draft_pick_list
  GROUP BY draft_pick_list."tourneyId", draft_pick_list."userId";


CREATE OR REPLACE FUNCTION public.run_auto_pick(tourney_id integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
  next_pick_user_id int;
  next_pick_number int;
  tx varchar;
BEGIN
  SELECT pg_try_advisory_xact_lock(tourney_id) INTO tx;
  IF tx <> 'true' THEN
    RETURN;
  END IF;

  SELECT "userId", "pickNumber" INTO next_pick_user_id, next_pick_number
  FROM get_next_pick(tourney_id)
  WHERE "userId" IN (
    SELECT "userId"
    FROM draft_auto_pick
    WHERE "tourneyId" = tourney_id
  );
  
  IF next_pick_user_id IS NULL THEN
    raise exception 'next pick user is not set to auto pick';
  END IF;

  PERFORM make_pick_list_or_wgr_pick(tourney_id, next_pick_user_id, next_pick_number);

  RETURN;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.set_pick_list(golfer_ids text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
    arr INT[];
BEGIN
    arr := string_to_array(golfer_ids, ',')::INT[];

    DELETE FROM draft_pick_list WHERE "tourneyId" = tourney_id AND "userId" = user_id;
    IF arr IS NOT NULL AND array_length(arr, 1) > 0 THEN
        FOR i IN 1..array_length(arr, 1) LOOP
            INSERT INTO draft_pick_list ("tourneyId", "userId", "golferId", "pickOrder")
            VALUES (tourney_id, user_id, arr[i], i);
        END LOOP;
    END IF;

    RETURN;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.set_pick_list(tourney_id bigint, user_id bigint, golfer_ids text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$DECLARE
  arr INT[];
BEGIN
    arr := string_to_array(golfer_ids, ',')::INT[];
    DELETE FROM draft_pick_list WHERE "tourneyId" = tourney_id AND "userId" = user_id;
  
  IF arr IS NOT NULL AND array_length(arr, 1) > 0 THEN
    FOR i IN 1..array_length(arr, 1) LOOP
      INSERT INTO draft_pick_list ("tourneyId", "userId", "golferId", "pickOrder")
      VALUES (tourney_id, user_id, arr[i], i);
    END LOOP;
    END IF;
END;$function$
;

CREATE OR REPLACE FUNCTION public.undo_last_pick(tourney_id integer)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    commissioner_user_id int;
    last_pick_number int;
    tx varchar;
BEGIN
    SELECT pg_try_advisory_xact_lock(tourney_id) INTO tx;
    IF tx <> 'true' THEN
        RETURN;
    END IF;

    SELECT "id" INTO commissioner_user_id
    FROM gd_user
    WHERE auth.uid() = "profileId" AND "id" IN (
        SELECT "userId" FROM commissioners WHERE "tourneyId" = tourney_id
    )
    LIMIT 1;

    IF commissioner_user_id IS NULL THEN
        raise exception 'Only the commissioner can undo the last pick';
    END IF;

    SELECT "pickNumber" INTO last_pick_number
    FROM draft_pick
    WHERE "tourneyId" = tourney_id AND "golferId" IS NOT NULL
    ORDER BY "pickNumber" DESC
    LIMIT 1;

    IF last_pick_number IS NULL THEN
        raise exception 'No picks have been made yet';
    END IF;
    
    UPDATE draft_pick 
    SET 
        "golferId" = NULL, 
        "timestampEpochMillis" = NULL, 
        "clientTimestampEpochMillis" = NULL, 
        "pickedByUserId" = NULL
    WHERE "tourneyId" = tourney_id AND "pickNumber" = last_pick_number;

    RETURN;
END;
$function$
;

create policy "Enable read access for authenticated users"
on "public"."app_state"
as permissive
for select
to authenticated
using (true);


create policy "enable select for authenticated users"
on "public"."commissioners"
as permissive
for select
to authenticated
using (true);


create policy "authenticated users can select draft_auto_pick"
on "public"."draft_auto_pick"
as permissive
for select
to authenticated
using (true);


create policy "commissioners can delete from draft_auto_pick"
on "public"."draft_auto_pick"
as permissive
for delete
to public
using ((auth.uid() IN ( SELECT gd_user."profileId"
   FROM gd_user
  WHERE (gd_user.id IN ( SELECT commissioners."userId"
           FROM commissioners
          WHERE (commissioners."tourneyId" = draft_auto_pick."tourneyId"))))));


create policy "commissioners can insert into draft_auto_pick"
on "public"."draft_auto_pick"
as permissive
for insert
to public
with check ((auth.uid() IN ( SELECT gd_user."profileId"
   FROM gd_user
  WHERE (gd_user.id IN ( SELECT commissioners."userId"
           FROM commissioners
          WHERE (commissioners."tourneyId" = draft_auto_pick."tourneyId"))))));


create policy "allow read for all authenticated users"
on "public"."draft_pick"
as permissive
for select
to authenticated
using (true);


create policy "enable read for authenticated users"
on "public"."gd_user"
as permissive
for select
to authenticated
using (true);


create policy "Enable select for authenticated users only"
on "public"."golfer"
as permissive
for select
to authenticated
using (true);


create policy "Enable select for authenticated users only"
on "public"."golfer_score"
as permissive
for select
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."golfer_score_override"
as permissive
for select
to authenticated
using (true);


create policy "Enable select for authenticated users only"
on "public"."tourney"
as permissive
for select
to authenticated
using (true);


create policy "Enable select for authenticated users only"
on "public"."tourney_standings"
as permissive
for select
to authenticated
using (true);


create policy "Enable select for authenticated users only"
on "public"."tourney_standings_player_scores"
as permissive
for select
to authenticated
using (true);



