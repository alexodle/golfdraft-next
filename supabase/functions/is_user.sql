CREATE OR REPLACE FUNCTION is_user(user_id int)
RETURNS boolean
SECURITY DEFINER
AS
$$
DECLARE
    current_user_id int;
BEGIN
    SELECT get_user_id(auth.uid()) INTO current_user_id;
    
    RETURN user_id = current_user_id;
END;
$$
LANGUAGE plpgsql;
