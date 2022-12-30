CREATE OR REPLACE function get_next_pick(tourney_id INT)
RETURNS draft_pick AS $$  
  SELECT *
  FROM draft_pick
  WHERE "tourneyId" = tourney_id AND "golferId" IS NULL
  ORDER BY "pickNumber" ASC
  LIMIT 1;
$$
language sql;
