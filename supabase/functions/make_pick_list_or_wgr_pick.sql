CREATE OR REPLACE FUNCTION make_pick_list_or_wgr_pick(tourney_id INT, user_id INT, pick_number INT)
RETURNS void
SECURITY DEFINER
AS
$$
DECLARE
  next_pick_user_id int;
  next_pick_number int;
  pick_list_golfer_id int;
  wgr_golfer_id int;
  golfer_to_pick_id int;
  picked_by_user_id int;
  auto_pick_user_id int;
  picked_via varchar;
  tx varchar;
BEGIN
  SELECT pg_try_advisory_xact_lock(tourney_id) INTO tx;
  IF tx <> 'true' THEN
    RETURN;
  END IF;

  -- Validate is current pick
  SELECT "userId", "pickNumber" INTO next_pick_user_id, next_pick_number
  FROM get_next_pick(tourney_id);
  IF next_pick_user_id <> user_id THEN
    raise exception 'Invalid user: %, expected %', user_id, next_pick_user_id;
  END IF;
  IF next_pick_number <> pick_number THEN
    raise exception 'Invalid pick number: %, expected %', pick_number, next_pick_number;
  END IF;

  SELECT "golferId" INTO pick_list_golfer_id
  FROM draft_pick_list
  WHERE "tourneyId" = tourney_id AND "userId" = user_id AND "golferId" NOT IN (
    SELECT "golferId"
    FROM draft_pick
    WHERE "tourneyId" = tourney_id AND "golferId" IS NOT NULL
  )
  ORDER BY "pickOrder" ASC
  LIMIT 1;

  SELECT "id" INTO wgr_golfer_id FROM (
    SELECT "id", "wgr"
    FROM golfer
    WHERE "tourneyId" = tourney_id AND "id" NOT IN (
      SELECT "golferId"
      FROM draft_pick
      WHERE "tourneyId" = tourney_id AND "golferId" IS NOT NULL
    )
    ORDER BY wgr ASC
    LIMIT 7 -- TODO configurable
  ) as next_golfers
  ORDER BY wgr DESC
  LIMIT 1;

  IF pick_list_golfer_id IS NOT NULL THEN
    golfer_to_pick_id := pick_list_golfer_id;
    picked_via = 'Pick List';
  ELSE
    golfer_to_pick_id := wgr_golfer_id;
    picked_via = 'WGR+7';
  END IF;
  IF golfer_to_pick_id IS NULL THEN
     raise exception 'No golfer found for auto pick';
  END IF;

  SELECT "userId" INTO auto_pick_user_id
  FROM draft_auto_pick
  WHERE "tourneyId" = tourney_id AND "userId" = user_id;

  IF auto_pick_user_id IS NULL THEN
    SELECT get_user_id(auth.uid()) INTO picked_by_user_id;
  END IF;

  UPDATE draft_pick
  SET
    "golferId" = golfer_to_pick_id,
    "pickedByUserId" = picked_by_user_id,
    "timestampEpochMillis" = extract(epoch from now()) * 1000,
    "clientTimestampEpochMillis" = extract(epoch from now()) * 1000
  WHERE
    "tourneyId" = tourney_id
    AND "pickNumber" = pick_number
    AND "userId" = user_id
    AND "golferId" IS NULL;
  
  INSERT INTO chat_message ("tourneyId", message)
  SELECT tourney_id, 'Pick #' || pick_number || ': ' || u.name || ' selects ' || g.name || ' (' || picked_via || ')'
  FROM gd_user AS u, golfer AS g
  WHERE u.id = user_id AND g.id = golfer_to_pick_id;
  
  RETURN;
END;
$$
LANGUAGE plpgsql;
