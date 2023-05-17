CREATE OR REPLACE FUNCTION undo_last_pick(tourney_id integer)
RETURNS void
SECURITY DEFINER
AS
$$
DECLARE
    commissioner_user_id int;
    last_pick_number int;
    tx varchar;
BEGIN
    IF NOT is_commissioner_of(tourney_id) THEN
        raise exception 'Only the commissioner can undo the last pick';
    END IF;

    SELECT pg_try_advisory_xact_lock(tourney_id) INTO tx;
    IF tx <> 'true' THEN
        RETURN;
    END IF;

    SELECT "pickNumber" INTO last_pick_number
    FROM draft_pick
    WHERE "tourneyId" = tourney_id AND "golferId" IS NOT NULL
    ORDER BY "pickNumber" DESC
    LIMIT 1;

    IF last_pick_number IS NULL THEN
        raise exception 'No picks have been made yet';
    END IF;
    
    UPDATE draft_pick 
    SET 
        "golferId" = NULL, 
        "timestampEpochMillis" = NULL, 
        "clientTimestampEpochMillis" = NULL, 
        "pickedByUserId" = NULL
    WHERE "tourneyId" = tourney_id AND "pickNumber" = last_pick_number;

    INSERT INTO chat_message ("tourneyId", message)
    VALUES (
        tourney_id,
        'Pick #' || last_pick_number || ': rolled back by commissioner'
    );

    RETURN;
END;
$$
LANGUAGE plpgsql;
