CREATE OR REPLACE FUNCTION get_user_mappings()
RETURNS TABLE ("userId" int, "profileId" uuid, "email" varchar)
SECURITY DEFINER
AS
$$
BEGIN
    IF NOT is_commissioner_of(get_active_tourney_id()) THEN
        RAISE EXCEPTION 'You are not the commissioner of the active tourney';
    END IF;

    RETURN QUERY
    SELECT gd_user_map."gdUserId" as "userId", auth.users.id AS "profileId", auth.users.email AS "email"
    FROM auth.users
    LEFT JOIN gd_user_map ON gd_user_map."profileId" = auth.users.id;
END;
$$
LANGUAGE plpgsql;
