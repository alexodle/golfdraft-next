set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_user_mappings()
 RETURNS TABLE("userId" integer, "profileId" uuid, email character varying)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    IF NOT is_commissioner_of(get_active_tourney_id()) THEN
        RAISE EXCEPTION 'You are not the commissioner of the active tourney';
    END IF;

    RETURN QUERY
    SELECT gd_user."id" as "userId", gd_user."profileId" AS "profileId", auth.users.email AS "email"
    FROM gd_user
    JOIN auth.users ON auth.users.id = gd_user."profileId";
END;
$function$
;


