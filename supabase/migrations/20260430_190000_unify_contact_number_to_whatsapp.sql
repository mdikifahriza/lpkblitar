begin;

insert into public.site_settings (key, value, tipe, label)
select
  'whatsapp_number',
  legacy.value,
  'text',
  'Nomor WhatsApp'
from public.site_settings as legacy
where legacy.key = 'phone_number'
  and coalesce(nullif(legacy.value, ''), '') <> ''
  and not exists (
    select 1
    from public.site_settings as existing
    where existing.key = 'whatsapp_number'
  );

update public.site_settings as target
set value = source.value
from public.site_settings as source
where target.key = 'whatsapp_number'
  and source.key = 'phone_number'
  and coalesce(nullif(target.value, ''), '') = ''
  and coalesce(nullif(source.value, ''), '') <> '';

delete from public.site_settings
where key = 'phone_number';

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'contact_settings'
      and column_name = 'phone_number'
  ) then
    execute $sql$
      update public.contact_settings
      set whatsapp_number = phone_number
      where coalesce(nullif(whatsapp_number, ''), '') = ''
        and coalesce(nullif(phone_number, ''), '') <> ''
    $sql$;

    execute 'alter table public.contact_settings drop column phone_number';
  end if;
end
$$;

commit;
