CREATE OR REPLACE FUNCTION trigger_mod_created_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."createdAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
