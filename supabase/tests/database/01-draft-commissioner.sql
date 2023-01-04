BEGIN;

select plan(8);

select tests.create_test_tourney();
select tests.authenticate_as('sbuser1');

INSERT INTO commissioners ("tourneyId", "userId") VALUES
    (tests.get_tourney_id(), tests.get_gd_user2());

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

select * from finish();

ROLLBACK;
