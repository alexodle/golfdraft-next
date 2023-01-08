CREATE OR REPLACE FUNCTION debug(msg text, some_int int)
RETURNS boolean
AS
$$
BEGIN
    raise notice 'debug: %, value:%', msg, some_int;
    RETURN true;
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION debug(msg text, some_bool boolean)
RETURNS boolean
AS
$$
BEGIN
    raise notice 'debug: %, value:%', msg, some_bool;
    RETURN true;
END;
$$
LANGUAGE plpgsql;
