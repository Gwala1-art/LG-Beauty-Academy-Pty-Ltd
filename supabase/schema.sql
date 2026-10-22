create extension if not exists pgcrypto;

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text not null default '',
  duration_minutes integer,
  price_cents bigint check (price_cents is null or price_cents >= 0),
  deposit_cents bigint check (deposit_cents is null or deposit_cents >= 0),
  is_active boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.service_addons (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  price_cents bigint not null check (price_cents >= 0),
  is_active boolean not null default false
);

create table if not exists public.travel_zones (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  fee_cents bigint not null default 0 check (fee_cents >= 0),
  is_active boolean not null default false
);

create table if not exists public.availability_slots (
  id uuid primary key default gen_random_uuid(),
  service_id uuid references public.services(id),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  is_available boolean not null default true,
  check (ends_at > starts_at),
  unique (service_id, starts_at)
);
create index if not exists availability_slots_date_idx on public.availability_slots (starts_at) where is_available;

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text not null default '',
  learning_outcomes text not null default '',
  duration_text text not null default 'To be confirmed',
  price_cents bigint check (price_cents is null or price_cents >= 0),
  is_active boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.class_sessions (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id),
  starts_at timestamptz not null,
  ends_at timestamptz,
  price_cents bigint check (price_cents is null or price_cents >= 0),
  seats_remaining integer not null default 0 check (seats_remaining >= 0),
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  check (ends_at is null or ends_at > starts_at)
);
create index if not exists class_sessions_course_date_idx on public.class_sessions (course_id, starts_at) where is_active;

create table if not exists public.class_registrations (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  session_id uuid not null references public.class_sessions(id),
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  notes text not null default '',
  price_cents bigint,
  status text not null default 'requested' check (status in ('requested', 'confirmed', 'declined', 'cancelled')),
  created_at timestamptz not null default now()
);

insert into public.courses (name, description, learning_outcomes, duration_text, price_cents, is_active) values
  ('Beginner Makeup Class', 'Build a comfortable foundation, explore your makeup kit and practise a simple, wearable routine.', 'Product basics, skin preparation, complexion and everyday application', '2 days', 250000, false),
  ('Soft Glam Masterclass', 'Learn a softly defined glam look, from complexion preparation through to balanced finishing details.', 'Skin prep, soft definition, blending and polished finishing', '2 days', 250000, false),
  ('Full Glam Masterclass', 'Explore a more defined occasion look and practise techniques for a confident, camera-ready finish.', 'Fuller coverage, eye definition, blending and long-wear finishing', '2 days', 250000, false),
  ('Bridal Makeup Training', 'A focused learning session exploring bridal makeup planning and application.', 'Consultation, look planning, application and day-of considerations', '2 days', 250000, false),
  ('One-on-One Makeup Lesson', 'A personal session shaped around your experience, goals, features and the products you already own.', 'A tailored routine, guided practice and individual feedback', '2 days', 250000, false),
  ('Personal Makeup Coaching', 'Ongoing, individual guidance to help you refine your technique and feel more confident with makeup.', 'Personal goals, practical technique and next-step guidance', '2 days', 250000, false)
on conflict (name) do nothing;

update public.courses
set duration_text = '2 days', price_cents = 250000
where name in (
  'Beginner Makeup Class',
  'Soft Glam Masterclass',
  'Full Glam Masterclass',
  'Bridal Makeup Training',
  'One-on-One Makeup Lesson',
  'Personal Makeup Coaching'
);

