create table "public"."gd_user_map" (
    "gdUserId" integer not null,
    "profileId" uuid not null
);


alter table "public"."gd_user_map" enable row level security;

CREATE UNIQUE INDEX gd_user_map_pkey ON public.gd_user_map USING btree ("profileId");

alter table "public"."gd_user_map" add constraint "gd_user_map_pkey" PRIMARY KEY using index "gd_user_map_pkey";

alter table "public"."gd_user_map" add constraint "gd_user_map_gdUserId_fkey" FOREIGN KEY ("gdUserId") REFERENCES gd_user(id) not valid;

alter table "public"."gd_user_map" validate constraint "gd_user_map_gdUserId_fkey";

alter table "public"."gd_user_map" add constraint "gd_user_map_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES auth.users(id) not valid;

alter table "public"."gd_user_map" validate constraint "gd_user_map_profileId_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_user_id(profile_id uuid)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    user_id int;
BEGIN
    SELECT "gdUserId" INTO user_id
    FROM gd_user_map
    WHERE "profileId" = profile_id
    LIMIT 1;
    
    RETURN user_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.is_commissioner_of(tourney_id integer)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    commissioner_id int;
BEGIN
    SELECT "gdUserId" INTO commissioner_id
    FROM gd_user_map
    WHERE "profileId" = auth.uid()
    AND "gdUserId" IN (
        SELECT "userId" FROM commissioners 
        WHERE "tourneyId" = tourney_id
    )
    LIMIT 1;
    
    RETURN commissioner_id IS NOT NULL;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.is_user(user_id integer)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    current_user_id int;
BEGIN
    SELECT get_user_id(auth.uid()) INTO current_user_id;
    
    RETURN user_id = current_user_id;
END;
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
  IF next_pick_user_id <> user_id THEN
    raise exception 'Invalid user: %, expected %', user_id, next_pick_user_id;
  END IF;
  IF next_pick_number <> pick_number THEN
    raise exception 'Invalid pick number: %, expected %', pick_number, next_pick_number;
  END IF;

  SELECT get_user_id(auth.uid()) INTO picked_by_user_id;

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
  IF next_pick_user_id <> user_id THEN
    raise exception 'Invalid user: %, expected %', user_id, next_pick_user_id;
  END IF;
  IF next_pick_number <> pick_number THEN
    raise exception 'Invalid pick number: %, expected %', pick_number, next_pick_number;
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
    SELECT get_user_id(auth.uid()) INTO picked_by_user_id;
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

CREATE OR REPLACE FUNCTION public.set_pick_list(tourney_id integer, golfer_ids text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
    user_id int;
    golfer_ids_arr INT[];
BEGIN
    SELECT get_user_id(auth.uid()) INTO user_id;

    golfer_ids_arr := string_to_array(golfer_ids, ',')::INT[];

    DELETE FROM draft_pick_list WHERE "tourneyId" = tourney_id AND "userId" = user_id;

    IF golfer_ids_arr IS NOT NULL AND array_length(golfer_ids_arr, 1) > 0 THEN
        FOR i IN 1..array_length(golfer_ids_arr, 1) LOOP
            INSERT INTO draft_pick_list ("tourneyId", "userId", "golferId", "pickOrder")
            VALUES (tourney_id, user_id, golfer_ids_arr[i], i);
        END LOOP;
    END IF;

    RETURN;
END;
$function$
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
    IF NOT is_commissioner_of(tourney_id) THEN
        raise exception 'Only the commissioner can undo the last pick';
    END IF;

    SELECT pg_try_advisory_xact_lock(tourney_id) INTO tx;
    IF tx <> 'true' THEN
        RETURN;
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


