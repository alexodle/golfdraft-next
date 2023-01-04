CREATE OR REPLACE FUNCTION is_user(user_id int)
RETURNS boolean
AS
$$
DECLARE
    current_user_id int;
BEGIN
    SELECT gd_user.id, gd_user.username INTO current_user_id
    FROM gd_user
    WHERE (gd_user."profileId" = auth.uid());
    
    RETURN user_id = current_user_id;
END;
$$
LANGUAGE plpgsql;
