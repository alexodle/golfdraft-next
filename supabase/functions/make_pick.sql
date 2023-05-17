CREATE OR REPLACE FUNCTION make_pick(tourney_id INT, user_id INT, pick_number INT, golfer_id INT)
RETURNS void
SECURITY DEFINER
AS
$$
DECLARE
  next_pick_user_id int;
  next_pick_number int;
  already_picked_golfer_id int;
  picked_by_user_id int;
  pick_proxy_message varchar;
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

  SELECT get_user_id(auth.uid()) INTO picked_by_user_id;

  UPDATE draft_pick
  SET
    "golferId" = golfer_id,
    "pickedByUserId" = picked_by_user_id,
    "timestampEpochMillis" = extract(epoch from now()) * 1000,
    "clientTimestampEpochMillis" = extract(epoch from now()) * 1000
  WHERE
    "tourneyId" = tourney_id
    AND "pickNumber" = pick_number
    AND "userId" = user_id
    AND "golferId" IS NULL;

  pick_proxy_message = '';
  IF picked_by_user_id != user_id THEN
    SELECT ' (proxy by ' || "name" || ')' INTO pick_proxy_message
    FROM gd_user
    WHERE id = picked_by_user_id;
  END IF;

  INSERT INTO chat_message ("tourneyId", message)
  SELECT tourney_id, 'Pick #' || pick_number || ': ' || u.name || ' selects ' || g.name || pick_proxy_message
  FROM gd_user AS u, golfer AS g
  WHERE u.id = user_id AND g.id = golfer_id;
  
  RETURN;
END;
$$
LANGUAGE plpgsql;
