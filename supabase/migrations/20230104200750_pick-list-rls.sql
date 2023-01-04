drop function if exists "public"."set_pick_list"(golfer_ids text);

alter table "public"."app_state" enable row level security;

alter table "public"."draft_pick_list" enable row level security;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.is_user(user_id integer)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
DECLARE
    current_user_id int;
BEGIN
    SELECT gd_user.id, gd_user.username INTO current_user_id
    FROM gd_user
    WHERE (gd_user."profileId" = auth.uid());
    
    RETURN user_id = current_user_id;
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
    SELECT "id" INTO user_id
    FROM gd_user
    WHERE auth.uid() = "profileId"
    LIMIT 1;

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

create policy "Users can insert into their own pick lists"
on "public"."draft_pick_list"
as permissive
for insert
to public
with check (is_user("userId"));


create policy "users can delete from their own pick list"
on "public"."draft_pick_list"
as permissive
for delete
to public
using (is_user("userId"));


create policy "users can select their own pick lists"
on "public"."draft_pick_list"
as permissive
for select
to public
using (is_user("userId"));



