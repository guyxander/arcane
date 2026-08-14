create or replace function public.admin_schedule_action(p_action text, p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  sid uuid;
  current_enrolled integer;
  linked_enrollments integer;
begin
  if uid is null or not private.is_admin(uid) then
    raise exception 'Only an approved administrator can manage schedules';
  end if;

  sid := (p_payload->>'id')::uuid;

  if p_action = 'update_slot' then
    select enrolled_count into current_enrolled
    from public.availability_slots
    where id = sid
    for update;

    if not found then
      raise exception 'Schedule not found';
    end if;

    if (p_payload->>'capacity')::integer < greatest(1, current_enrolled) then
      raise exception 'Capacity cannot be lower than the current enrollment count';
    end if;

    update public.availability_slots
    set course = p_payload->>'course',
        package_type = p_payload->>'package_type',
        starts_at = (p_payload->>'starts_at')::timestamptz,
        capacity = (p_payload->>'capacity')::integer,
        cohort_name = nullif(trim(p_payload->>'cohort_name'), '')
    where id = sid;

    insert into public.audit_log(actor_id, action, entity_type, entity_id, details)
    values(uid, p_action, 'availability_slot', sid::text, p_payload - 'id');

    return jsonb_build_object('ok', true, 'id', sid);
  elsif p_action = 'delete_slot' then
    select count(*) into linked_enrollments
    from public.enrollments
    where slot_id = sid;

    if linked_enrollments > 0 then
      raise exception 'This schedule has enrollments and cannot be deleted. Disable it instead.';
    end if;

    delete from public.availability_slots where id = sid;
    if not found then
      raise exception 'Schedule not found';
    end if;

    insert into public.audit_log(actor_id, action, entity_type, entity_id, details)
    values(uid, p_action, 'availability_slot', sid::text, jsonb_build_object('deleted', true));

    return jsonb_build_object('ok', true, 'id', sid);
  end if;

  raise exception 'Unsupported schedule action';
end
$$;

revoke all on function public.admin_schedule_action(text, jsonb) from public, anon;
grant execute on function public.admin_schedule_action(text, jsonb) to authenticated;
