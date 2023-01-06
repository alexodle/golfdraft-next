CREATE OR REPLACE FUNCTION is_commissioner_of(tourney_id int)
RETURNS boolean
SECURITY DEFINER
AS
$$
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
$$
LANGUAGE plpgsql;