update public.class_sessions
set price_cents = 250000
where course_id in (select id from public.courses where name in (
  'Beginner Makeup Class',
  'Soft Glam Masterclass',
  'Full Glam Masterclass',
  'Bridal Makeup Training',
  'One-on-One Makeup Lesson',
  'Personal Makeup Coaching'
));

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  availability_slot_id uuid not null unique references public.availability_slots(id),
  service_id uuid not null references public.services(id),
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  service_address text not null,
  travel_zone_id uuid references public.travel_zones(id),
  event_type text not null default '',
  event_date date,
  notes text not null default '',
  line_items jsonb not null default '[]'::jsonb,
  service_total_cents bigint,
  travel_fee_cents bigint,
  total_cents bigint,
  amount_due_cents bigint,
  payment_choice text not null check (payment_choice in ('full', 'deposit')),
  payment_status text not null default 'not_required' check (payment_status in ('not_required', 'pending', 'paid', 'failed', 'refund_pending', 'refunded')),
  booking_status text not null default 'requested' check (booking_status in ('requested', 'awaiting_payment', 'confirmed', 'cancellation_requested', 'cancelled', 'declined')),
  policy_accepted boolean not null check (policy_accepted),
  created_at timestamptz not null default now()
);

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('class', 'refund', 'cancellation', 'contact')),
  name text not null,
  email text not null,
  phone text not null default '',
  service text not null default '',
  booking_reference text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.payment_transactions (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id),
  provider text not null check (provider = 'paystack'),
  provider_reference text not null unique,
  provider_transaction_id text not null unique,
  receipt_number text,
  amount_cents bigint not null check (amount_cents >= 0),
  currency text not null check (currency = 'ZAR'),
  status text not null check (status = 'success'),
  created_at timestamptz not null default now()
);

create or replace function public.release_expired_payment_holds()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  released integer;
begin
  with expired as (
    update public.bookings set payment_status = 'failed', booking_status = 'requested'
    where booking_status = 'awaiting_payment' and payment_status = 'pending' and created_at < now() - interval '20 minutes'
    returning availability_slot_id
  )
  update public.availability_slots set is_available = true
  where id in (select availability_slot_id from expired);
  get diagnostics released = row_count;
  return released;
end;
$$;

insert into public.services (name, description, duration_minutes, is_active) values
  ('Soft Glam Makeup', 'A polished, skin-first makeup look.', 90, false),
  ('Full Glam Makeup', 'A defined, camera-ready occasion look.', 120, false),
  ('Bridal Makeup', 'Bridal beauty planned around your day.', null, false),
  ('Special Occasion Makeup', 'Personal makeup artistry for your event.', 90, false),
  ('Hairstyling', 'Event hairstyling confirmed by consultation.', null, false),
  ('Mobile Makeup Services', 'Makeup artistry at an agreed location.', null, false)
on conflict (name) do nothing;

update public.services set price_cents = 85000 where name = 'Soft Glam Makeup';
update public.services set price_cents = 100000 where name = 'Full Glam Makeup';
update public.services set price_cents = 150000 where name = 'Bridal Makeup';

alter table public.services enable row level security;
alter table public.service_addons enable row level security;
alter table public.travel_zones enable row level security;
alter table public.availability_slots enable row level security;
alter table public.courses enable row level security;
alter table public.class_sessions enable row level security;
alter table public.class_registrations enable row level security;
alter table public.bookings enable row level security;
alter table public.enquiries enable row level security;
alter table public.payment_transactions enable row level security;

revoke all on public.services, public.service_addons, public.travel_zones, public.availability_slots, public.courses, public.class_sessions, public.class_registrations, public.bookings, public.enquiries, public.payment_transactions from anon, authenticated;

create or replace function public.register_for_class(
  p_session_id uuid,
  p_customer_name text,
  p_customer_email text,
  p_customer_phone text,
  p_notes text
) returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  selected_session public.class_sessions%rowtype;
  selected_course public.courses%rowtype;
  class_ref text;
  registration_id uuid;
  class_price bigint;
