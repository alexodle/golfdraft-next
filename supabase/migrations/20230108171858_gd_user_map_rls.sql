create policy "users can select own user mappings"
on "public"."gd_user_map"
as permissive
for select
to public
using (("profileId" = auth.uid()));



