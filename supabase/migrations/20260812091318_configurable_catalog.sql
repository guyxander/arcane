create table public.course_prices (
  id uuid primary key default gen_random_uuid(),
  course text not null check(course in ('web','android')),
  package_type text not null check(package_type in ('group','personal','self_paced')),
  amount integer check(amount is null or amount >= 5000),
  available boolean not null default true,
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now(),
  unique(course,package_type)
);
insert into public.course_prices(course,package_type,amount,available) values
('web','group',45000,true),('web','personal',105000,true),('web','self_paced',15000,true),
('android','group',60000,true),('android','personal',135000,true),('android','self_paced',null,false);

alter table public.course_prices enable row level security;
revoke all on public.course_prices from anon,authenticated;
grant select,insert,update on public.course_prices to authenticated;
create policy "approved staff read prices" on public.course_prices for select to authenticated using(private.is_approved_staff((select auth.uid())));
create policy "admins update prices" on public.course_prices for update to authenticated using(private.is_admin((select auth.uid()))) with check(private.is_admin((select auth.uid())));

create function public.get_catalog() returns jsonb language sql stable security definer set search_path='' as $$
  select jsonb_build_object(
    'prices',(select coalesce(jsonb_agg(jsonb_build_object('course',course,'packageType',package_type,'amount',amount,'available',available) order by course,package_type),'[]'::jsonb) from public.course_prices),
    'slots',(select coalesce(jsonb_agg(jsonb_build_object('id',id,'course',course,'packageType',package_type,'startsAt',starts_at,'status',status,'capacity',capacity,'cohortName',cohort_name) order by starts_at),'[]'::jsonb) from public.availability_slots where starts_at>now())
  )
$$;
revoke all on function public.get_catalog() from public,authenticated;
grant execute on function public.get_catalog() to anon;

create index availability_slots_created_by_idx on public.availability_slots(created_by);
create index certificates_project_approved_by_idx on public.certificates(project_approved_by);
create index payments_enrollment_id_idx on public.payments(enrollment_id);
create index payments_verified_by_idx on public.payments(verified_by);
create index receipts_payment_id_idx on public.receipts(payment_id);
create index staff_profiles_approved_by_idx on public.staff_profiles(approved_by);
create index course_prices_updated_by_idx on public.course_prices(updated_by);
