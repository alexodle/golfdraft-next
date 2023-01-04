CREATE OR REPLACE FUNCTION set_pick_list(tourney_id int, golfer_ids text)
RETURNS void
AS
$$
DECLARE
    user_id int;
    golfer_ids_arr INT[];
BEGIN
    SELECT "id" INTO user_id
    FROM gd_user
    WHERE auth.uid() = "profileId"
    LIMIT 1;

    golfer_ids_arr := string_to_array(golfer_ids, ',')::INT[];

    DELETE FROM draft_pick_list WHERE "tourneyId" = tourney_id AND "userId" = user_id;

    IF golfer_ids_arr IS NOT NULL AND array_length(golfer_ids_arr, 1) > 0 THEN
        FOR i IN 1..array_length(golfer_ids_arr, 1) LOOP
            INSERT INTO draft_pick_list ("tourneyId", "userId", "golferId", "pickOrder")
            VALUES (tourney_id, user_id, golfer_ids_arr[i], i);
        END LOOP;
    END IF;

    RETURN;
END;
$$
LANGUAGE plpgsql;
