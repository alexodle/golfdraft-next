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
    SELECT gd_user_map."gdUserId" as "userId", auth.users.id AS "profileId", auth.users.email AS "email"
    FROM auth.users
    LEFT JOIN gd_user_map ON gd_user_map."profileId" = auth.users.id
    WHERE confirmed_at IS NOT NULL;
END;
$function$
;


