BEGIN;

select plan(2);

select tests.create_test_tourney();

-- Insert new unmapped user (use 'zzzz' prefix to ensure it shows up last)
SELECT tests.create_supabase_user('zzzz_new_unmapped_user1', 'zzzz_new_unmapped_user1@golfpools.com');

select tests.authenticate_as('sbuser1'); -- not commissioner

SELECT throws_ok(
    $$ select * from get_user_mappings() $$,
    'You are not the commissioner of the active tourney',
    'only commissioners can call get_user_mappings'
);

select tests.authenticate_as('sbuser2'); -- commissioner

SELECT results_eq(
    $$ select email from get_user_mappings() where "userId" IS NULL order by email asc $$,
    ARRAY[
        'zzzz_new_unmapped_user1@golfpools.com'
    ]::varchar[],
    'You are dumb'
);

select * from finish();

ROLLBACK;
