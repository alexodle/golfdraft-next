BEGIN;

select plan(8);

select tests.create_test_tourney();
-- user 2 is commissioner

-- user 1
select tests.authenticate_as('sbuser1');

SELECT throws_ok(
    $$ INSERT INTO draft_settings ("tourneyId") VALUES (tests.get_tourney_id()) $$,
    'new row violates row-level security policy for table "draft_settings"',
    'Only commissioner should be able to create draft settings'
);

-- user 2 (commissioner)
select tests.authenticate_as('sbuser2');

SELECT lives_ok(
    $$ INSERT INTO draft_settings ("tourneyId") VALUES (tests.get_tourney_id()) $$,
    'Commissioner should be able to create draft settings'
);

SELECT results_eq(
    $$ UPDATE draft_settings SET "allowClock" = false RETURNING "allowClock" $$,
    ARRAY[false],
    'Commissioner should be able to update draft settings'
);

SELECT lives_ok(
    $$ 
        INSERT INTO draft_settings ("tourneyId", "draftHasStarted") 
        VALUES (tests.get_tourney_id(), true) 
        ON CONFLICT ("tourneyId") DO
        UPDATE SET "draftHasStarted" = true
    $$,
    'Commissioner should be able to upsert draft settings'
);

SELECT IS("draftHasStarted", true, 'Expected commissioner upsert to have applied change')
FROM draft_settings
WHERE "tourneyId" = tests.get_tourney_id();

SELECT throws_ok(
    $$ 
        INSERT INTO draft_settings ("tourneyId") 
        VALUES (tests.get_tourney_id())
    $$,
    'duplicate key value violates unique constraint "draft_settings_pkey"',
    'Expected primary key failure for duplicate entry'
);

-- user 1
select tests.authenticate_as('sbuser1');

SELECT is_empty(
    $$ 
        UPDATE draft_settings 
        SET "isDraftPaused" = true 
        WHERE "tourneyId" = tests.get_tourney_id()
        RETURNING "isDraftPaused"
    $$,
    'Only commissioner should be able to update draft settings'
);

SELECT IS("tourneyId", tests.get_tourney_id(), 'Expected all users to be able to view draft settings')
FROM draft_settings
WHERE "tourneyId" = tests.get_tourney_id();

select * from finish();

ROLLBACK;
