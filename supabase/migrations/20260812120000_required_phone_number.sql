alter table public.enrollments add column phone text;
update public.enrollments set phone=whatsapp where phone is null;
alter table public.enrollments alter column phone set not null;
drop function public.submit_enrollment(text,text,text,text,text,text,text,jsonb,integer,text,uuid);
create function public.submit_enrollment(p_reference text,p_name text,p_phone text,p_whatsapp text,p_location text,p_age_range text,p_course text,p_package_type text,p_preferred_slots jsonb,p_quoted_amount integer,p_price_status text,p_slot_id uuid default null) returns text language plpgsql security definer set search_path='' as $$ begin
if length(trim(p_name))<2 or length(trim(p_phone))<7 or length(trim(p_whatsapp))<7 or p_age_range not in ('18-24','25-34','35-45','46+') or p_course not in ('web','android') or p_package_type not in ('group','personal','self_paced','physical') or p_price_status not in ('price','quote') then raise exception 'Invalid enrollment';end if;
if p_slot_id is not null and not exists(select 1 from public.availability_slots where id=p_slot_id and course=p_course and package_type=p_package_type and status='available' and is_active and enrolled_count<capacity) then raise exception 'Selected schedule is unavailable';end if;
insert into public.enrollments(reference,name,phone,whatsapp,location,age_range,course,package_type,preferred_slots,quoted_amount,price_status,consent_at,slot_id) values(p_reference,left(trim(p_name),120),left(trim(p_phone),30),left(trim(p_whatsapp),30),left(trim(p_location),80),p_age_range,p_course,p_package_type,coalesce(p_preferred_slots,'[]'::jsonb),p_quoted_amount,p_price_status,now(),p_slot_id);return p_reference;end $$;
revoke all on function public.submit_enrollment(text,text,text,text,text,text,text,text,jsonb,integer,text,uuid) from public;
grant execute on function public.submit_enrollment(text,text,text,text,text,text,text,text,jsonb,integer,text,uuid) to anon;