begin
  select * into selected_session from public.class_sessions where id = p_session_id for update;
  if not found or not selected_session.is_active or selected_session.starts_at <= now() or selected_session.seats_remaining < 1 then
    raise exception 'This class session is no longer available';
  end if;
  select * into selected_course from public.courses where id = selected_session.course_id and is_active;
  if not found then raise exception 'This class is not currently available'; end if;
  class_price := coalesce(selected_session.price_cents, selected_course.price_cents);
  class_ref := 'LGC-' || upper(substr(encode(gen_random_bytes(7), 'hex'), 1, 12));
  insert into public.class_registrations (reference, session_id, customer_name, customer_email, customer_phone, notes, price_cents)
  values (class_ref, p_session_id, p_customer_name, lower(p_customer_email), p_customer_phone, p_notes, class_price)
  returning id into registration_id;
  update public.class_sessions set seats_remaining = seats_remaining - 1 where id = p_session_id;
  return jsonb_build_object('id', registration_id, 'reference', class_ref, 'price_cents', class_price);
end;
$$;

create or replace function public.reserve_booking(
  p_service_id uuid,
  p_slot_id uuid,
  p_addon_ids uuid[],
  p_zone_id uuid,
  p_payment_choice text,
  p_customer_name text,
  p_customer_email text,
  p_customer_phone text,
  p_service_address text,
  p_event_type text,
  p_event_date date,
  p_notes text,
  p_policy_accepted boolean
) returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  selected_service public.services%rowtype;
  selected_slot public.availability_slots%rowtype;
  selected_zone public.travel_zones%rowtype;
  addon_total bigint := 0;
  addon_count integer := 0;
  service_total bigint;
  travel_total bigint := 0;
  grand_total bigint;
  amount_due bigint;
  items jsonb := '[]'::jsonb;
  booking_ref text;
  booking_id uuid;
begin
  perform public.release_expired_payment_holds();
  if not p_policy_accepted then raise exception 'Booking policy acceptance is required'; end if;
  if p_payment_choice not in ('full', 'deposit') then raise exception 'Choose a valid payment preference'; end if;
  select * into selected_service from public.services where id = p_service_id and is_active for share;
  if not found then raise exception 'This service is not currently available'; end if;

  select * into selected_slot from public.availability_slots where id = p_slot_id for update;
  if not found or not selected_slot.is_available or selected_slot.starts_at <= now() then raise exception 'That appointment time is no longer available'; end if;
  if selected_slot.service_id is not null and selected_slot.service_id <> p_service_id then raise exception 'That time is not available for this service'; end if;

  if coalesce(cardinality(p_addon_ids), 0) > 0 then
    select coalesce(sum(price_cents), 0), count(*), coalesce(jsonb_agg(jsonb_build_object('name', name, 'amount_cents', price_cents)), '[]'::jsonb)
    into addon_total, addon_count, items
    from public.service_addons where id = any(p_addon_ids) and is_active;
    if addon_count <> cardinality(p_addon_ids) then raise exception 'An add-on is no longer available'; end if;
  end if;

  if p_zone_id is not null then
    select * into selected_zone from public.travel_zones where id = p_zone_id and is_active;
    if not found then raise exception 'That travel area is not currently available'; end if;
    travel_total := selected_zone.fee_cents;
  end if;

  service_total := selected_service.price_cents;
  if service_total is not null then grand_total := service_total + addon_total + travel_total; end if;
  amount_due := grand_total;
  if p_payment_choice = 'deposit' and service_total is not null then
    if selected_service.deposit_cents is null then raise exception 'A deposit is not configured for this service'; end if;
    amount_due := selected_service.deposit_cents + addon_total + travel_total;
  end if;
  if service_total is null then amount_due := null; end if;
  if p_zone_id is null then amount_due := null; end if;

  items := items || jsonb_build_array(jsonb_build_object('name', selected_service.name, 'amount_cents', selected_service.price_cents));
  if p_zone_id is not null then items := items || jsonb_build_array(jsonb_build_object('name', 'Travel: ' || selected_zone.name, 'amount_cents', selected_zone.fee_cents)); end if;
  booking_ref := 'LGB-' || upper(substr(encode(gen_random_bytes(7), 'hex'), 1, 12));
  insert into public.bookings (reference, availability_slot_id, service_id, customer_name, customer_email, customer_phone, service_address, travel_zone_id, event_type, event_date, notes, line_items, service_total_cents, travel_fee_cents, total_cents, amount_due_cents, payment_choice, policy_accepted)
  values (booking_ref, p_slot_id, p_service_id, p_customer_name, lower(p_customer_email), p_customer_phone, p_service_address, p_zone_id, p_event_type, p_event_date, p_notes, items, service_total, travel_total, grand_total, amount_due, p_payment_choice, true)
  returning id into booking_id;
  update public.availability_slots set is_available = false where id = p_slot_id;
  return jsonb_build_object('id', booking_id, 'reference', booking_ref, 'total_cents', grand_total, 'amount_due_cents', amount_due, 'currency', 'ZAR');
