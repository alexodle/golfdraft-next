BEGIN;

select plan(2);

select tests.create_test_tourney();

select tests.authenticate_as('sbuser1'); -- not commissioner

SELECT throws_ok(
    $$ select * from get_user_mappings() $$,
    'You are not the commissioner of the active tourney',
    'only commissioners can call get_user_mappings'
);

select tests.authenticate_as('sbuser2'); -- commissioner

-- Insert new unmapped user (use 'zzzz' prefix to ensure it shows up last)
SELECT * INTO uuid1 FROM tests.create_supabase_user('zzzz_new_unmapped_user1', 'zzzz_new_unmapped_user1@golfpools.com');

SELECT results_eq(
    $$ select "userId", "profileId" from get_user_mappings() order by email asc $$,
    $$ VALUES 
        (tests.get_gd_user1(), tests.get_supabase_uid('sbuser1')),
        (tests.get_gd_user2(), tests.get_supabase_uid('sbuser2')),
        (tests.get_gd_user3(), tests.get_supabase_uid('sbuser3_dup')),
        (tests.get_gd_user3(), tests.get_supabase_uid('sbuser3')),
        (NULL, tests.get_supabase_uid('zzzz_new_unmapped_user1'))
    $$,
    'Expected to see all user mappings as commissioner'
);

select * from finish();

ROLLBACK;
