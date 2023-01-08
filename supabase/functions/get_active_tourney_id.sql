CREATE OR REPLACE FUNCTION get_active_tourney_id()
RETURNS int
SECURITY DEFINER
AS
$$
DECLARE
    tourney_id int;
BEGIN
    SELECT "activeTourneyId" INTO tourney_id
    FROM app_state
    LIMIT 1;
    
    RETURN tourney_id;
END;
$$
LANGUAGE plpgsql;
