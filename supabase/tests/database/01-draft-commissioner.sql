BEGIN;

select plan(16);

select tests.create_test_tourney();
select tests.authenticate_as('sbuser1');

-- user2 is commissioner

-- UNDO PICK TESTS

SELECT throws_ok(
    $$ SELECT undo_last_pick(tests.get_tourney_id()) $$,
    'Only the commissioner can undo the last pick',
    'should not be able to undo pick if not a commissioner'
);

select tests.authenticate_as('sbuser2');

-- expect noop
SELECT throws_ok(
    $$ SELECT undo_last_pick(tests.get_tourney_id()) $$,
    'No picks have been made yet',
    'should throw if no picks have been made yet'
);

SELECT IS("pickNumber", 1, 'expected noop from undoing last pick when no pick has been made. pickNumber is not 1') 
FROM get_next_pick(tests.get_tourney_id());

SELECT results_eq(
    $$ SELECT "message" FROM chat_message WHERE "tourneyId" = tests.get_tourney_id() $$,
    ARRAY[]::varchar[],
    'expected no chat messages for noop'
);

-- make pick
SELECT lives_ok(
    $$ SELECT make_pick_list_or_wgr_pick(tests.get_tourney_id(), tests.get_gd_user1(), 1) $$,
    'should be able to make pick for correct user and pick number'
);

-- sanity check
SELECT IS("pickNumber", 2, 'sanity check. expected one pick to have been made. pickNumber is not 2') 
FROM get_next_pick(tests.get_tourney_id());

-- undo pick
SELECT lives_ok(
    $$ SELECT undo_last_pick(tests.get_tourney_id()) $$,
    'should be able to undo pick if a commissioner'
);

SELECT IS("pickNumber", 1, 'expected pick to be undone. pickNumber is not 1') 
FROM get_next_pick(tests.get_tourney_id());

SELECT IS("golferId", NULL, 'expected pick to be undone. golferId is not NULL')
FROM get_next_pick(tests.get_tourney_id());

SELECT results_eq(
    $$ SELECT "message" FROM chat_message WHERE "tourneyId" = tests.get_tourney_id() ORDER BY id desc LIMIT 1 $$,
    $$ SELECT 'Pick #1: rolled back by commissioner' $$,
    'expected chat message for undo pick'
);

-- AUTO PICK USERS TESTS

select tests.authenticate_as('sbuser1');

SELECT throws_ok(
    $$ INSERT INTO draft_auto_pick ("tourneyId", "userId") VALUES (
        tests.get_tourney_id(), tests.get_gd_user1()
    ) $$,
    'new row violates row-level security policy for table "draft_auto_pick"',
    'only the commissioner can update draft_auto_pick table'
);

select tests.authenticate_as('sbuser2');

SELECT lives_ok(
    $$ INSERT INTO draft_auto_pick ("tourneyId", "userId") VALUES (
        tests.get_tourney_id(), tests.get_gd_user1()
    ) $$,
    'commissioner should be able to update auto pick table'
);

SELECT throws_ok(
    $$ INSERT INTO draft_auto_pick ("tourneyId", "userId") VALUES (
        tests.get_dummy_tourney_id(), tests.get_gd_user1()
    ) $$,
    'new row violates row-level security policy for table "draft_auto_pick"',
    'commissioner is only valid for a specific tourney'
);

select tests.authenticate_as('sbuser1');

SELECT results_eq(
    $$ SELECT "userId" FROM draft_auto_pick WHERE "tourneyId" = tests.get_tourney_id() $$,
    ARRAY[tests.get_gd_user1()],
    'any authenticated user should be able to select from auto pick table'
);

SELECT is_empty(
    $$ DELETE FROM draft_auto_pick WHERE "tourneyId" = tests.get_tourney_id() AND "userId" = tests.get_gd_user1() returning 1 $$,
    'only the commissioner can delete from draft_auto_pick table'
);

select tests.authenticate_as('sbuser2');

SELECT results_eq(
    $$ DELETE FROM draft_auto_pick WHERE "tourneyId" = tests.get_tourney_id() AND "userId" = tests.get_gd_user1() returning 1 $$,
    ARRAY[1],
    'commissioner should be able to delete from auto pick table'
);

select * from finish();

ROLLBACK;
