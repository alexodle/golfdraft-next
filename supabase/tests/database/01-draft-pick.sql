BEGIN;

select plan(8);

select tests.create_test_tourney();
select tests.authenticate_as('sbuser2');

SELECT throws_ok(
    $$ SELECT make_pick(tests.get_tourney_id(), tests.get_gd_user1(), 2, tests.get_golfer_id('Tiger Woods')) $$,
    'Invalid user or pick_number',
    'should not be able to make pick for wrong pick number'
);

SELECT throws_ok(
    $$ SELECT make_pick(tests.get_tourney_id(), tests.get_gd_user2(), 1, tests.get_golfer_id('Tiger Woods')) $$,
    'Invalid user or pick_number',
    'should not be able to make pick for wrong user'
);

SELECT lives_ok(
    $$ SELECT make_pick(tests.get_tourney_id(), tests.get_gd_user1(), 1, tests.get_golfer_id('Rory McIlroy')) $$,
    'should be able to make pick for correct user and pick number'
);

SELECT results_eq(
    $$ SELECT "userId" FROM draft_pick WHERE "tourneyId" = tests.get_tourney_id() AND "pickNumber" = 1 $$,
    ARRAY[tests.get_gd_user1()],
    'should be able to make pick for correct user and pick number'
);

SELECT results_eq(
    $$ SELECT "pickedByUserId" FROM draft_pick WHERE "tourneyId" = tests.get_tourney_id() AND "pickNumber" = 1 $$,
    ARRAY[tests.get_gd_user2()],
    'proxy pick should show correct user'
);

SELECT IS(
    "golferId",
    tests.get_golfer_id('Rory McIlroy'),
    'should have picked exact golfer'
) FROM draft_pick WHERE "tourneyId" = tests.get_tourney_id() AND "pickNumber" = 1;

SELECT throws_ok(
    $$ SELECT make_pick(tests.get_tourney_id(), tests.get_gd_user1(), 1, tests.get_golfer_id('Tiger Woods')) $$,
    'Invalid user or pick_number',
    'Should not be able to make pick that has already been made'
);

SELECT throws_ok(
    $$ SELECT make_pick(tests.get_tourney_id(), tests.get_gd_user2(), 2, tests.get_golfer_id('Rory McIlroy')) $$,
    'duplicate key value violates unique constraint "draft_pick_tourneyId_golferId_idx"',
    'Cannot pick golfer that has already been picked'
);

select * from finish();

ROLLBACK;
