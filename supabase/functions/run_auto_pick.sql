CREATE OR REPLACE FUNCTION run_auto_pick(tourney_id INT)
RETURNS void
AS
$$
DECLARE
  next_pick_user_id int;
  next_pick_number int;
  tx varchar;
BEGIN
  SELECT pg_try_advisory_xact_lock(tourney_id) INTO tx;
  IF tx <> 'true' THEN
    RETURN;
  END IF;

  SELECT "userId", "pickNumber" INTO next_pick_user_id, next_pick_number
  FROM get_next_pick(tourney_id)
  WHERE "userId" IN (
    SELECT "userId"
    FROM draft_auto_pick
    WHERE "tourneyId" = tourney_id
  );
  
  IF next_pick_user_id IS NULL THEN
    raise exception 'next pick user is not set to auto pick';
  END IF;

  PERFORM make_pick_list_or_wgr_pick(tourney_id, next_pick_user_id, next_pick_number);

  RETURN;
END;
$$
LANGUAGE plpgsql;
