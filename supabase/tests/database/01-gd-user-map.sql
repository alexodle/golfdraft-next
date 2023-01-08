BEGIN;

select plan(3);

select tests.create_test_tourney();
select tests.authenticate_as('sbuser1');

SELECT throws_ok(
    $$ insert into gd_user_map ("gdUserId", "profileId") 
    values (
        tests.get_gd_user1(), tests.get_supabase_uid('sbuser1')
    ) $$,
    'new row violates row-level security policy for table "gd_user_map"',
    'should not be able to insert into gd_user_map'
);

SELECT is_empty(
    $$ 
        update gd_user_map set "gdUserId" = tests.get_gd_user2()
        where "profileId" =  tests.get_supabase_uid('sbuser2')
        returning "profileId"
    $$,
    'should not be able to update gd_user_map'
);

SELECT results_eq(
    $$ select "gdUserId" from gd_user_map where "profileId" = tests.get_supabase_uid('sbuser1') $$,
    ARRAY[tests.get_gd_user1()],
    'should be able to select my own user mappings'
);

select * from finish();

ROLLBACK;
