BEGIN;

select plan(10);

select tests.create_test_tourney();
select tests.authenticate_as('sbuser2');

SELECT throws_ok(
    $$ SELECT make_pick_list_or_wgr_pick(tests.get_tourney_id(), tests.get_gd_user1(), 2) $$,
    'Invalid pick number: 2, expected 1',
    'should not be able to make pick for wrong pick number'
);

SELECT throws_ok(
    $$ SELECT make_pick_list_or_wgr_pick(tests.get_tourney_id(), tests.get_gd_user2(), 1) $$,
    NULL,
    'should not be able to make pick for wrong user'
);

SELECT lives_ok(
    $$ SELECT make_pick_list_or_wgr_pick(tests.get_tourney_id(), tests.get_gd_user1(), 1) $$,
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

SELECT results_eq(
    $$ SELECT "golferId" FROM draft_pick WHERE "tourneyId" = tests.get_tourney_id() AND "pickNumber" = 1 $$,
    $$ SELECT "id" FROM golfer WHERE "tourneyId" = tests.get_tourney_id() AND "wgr" = 7 $$,
    'proxy pick should pick 7th best wgr'
);

SELECT throws_ok(
    $$ SELECT make_pick_list_or_wgr_pick(tests.get_tourney_id(), tests.get_gd_user1(), 1) $$,
    NULL,
    'should not be able to make pick that has already been made'
);

SELECT IS(
    get_next_pick(tests.get_tourney_id()),
    ROW(tests.get_tourney_id(), 2, tests.get_gd_user2(), NULL, NULL, NULL, NULL)::draft_pick,
    'expected second pick for get_next_pick'
);

SELECT lives_ok(
    $$ SELECT make_pick_list_or_wgr_pick(tests.get_tourney_id(), tests.get_gd_user2(), 2) $$,
    'should be able to make pick for correct user and pick number'
);

SELECT results_eq(
    $$ SELECT "golferId" FROM draft_pick WHERE "tourneyId" = tests.get_tourney_id() AND "pickNumber" = 2 $$,
    $$ SELECT "id" FROM golfer WHERE "tourneyId" = tests.get_tourney_id() AND "wgr" = 8 $$,
    'proxy pick should pick 7th best wgr available'
);

select * from finish();

ROLLBACK;
