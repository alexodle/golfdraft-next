BEGIN;

select plan(7);

select tests.create_test_tourney();

-- user 1
select tests.authenticate_as('sbuser1');

SELECT lives_ok(
    $$ SELECT set_pick_list(tests.get_tourney_id(), 
        CONCAT_WS(',', 
            tests.get_golfer_id('Adam Scott'),
            tests.get_golfer_id('Viktor Hovland')
        ))
    $$,
    'Should be able to insert into our own pick list using set_pick_list'
);

SELECT lives_ok(
    $$ INSERT INTO draft_pick_list ("tourneyId", "userId", "golferId", "pickOrder") VALUES 
        (tests.get_tourney_id(), tests.get_gd_user1(), tests.get_golfer_id('Hideki Matsuyama'), 3)
    $$,
    'Should be able to insert into our own pick list'
);

SELECT results_eq(
    $$ SELECT "golferId" FROM draft_pick_list WHERE "tourneyId" = tests.get_tourney_id() AND "userId" = tests.get_gd_user1() ORDER BY "pickOrder" ASC $$,
    ARRAY[tests.get_golfer_id('Adam Scott'), tests.get_golfer_id('Viktor Hovland'), tests.get_golfer_id('Hideki Matsuyama')],
    'Should be able to select from our own pick list'
);

SELECT throws_ok(
    $$ INSERT INTO draft_pick_list ("tourneyId", "userId", "golferId", "pickOrder") VALUES 
        (tests.get_tourney_id(), tests.get_gd_user2(), tests.get_golfer_id('Tiger Woods'), 1)
    $$,
    'new row violates row-level security policy for table "draft_pick_list"',
    'Should not be able to insert into other pick lists'
);

-- user 2
select tests.authenticate_as('sbuser2');

SELECT lives_ok(
    $$ SELECT set_pick_list(tests.get_tourney_id(), 
        CONCAT_WS(',', 
            tests.get_golfer_id('Patrick Cantlay'),
            tests.get_golfer_id('Brooks Koepka')
        )) 
    $$,
    'Should be able to insert into our own pick list using set_pick_list'
);

SELECT is_empty(
    $$ SELECT "golferId" FROM draft_pick_list WHERE "tourneyId" = tests.get_tourney_id() AND "userId" = tests.get_gd_user1() $$,
    'Should not be able to select from other pick lists'
);

-- pick list user view

SELECT results_eq(
    $$ SELECT "userId" FROM pick_list_user WHERE "tourneyId" = tests.get_tourney_id() $$,
    ARRAY[tests.get_gd_user1(), tests.get_gd_user2()],
    'Anyone should be able to select from pick_list_user'
);

select * from finish();

ROLLBACK;
