CREATE OR REPLACE FUNCTION tests.create_test_tourney()
RETURNS void
    SECURITY DEFINER
AS $$
DECLARE
    tourney_id int;
    dummy_tourney_id int;
    uuid1 uuid;
    uuid2 uuid;
    uuid3 uuid;
    uuid3dup uuid;
BEGIN
    -- tourney
    INSERT INTO tourney ("name", "startDateEpochMillis", "lastUpdatedEpochMillis", "config")
    VALUES ('Test Tourney', 1620000000000, 1620000000000, '{}') RETURNING id INTO tourney_id;

    -- dummy tourney to test negative rls cases
    INSERT INTO tourney ("name", "startDateEpochMillis", "lastUpdatedEpochMillis", "config")
    VALUES ('Dummy Tourney', 1620000000000, 1620000000000, '{}') RETURNING id INTO dummy_tourney_id;

    -- users
    SELECT * INTO uuid1 FROM tests.create_supabase_user('sbuser1');
    SELECT * INTO uuid2 FROM tests.create_supabase_user('sbuser2');
    SELECT * INTO uuid3 FROM tests.create_supabase_user('sbuser3');
    SELECT * INTO uuid3dup FROM tests.create_supabase_user('sbuser3_dup');
    INSERT INTO gd_user ("name", "username") VALUES
        ('User One', 'user1'),
        ('User Two', 'user2'),
        ('User Three', 'user3');
    INSERT INTO gd_user_map ("gdUserId", "profileId") VALUES
        (tests.get_gd_user1(), uuid1),
        (tests.get_gd_user2(), uuid2),
        (tests.get_gd_user3(), uuid3),
        (tests.get_gd_user3(), uuid3dup);

    -- commissioners
    INSERT INTO commissioners ("tourneyId", "userId") VALUES
        (tests.get_tourney_id(), tests.get_gd_user2());

    -- draft_picks
    INSERT INTO draft_pick ("tourneyId", "pickNumber", "userId") VALUES
        (tourney_id, 1, tests.get_gd_user1()),
        (tourney_id, 2, tests.get_gd_user2()),
        (tourney_id, 3, tests.get_gd_user3()),
        (tourney_id, 6, tests.get_gd_user3()),
        (tourney_id, 7, tests.get_gd_user2()),
        (tourney_id, 8, tests.get_gd_user1());

    -- golfers
    INSERT INTO golfer ("tourneyId", "name", "wgr") VALUES 
        (tourney_id, 'Tiger Woods', 1),
        (tourney_id, 'Rory McIlroy', 2),
        (tourney_id, 'Jon Rahm', 3),
        (tourney_id, 'Justin Thomas', 4),
        (tourney_id, 'Brooks Koepka', 5),
        (tourney_id, 'Dustin Johnson', 6),
        (tourney_id, 'Xander Schauffele', 7),
        (tourney_id, 'Patrick Cantlay', 8),
        (tourney_id, 'Collin Morikawa', 9),
        (tourney_id, 'Webb Simpson', 10),
        (tourney_id, 'Hideki Matsuyama', 11),
        (tourney_id, 'Bryson DeChambeau', 12),
        (tourney_id, 'Viktor Hovland', 13),
        (tourney_id, 'Matthew Wolff', 14),
        (tourney_id, 'Patrick Reed', 15),
        (tourney_id, 'Tony Finau', 16),
        (tourney_id, 'Louis Oosthuizen', 17),
        (tourney_id, 'Adam Scott', 18),
        (tourney_id, 'Marc Leishman', 19),
        (tourney_id, 'Sungjae Im', 20),
        (tourney_id, 'Cameron Smith', NULL),
        (tourney_id, 'Paul Casey', NULL);

    RETURN;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION tests.get_tourney_id()
RETURNS int
SECURITY DEFINER
AS $$
    DECLARE
        tourney_id int;
    BEGIN
        SELECT id into tourney_id FROM tourney WHERE "name" = 'Test Tourney' limit 1;
        if tourney_id is null then
            RAISE EXCEPTION 'Tourney not found';
        end if;
        RETURN tourney_id;
    END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION tests.get_dummy_tourney_id()
RETURNS int
SECURITY DEFINER
AS $$
    DECLARE
        tourney_id int;
    BEGIN
        SELECT id into tourney_id FROM tourney WHERE "name" = 'Dummy Tourney' limit 1;
        if tourney_id is null then
            RAISE EXCEPTION 'Tourney not found';
        end if;
        RETURN tourney_id;
    END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION tests.get_gd_user_id(user_name text)
RETURNS int
SECURITY DEFINER
AS $$
    DECLARE
        user_id int;
    BEGIN
        SELECT id into user_id FROM gd_user WHERE gd_user.username = user_name limit 1;
        if user_id is null then
            RAISE EXCEPTION 'User with user_name % not found', user_name;
        end if;
        RETURN user_id;
    END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION tests.get_gd_user1()
RETURNS int
SECURITY DEFINER
AS $$
    BEGIN
        RETURN tests.get_gd_user_id('user1');
    END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION tests.get_gd_user2()
RETURNS int
SECURITY DEFINER
AS $$
    BEGIN
        RETURN tests.get_gd_user_id('user2');
    END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION tests.get_gd_user3()
RETURNS int
SECURITY DEFINER
AS $$
    BEGIN
        RETURN tests.get_gd_user_id('user3');
    END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION tests.get_golfer_id(gname text)
RETURNS int
SECURITY DEFINER
AS $$
    DECLARE
        golfer_id int;
    BEGIN
        SELECT id into golfer_id FROM golfer WHERE golfer.name = gname limit 1;
        if golfer_id is null then
            RAISE EXCEPTION 'Golfer with name % not found', gname;
        end if;
        RETURN golfer_id;
    END;
$$ LANGUAGE plpgsql;

BEGIN;

select plan(1);
select has_table('gd_user');
select * from finish();

ROLLBACK;