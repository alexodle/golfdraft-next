BEGIN;

select plan(4);

select tests.create_test_tourney();
select tests.authenticate_as('sbuser1');

SELECT throws_ok(
    $$ insert into draft_pick ("tourneyId", "pickNumber", "userId", "golferId", "timestampEpochMillis", "clientTimestampEpochMillis") 
    values (
        tests.get_tourney_id(), 10, tests.get_gd_user1(), tests.get_golfer_id('Tiger Woods'), 1620000000000, 1620000000000
    ) $$,
    'new row violates row-level security policy for table "draft_pick"',
    'should not be able to insert draft pick'
);

SELECT is_empty(
    $$ 
        update draft_pick set 
            "golferId" = tests.get_golfer_id('Tiger Woods'),
            "timestampEpochMillis" = 1620000000000,
            "clientTimestampEpochMillis" = 1620000000000,
            "pickedByUserId" = tests.get_gd_user1()
        where 
            "tourneyId" = tests.get_tourney_id()
            and "pickNumber" = 1
        returning "golferId"
    $$,
    'should not be able to update draft pick'
);

SELECT IS(
    COUNT(*), 
    CAST(6 AS BIGINT),
    'should be able to select draft picks'
) FROM draft_pick WHERE "tourneyId" = tests.get_tourney_id();

SELECT IS(
    get_next_pick(tests.get_tourney_id()),
    ROW(tests.get_tourney_id(), 1, tests.get_gd_user1(), NULL, NULL, NULL, NULL)::draft_pick,
    'expected first pick for get_next_pick'
);

select * from finish();

ROLLBACK;
