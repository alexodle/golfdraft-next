set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.debug(msg text, some_bool boolean)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
BEGIN
    raise notice 'debug: %, value:%', msg, some_bool;
    RETURN true;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.debug(msg text, some_int integer)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
BEGIN
    raise notice 'debug: %, value:%', msg, some_int;
    RETURN true;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_active_tourney_id()
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    tourney_id int;
BEGIN
    SELECT "activeTourneyId" INTO tourney_id
    FROM app_state
    LIMIT 1;
    
    RETURN tourney_id;
END;
$function$
;

create policy "commissioners can delete from gd_user_map"
on "public"."gd_user_map"
as permissive
for delete
to public
using ((debug('active tourney'::text, get_active_tourney_id()) AND debug('is commissh'::text, is_commissioner_of(get_active_tourney_id())) AND is_commissioner_of(get_active_tourney_id())));


create policy "commissioners can insert into gd_user_map"
on "public"."gd_user_map"
as permissive
for insert
to public
with check (is_commissioner_of(get_active_tourney_id()));


create policy "commissioners can select all rows in gd_user_map"
on "public"."gd_user_map"
as permissive
for select
to public
using (is_commissioner_of(get_active_tourney_id()));



