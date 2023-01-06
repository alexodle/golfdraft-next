BEGIN;

select plan(5);

select tests.create_test_tourney();
select tests.authenticate_as('sbuser1');

SELECT throws_ok(
    $$ insert into chat_message ("tourneyId", "userId", "message") 
    values (
        tests.get_tourney_id(), tests.get_gd_user2(), 'test message sent by user2'
    ) $$,
    'new row violates row-level security policy for table "chat_message"',
    'should not be able to insert chat message for another user'
);

SELECT lives_ok(
    $$ insert into chat_message ("tourneyId", "userId", "message", "createdAt")
    values (
        tests.get_tourney_id(), tests.get_gd_user1(), 'test message sent by user1', 
        -- Should ignore timestamp and use current time
        '2000-01-01 01:00:00'::timestamp AT TIME ZONE 'America/Los_Angeles'
    ) $$,
    'should be able to post chat message for myself (user1)'
);

SELECT results_eq(
    $$ select "createdAt" from chat_message where "tourneyId" = tests.get_tourney_id() order by "createdAt" ASC $$,
    ARRAY[now()],
    'should ignore createdAt timestamp from client'
);

select tests.authenticate_as('sbuser2');

SELECT lives_ok(
    $$ insert into chat_message ("tourneyId", "userId", "message") 
    values (
        tests.get_tourney_id(), tests.get_gd_user2(), 'test message sent by user2'
    ) $$,
    'should be able to post chat message for myself (user2)'
);

SELECT results_eq(
    $$ select "userId" from chat_message where "tourneyId" = tests.get_tourney_id() order by "createdAt" ASC $$,
    ARRAY[tests.get_gd_user1(), tests.get_gd_user2()],
    'should be able to retrieve all chat messages'
);

select * from finish();

ROLLBACK;
