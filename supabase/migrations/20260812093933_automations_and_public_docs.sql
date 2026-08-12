create function public.public_receipt(p_receipt text) returns table(receipt_number text,issued_at timestamptz,amount integer,payment_status text,learner_name text,course text,package_type text,reference text) language sql stable security definer set search_path='' as $$ select r.receipt_number,r.issued_at,p.received_amount,p.status,e.name,e.course,e.package_type,e.reference from public.receipts r join public.payments p on p.id=r.payment_id join public.enrollments e on e.id=p.enrollment_id where upper(r.receipt_number)=upper(p_receipt) limit 1 $$;
revoke all on function public.public_receipt(text) from public;
grant execute on function public.public_receipt(text) to anon,authenticated;

create function private.after_fully_paid() returns trigger language plpgsql security definer set search_path='' as $$
declare s public.availability_slots;
begin
 if new.status='fully_paid' and (tg_op='INSERT' or old.status is distinct from 'fully_paid') then
  select * into s from public.availability_slots where id=(select slot_id from public.enrollments where id=new.enrollment_id) for update;
  if s.id is not null then
   update public.availability_slots set enrolled_count=enrolled_count+1,status=case when enrolled_count+1>=capacity then 'unavailable' else status end where id=s.id;
   if s.package_type='group' and s.enrolled_count+1>=s.capacity then
    insert into public.availability_slots(course,package_type,starts_at,capacity,cohort_name,status,is_active) values(s.course,s.package_type,s.starts_at+interval '21 days',s.capacity,coalesce(s.cohort_name,'Group')||' - Next','unavailable',false);
    perform private.notify_admins('Cohort filled',coalesce(s.cohort_name,'Group')||' reached capacity. A draft next cohort was created.','capacity','/admin?tab=Schedules');
   end if;
  end if;
 end if;
 return new;
end $$;
create trigger paid_capacity after insert or update on public.payments for each row execute function private.after_fully_paid();

create function private.arcane_maintenance() returns void language plpgsql security definer set search_path='' as $$
begin
 update public.enrollments set status='schedule_review',schedule_priority_expires_at=null,updated_at=now() where status='awaiting_payment' and schedule_priority_expires_at<now();
 update public.staff_profiles set status='expired' where status='pending' and request_expires_at<now();
 insert into public.notifications(user_id,title,body,kind,href) select distinct e.assigned_to,'Class starts in 24 hours',coalesce(s.cohort_name,'Class')||' begins '||to_char(s.starts_at,'DD Mon HH24:MI'),'reminder','/admin?tab=Schedules' from public.enrollments e join public.availability_slots s on s.id=e.slot_id where e.status='paid' and e.assigned_to is not null and s.starts_at between now()+interval '23 hours 30 minutes' and now()+interval '24 hours 30 minutes' and not exists(select 1 from public.notifications n where n.user_id=e.assigned_to and n.title='Class starts in 24 hours' and n.created_at>now()-interval '2 hours');
 insert into public.notifications(user_id,title,body,kind,href) select distinct e.assigned_to,'Class starts in 1 hour',coalesce(s.cohort_name,'Class')||' begins '||to_char(s.starts_at,'DD Mon HH24:MI'),'reminder','/admin?tab=Schedules' from public.enrollments e join public.availability_slots s on s.id=e.slot_id where e.status='paid' and e.assigned_to is not null and s.starts_at between now()+interval '50 minutes' and now()+interval '70 minutes' and not exists(select 1 from public.notifications n where n.user_id=e.assigned_to and n.title='Class starts in 1 hour' and n.created_at>now()-interval '2 hours');
 insert into public.notifications(user_id,title,body,kind,href) select user_id,'Daily CRM summary',(select count(*) from public.enrollments where created_at>now()-interval '24 hours')||' new applications - '||(select count(*) from public.enrollments where status='awaiting_payment')||' awaiting payment','summary','/admin' from public.staff_profiles where status='approved' and role in ('owner','admin') and extract(hour from now() at time zone 'Africa/Lagos')=8 and not exists(select 1 from public.notifications n where n.user_id=staff_profiles.user_id and n.title='Daily CRM summary' and n.created_at>now()-interval '20 hours');
end $$;
create extension if not exists pg_cron with schema pg_catalog;
select cron.schedule('arcane-crm-maintenance','*/30 * * * *','select private.arcane_maintenance()');
