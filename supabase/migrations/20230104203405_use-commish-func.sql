drop policy "commissioners can delete from draft_auto_pick" on "public"."draft_auto_pick";

drop policy "commissioners can insert into draft_auto_pick" on "public"."draft_auto_pick";

create policy "commissioners can delete from draft_auto_pick"
on "public"."draft_auto_pick"
as permissive
for delete
to public
using (is_commissioner_of("tourneyId"));


create policy "commissioners can insert into draft_auto_pick"
on "public"."draft_auto_pick"
as permissive
for insert
to public
with check (is_commissioner_of("tourneyId"));



