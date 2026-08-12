create policy "admins manage tutor payments" on public.tutor_payments for all to authenticated using(private.is_admin((select auth.uid()))) with check(private.is_admin((select auth.uid())));
