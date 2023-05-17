BEGIN;

select plan(11);

select tests.create_test_tourney();
select tests.authenticate_as('sbuser2');

SELECT throws_ok(
    $$ SELECT make_pick(tests.get_tourney_id(), tests.get_gd_user1(), 2, tests.get_golfer_id('Tiger Woods')) $$,
    'Invalid pick number: 2, expected 1',
    'should not be able to make pick for wrong pick number'
);

SELECT throws_ok(
    $$ SELECT make_pick(tests.get_tourney_id(), tests.get_gd_user2(), 1, tests.get_golfer_id('Tiger Woods')) $$,
    NULL,
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

SELECT results_eq(
    $$ SELECT "message" FROM chat_message WHERE "tourneyId" = tests.get_tourney_id() ORDER BY id desc LIMIT 1 $$,
    $$ SELECT 'Pick #1: User One selects Rory McIlroy (proxy by User Two)' $$,
    'expected chat message for new pick'
);

SELECT throws_ok(
    $$ SELECT make_pick(tests.get_tourney_id(), tests.get_gd_user1(), 1, tests.get_golfer_id('Tiger Woods')) $$,
    NULL,
    'Should not be able to make pick that has already been made'
);

SELECT throws_ok(
    $$ SELECT make_pick(tests.get_tourney_id(), tests.get_gd_user2(), 2, tests.get_golfer_id('Rory McIlroy')) $$,
    'duplicate key value violates unique constraint "draft_pick_tourneyId_golferId_idx"',
    'Cannot pick golfer that has already been picked'
);

SELECT lives_ok(
    $$ SELECT make_pick(tests.get_tourney_id(), tests.get_gd_user2(), 2, tests.get_golfer_id('Tiger Woods')) $$,
    'should be able to make pick for correct user and pick number'
);

SELECT results_eq(
    $$ SELECT "message" FROM chat_message WHERE "tourneyId" = tests.get_tourney_id() ORDER BY id desc LIMIT 1 $$,
    $$ SELECT 'Pick #2: User Two selects Tiger Woods' $$,
    'expected chat message for new pick'
);

select * from finish();

ROLLBACK;
