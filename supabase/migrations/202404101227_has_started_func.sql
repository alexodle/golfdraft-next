set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.has_draft_started(tourney_id integer)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
declare
  has_draft_started_ boolean;
begin
  select
    NOW() >= "draftStart" into has_draft_started_
  from draft_settings
  where tourney_id = "tourneyId";
  return has_draft_started_;
end;
$function$
;
