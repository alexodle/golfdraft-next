alter table "public"."draft_settings" enable row level security;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.is_commissioner_of(tourney_id integer)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
DECLARE
    commissioner_id int;
BEGIN
    SELECT gd_user.id INTO commissioner_id
    FROM gd_user
    WHERE "profileId" = auth.uid() AND id IN (
        SELECT "userId" FROM commissioners 
        WHERE "tourneyId" = tourney_id
    );
    
    RETURN commissioner_id IS NOT NULL;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.is_user(user_id integer)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
DECLARE
    current_user_id int;
BEGIN
    SELECT gd_user.id INTO current_user_id
    FROM gd_user
    WHERE (gd_user."profileId" = auth.uid());

    RETURN user_id = current_user_id;
END;
$function$
;

create policy "Authenticated users can read draft settings"
on "public"."draft_settings"
as permissive
for select
to authenticated
using (true);


create policy "commissioner can create draft settings"
on "public"."draft_settings"
as permissive
for insert
to public
with check (is_commissioner_of("tourneyId"));


create policy "commissioner can update draft_settings"
on "public"."draft_settings"
as permissive
for update
to public
using (is_commissioner_of("tourneyId"))
with check (is_commissioner_of("tourneyId"));



