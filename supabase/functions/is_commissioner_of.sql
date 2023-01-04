CREATE OR REPLACE FUNCTION is_commissioner_of(tourney_id int)
RETURNS boolean
AS
$$
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
$$
LANGUAGE plpgsql;
