CREATE OR REPLACE FUNCTION get_user_id(profile_id uuid)
RETURNS int
SECURITY DEFINER
AS
$$
DECLARE
    user_id int;
BEGIN
    SELECT "gdUserId" INTO user_id
    FROM gd_user_map
    WHERE "profileId" = profile_id
    LIMIT 1;
    
    RETURN user_id;
END;
$$
LANGUAGE plpgsql;
