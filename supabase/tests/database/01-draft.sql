BEGIN;

select plan(1);

-- ensure you're anon
select tests.clear_authentication();
select tests.create_test_tourney();

SELECT
    throws_ok(
            $$ insert into draft_pick ("tourneyId", "pickNumber", "userId", "golferId", "timestampEpochMillis", "clientTimestampEpochMillis") 
                values (
                    tests.get_tourney_id(), 10, tests.get_gd_user1(), tests.get_golfer_id('Tiger Woods'), 1620000000000, 1620000000000
                ) $$,
            'new row violates row-level security policy for table "draft_pick"'
        );

select * from finish();

ROLLBACK;