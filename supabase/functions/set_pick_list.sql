CREATE OR REPLACE FUNCTION set_pick_list(golfer_ids text)
RETURNS void
AS
$$
DECLARE
    arr INT[];
BEGIN
    arr := string_to_array(golfer_ids, ',')::INT[];

    DELETE FROM draft_pick_list WHERE "tourneyId" = tourney_id AND "userId" = user_id;
    IF arr IS NOT NULL AND array_length(arr, 1) > 0 THEN
        FOR i IN 1..array_length(arr, 1) LOOP
            INSERT INTO draft_pick_list ("tourneyId", "userId", "golferId", "pickOrder")
            VALUES (tourney_id, user_id, arr[i], i);
        END LOOP;
    END IF;

    RETURN;
END;
$$
LANGUAGE plpgsql;
