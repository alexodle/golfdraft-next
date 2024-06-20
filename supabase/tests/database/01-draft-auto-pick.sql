BEGIN;

select plan(10);

select tests.create_test_tourney();
select tests.authenticate_as('sbuser2');

-- prep
INSERT INTO draft_auto_pick ("tourneyId", "userId") VALUES 
    (tests.get_tourney_id(), tests.get_gd_user1()),
    (tests.get_tourney_id(), tests.get_gd_user2());
INSERT INTO draft_pick_list ("tourneyId", "userId", "golferId", "pickOrder") VALUES 
    (tests.get_tourney_id(), tests.get_gd_user2(), tests.get_golfer_id('Sungjae Im'), 1);

SELECT lives_ok(
    $$ SELECT run_auto_pick(tests.get_tourney_id()) $$,
    'should be able to run auto pick when user is set to auto pick'
);

SELECT results_eq(
    $$ SELECT "userId" FROM draft_pick WHERE "tourneyId" = tests.get_tourney_id() AND "pickNumber" = 1 $$,
    ARRAY[tests.get_gd_user1()],
    'should be able to make pick for correct user and pick number'
);

SELECT IS("pickedByUserId", null, 'auto pick should have NULL pickedByUser')
FROM draft_pick WHERE "tourneyId" = tests.get_tourney_id() AND "pickNumber" = 1;

SELECT results_eq(
    $$ SELECT "golferId" FROM draft_pick WHERE "tourneyId" = tests.get_tourney_id() AND "pickNumber" = 1 $$,
    $$ SELECT id FROM golfer WHERE "tourneyId" = tests.get_tourney_id() AND "wgr" = 17 $$,
    'auto pick should pick 7th best wgr if no pick list'
);

SELECT results_eq(
    $$ SELECT "message" FROM chat_message WHERE "tourneyId" = tests.get_tourney_id() $$,
    $$ SELECT 'Pick #1: User One selects ' || "name" || ' (WGR+7)' FROM  golfer WHERE "tourneyId" = tests.get_tourney_id() AND "wgr" = 17 $$,
    'expected chat message for new pick'
);

-- pick 2 should be from pick list

SELECT lives_ok(
    $$ SELECT run_auto_pick(tests.get_tourney_id()) $$,
    'should be able to run auto pick when user is set to auto pick'
);

SELECT results_eq(
    $$ SELECT "userId" FROM draft_pick WHERE "tourneyId" = tests.get_tourney_id() AND "pickNumber" = 2 $$,
    ARRAY[tests.get_gd_user2()],
    'should be able to make pick for correct user and pick number'
);

SELECT results_eq(
    $$ SELECT "golferId" FROM draft_pick WHERE "tourneyId" = tests.get_tourney_id() AND "pickNumber" = 2 $$,
    ARRAY[tests.get_golfer_id('Sungjae Im')],
    'auto pick should pick 7th best wgr if no pick list'
);

SELECT results_eq(
    $$ SELECT "message" FROM chat_message WHERE "tourneyId" = tests.get_tourney_id() ORDER BY id desc LIMIT 1 $$,
    $$ SELECT 'Pick #2: User Two selects Sungjae Im (Pick List)' $$,
    'expected chat message for new pick'
);

-- pick 3 should be fail (not an auto-pick user)

SELECT throws_ok(
    $$ SELECT run_auto_pick(tests.get_tourney_id()) $$,
    'next pick user is not set to auto pick'
);

select * from finish();

ROLLBACK;
