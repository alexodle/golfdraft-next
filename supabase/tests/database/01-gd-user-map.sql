BEGIN;

select plan(8);

select tests.create_test_tourney();
select tests.authenticate_as('sbuser1');

SELECT throws_ok(
    $$ insert into gd_user_map ("gdUserId", "profileId") 
    values (
        tests.get_gd_user1(), tests.get_supabase_uid('sbuser1')
    ) $$,
    'new row violates row-level security policy for table "gd_user_map"',
    'only commissioners should be able to insert into gd_user_map'
);

SELECT is_empty(
    $$ delete from gd_user_map where "profileId" = tests.get_supabase_uid('sbuser1') returning 1 $$,
    'only commissioner should be able to delete from gd_user_map'
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
    'users should be able to select their own user mappings'
);

select tests.authenticate_as('sbuser2'); -- commissioner

SELECT results_eq(
    $$ SELECT CAST(COUNT(*) AS INT) FROM gd_user_map LIMIT 4 $$,
    ARRAY[4],
    'commissioners should be able to see all rows in gd_user_map'
);

SELECT results_eq(
    $$ delete from gd_user_map where "profileId" = tests.get_supabase_uid('sbuser1') returning 1 $$,
    ARRAY[1],
    'commissioners should be able to delete from gd_user_map'
);

SELECT lives_ok(
    $$ insert into gd_user_map ("gdUserId", "profileId") 
    values (
        tests.get_gd_user1(), tests.get_supabase_uid('sbuser1')
    ) $$,
    'commissioners should be able to insert into gd_user_map'
);

SELECT throws_ok(
    $$ insert into gd_user_map ("gdUserId", "profileId") 
    values (
        tests.get_gd_user2(), tests.get_supabase_uid('sbuser1')
    ) $$,
    'duplicate key value violates unique constraint "gd_user_map_pkey"',
    'only one entry per profileId should be allowed'
);

select * from finish();

ROLLBACK;
