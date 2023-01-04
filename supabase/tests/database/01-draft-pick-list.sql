BEGIN;

select plan(6);

select tests.create_test_tourney();
select tests.authenticate_as('sbuser2');

-- prep
select tests.authenticate_as('sbuser1');
INSERT INTO draft_pick_list ("tourneyId", "userId", "golferId", "pickOrder") VALUES 
    (tests.get_tourney_id(), tests.get_gd_user1(), tests.get_golfer_id('Sungjae Im'), 1);
select tests.authenticate_as('sbuser2');
INSERT INTO draft_pick_list ("tourneyId", "userId", "golferId", "pickOrder") VALUES 
    (tests.get_tourney_id(), tests.get_gd_user2(), tests.get_golfer_id('Sungjae Im'), 1),
    (tests.get_tourney_id(), tests.get_gd_user2(), tests.get_golfer_id('Adam Scott'), 2);

select tests.authenticate_as('sbuser2');

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
    ARRAY[tests.get_golfer_id('Sungjae Im')],
    'proxy pick should pick pick list golfer'
);

-- ensure we pick the next golfer available (Sungjae is taken, so take Adam Scott)

SELECT lives_ok(
    $$ SELECT make_pick_list_or_wgr_pick(tests.get_tourney_id(), tests.get_gd_user2(), 2) $$,
    'should be able to make pick for correct user and pick number'
);

SELECT results_eq(
    $$ SELECT "golferId" FROM draft_pick WHERE "tourneyId" = tests.get_tourney_id() AND "pickNumber" = 2 $$,
    ARRAY[tests.get_golfer_id('Adam Scott')],
    'proxy pick should pick pick list golfer'
);

select * from finish();

ROLLBACK;