end;
$$;

create or replace function public.finalize_paystack_payment(p_reference text, p_amount_cents bigint, p_currency text, p_transaction_id text, p_receipt_number text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  selected_booking public.bookings%rowtype;
begin
  select * into selected_booking from public.bookings where reference = p_reference for update;
  if not found then return false; end if;
  if selected_booking.payment_status = 'paid' then return true; end if;
  if not ((selected_booking.booking_status = 'awaiting_payment' and selected_booking.payment_status = 'pending') or (selected_booking.booking_status = 'requested' and selected_booking.payment_status = 'failed')) then return false; end if;
  if selected_booking.amount_due_cents <> p_amount_cents or p_currency <> 'ZAR' then return false; end if;
  insert into public.payment_transactions (booking_id, provider, provider_reference, provider_transaction_id, receipt_number, amount_cents, currency, status)
  values (selected_booking.id, 'paystack', selected_booking.reference, p_transaction_id, p_receipt_number, p_amount_cents, p_currency, 'success')
  on conflict do nothing;
  if not exists (select 1 from public.payment_transactions where provider_reference = selected_booking.reference and provider_transaction_id = p_transaction_id and status = 'success') then return false; end if;
  update public.bookings set payment_status = 'paid', booking_status = case when selected_booking.booking_status = 'awaiting_payment' then 'confirmed' else 'requested' end where id = selected_booking.id;
  return true;
end;
$$;

create or replace function public.mark_paystack_payment_failed(p_reference text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  selected_booking public.bookings%rowtype;
begin
  select * into selected_booking from public.bookings where reference = p_reference for update;
  if not found or selected_booking.booking_status <> 'awaiting_payment' or selected_booking.payment_status <> 'pending' then return false; end if;
  update public.bookings set payment_status = 'failed', booking_status = 'requested' where id = selected_booking.id;
  update public.availability_slots set is_available = true where id = selected_booking.availability_slot_id;
  return true;
end;
$$;

revoke all on function public.reserve_booking(uuid, uuid, uuid[], uuid, text, text, text, text, text, text, date, text, boolean) from public, anon, authenticated;
revoke all on function public.finalize_paystack_payment(text, bigint, text, text, text) from public, anon, authenticated;
revoke all on function public.register_for_class(uuid, text, text, text, text) from public, anon, authenticated;
revoke all on function public.release_expired_payment_holds() from public, anon, authenticated;
revoke all on function public.mark_paystack_payment_failed(text) from public, anon, authenticated;
grant execute on function public.reserve_booking(uuid, uuid, uuid[], uuid, text, text, text, text, text, text, date, text, boolean) to service_role;
grant execute on function public.finalize_paystack_payment(text, bigint, text, text, text) to service_role;
grant execute on function public.register_for_class(uuid, text, text, text, text) to service_role;
grant execute on function public.release_expired_payment_holds() to service_role;
grant execute on function public.mark_paystack_payment_failed(text) to service_role;