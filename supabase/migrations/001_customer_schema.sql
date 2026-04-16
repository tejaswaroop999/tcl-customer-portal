create extension if not exists "pgcrypto";

create type public.user_type as enum ('customer', 'campus_rep', 'account_manager');
create type public.order_status as enum (
  'new',
  'proof_pending',
  'proof_ready',
  'approved',
  'in_production',
  'shipped',
  'complete'
);
create type public.print_type as enum (
  'screen_print',
  'embroidery',
  'puff_print',
  'foil',
  'dye_sublimation'
);
create type public.proof_status as enum ('pending', 'approved', 'revision_requested');

create table public.users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete cascade,
  name text not null,
  email text not null unique,
  user_type public.user_type not null default 'customer',
  organization text,
  school text,
  loyalty_points integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  sku text not null unique,
  name text not null,
  category text not null,
  turnaround_days integer not null,
  starting_price numeric(10,2) not null,
  is_featured boolean not null default false,
  print_types_available public.print_type[] not null default '{}',
  created_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.users(id) on delete cascade,
  event_name text not null,
  due_date date not null,
  status public.order_status not null default 'new',
  order_type text not null,
  products_selected text[] not null default '{}',
  print_type public.print_type not null,
  front_design_description text,
  back_design_description text,
  front_design_file text,
  back_design_file text,
  design_direction text,
  created_at timestamptz not null default now()
);

create table public.proofs (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  proof_number integer not null,
  product text not null,
  color text not null,
  print_type public.print_type not null,
  est_ship_date date,
  price_tiers jsonb not null default '[]'::jsonb,
  mockup_image_url text,
  status public.proof_status not null default 'pending',
  uploaded_at timestamptz not null default now(),
  unique(order_id, proof_number, product)
);

create table public.revision_requests (
  id uuid primary key default gen_random_uuid(),
  proof_id uuid not null references public.proofs(id) on delete cascade,
  customer_id uuid not null references public.users(id) on delete cascade,
  notes text not null,
  created_at timestamptz not null default now()
);

create index orders_customer_id_idx on public.orders(customer_id);
create index proofs_order_id_idx on public.proofs(order_id);
create index revision_requests_proof_id_idx on public.revision_requests(proof_id);

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (auth_user_id, name, email, user_type, organization)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.email,
    'customer',
    new.raw_user_meta_data ->> 'organization'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_auth_user();

create or replace function public.sync_order_status_from_proofs()
returns trigger
language plpgsql
as $$
declare
  remaining_count integer;
begin
  select count(*)
    into remaining_count
  from public.proofs
  where order_id = new.order_id
    and status <> 'approved';

  if remaining_count = 0 then
    update public.orders set status = 'approved' where id = new.order_id;
  elsif exists (
    select 1 from public.proofs where order_id = new.order_id and status = 'revision_requested'
  ) then
    update public.orders set status = 'proof_pending' where id = new.order_id;
  else
    update public.orders set status = 'proof_ready' where id = new.order_id;
  end if;

  return new;
end;
$$;

create trigger proofs_status_sync_trigger
after insert or update of status on public.proofs
for each row execute procedure public.sync_order_status_from_proofs();

alter table public.users enable row level security;
alter table public.orders enable row level security;
alter table public.proofs enable row level security;
alter table public.revision_requests enable row level security;
alter table public.products enable row level security;

create policy "customers can view own profile"
on public.users for select
using (auth.uid() = auth_user_id);

create policy "customers can update own profile"
on public.users for update
using (auth.uid() = auth_user_id);

create policy "customers can view own orders"
on public.orders for select
using (
  exists (
    select 1 from public.users u
    where u.id = orders.customer_id
      and u.auth_user_id = auth.uid()
  )
);

create policy "customers can create own orders"
on public.orders for insert
with check (
  exists (
    select 1 from public.users u
    where u.id = orders.customer_id
      and u.auth_user_id = auth.uid()
  )
);

create policy "customers can update own orders"
on public.orders for update
using (
  exists (
    select 1 from public.users u
    where u.id = orders.customer_id
      and u.auth_user_id = auth.uid()
  )
);

create policy "customers can view proofs for own orders"
on public.proofs for select
using (
  exists (
    select 1
    from public.orders o
    join public.users u on u.id = o.customer_id
    where o.id = proofs.order_id
      and u.auth_user_id = auth.uid()
  )
);

create policy "customers can update proofs for own orders"
on public.proofs for update
using (
  exists (
    select 1
    from public.orders o
    join public.users u on u.id = o.customer_id
    where o.id = proofs.order_id
      and u.auth_user_id = auth.uid()
  )
);

create policy "customers can view own revision requests"
on public.revision_requests for select
using (
  exists (
    select 1 from public.users u
    where u.id = revision_requests.customer_id
      and u.auth_user_id = auth.uid()
  )
);

create policy "customers can insert own revision requests"
on public.revision_requests for insert
with check (
  exists (
    select 1 from public.users u
    where u.id = revision_requests.customer_id
      and u.auth_user_id = auth.uid()
  )
);

create policy "products are readable by authenticated users"
on public.products for select
to authenticated
using (true);
