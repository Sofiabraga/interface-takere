-- ============================================================
-- TCC Takere — Schema Supabase
-- ============================================================
-- 4 tabelas para persistir medicamentos fictícios, horários e
-- registros de tomada por usuário autenticado. RLS ativa em todas;
-- cada usuário só enxerga os próprios dados.
--
-- Aplicar em Supabase Studio → SQL Editor → cole tudo → Run.
-- O script é idempotente: dropa antes de recriar.
-- ============================================================

-- ------------------------------------------------------------
-- 1. Limpeza prévia (idempotência)
-- ------------------------------------------------------------
-- Ordem importa:
--   a) tabelas com cascade — derruba os triggers set_*_updated_at junto;
--   b) trigger em auth.users (essa tabela sempre existe);
--   c) funções públicas (depois que ninguém mais depende delas).
-- "drop trigger if exists ... on <tabela>" precisaria que <tabela>
-- exista — por isso não dá pra começar por aí na primeira execução.
drop table if exists public.medication_logs cascade;
drop table if exists public.medication_schedules cascade;
drop table if exists public.medications cascade;
drop table if exists public.profiles cascade;

drop trigger if exists on_auth_user_created on auth.users;

drop function if exists public.handle_new_user();
drop function if exists public.set_updated_at();

-- ------------------------------------------------------------
-- 2. Função utilitária para updated_at automático
-- ------------------------------------------------------------
create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ------------------------------------------------------------
-- 3. profiles — 1:1 com auth.users; só dados de persona
-- ------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  age int check (age is null or age between 0 and 130),
  tech_familiarity text check (tech_familiarity in ('low', 'medium', 'high')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- 4. medications — pertence a um profile
-- ------------------------------------------------------------
create table public.medications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  dose text not null,
  instructions text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index medications_profile_id_idx on public.medications (profile_id);

create trigger set_medications_updated_at
before update on public.medications
for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- 5. medication_schedules — horário associado a um medicamento
-- ------------------------------------------------------------
create table public.medication_schedules (
  id uuid primary key default gen_random_uuid(),
  medication_id uuid not null references public.medications (id) on delete cascade,
  time_of_day time not null,
  -- weekdays: array opcional com valores 0..6 (0 = domingo).
  -- null  = todo dia.
  weekdays smallint[] check (
    weekdays is null
    or (
      array_length(weekdays, 1) between 1 and 7
      and weekdays <@ array[0,1,2,3,4,5,6]::smallint[]
    )
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index medication_schedules_medication_id_idx
  on public.medication_schedules (medication_id);

create trigger set_medication_schedules_updated_at
before update on public.medication_schedules
for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- 6. medication_logs — registro de cada tomada (uma por dia/horário)
-- ------------------------------------------------------------
create table public.medication_logs (
  id uuid primary key default gen_random_uuid(),
  schedule_id uuid not null references public.medication_schedules (id) on delete cascade,
  scheduled_for timestamptz not null,
  status text not null default 'pending'
    check (status in ('pending', 'taken', 'late')),
  taken_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- invariante: se está 'taken', precisa ter taken_at; se não, taken_at é null
  constraint medication_logs_taken_consistency check (
    (status = 'taken' and taken_at is not null)
    or (status <> 'taken' and taken_at is null)
  )
);

create index medication_logs_schedule_id_idx
  on public.medication_logs (schedule_id);
create index medication_logs_scheduled_for_idx
  on public.medication_logs (scheduled_for);

create trigger set_medication_logs_updated_at
before update on public.medication_logs
for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- 7. Trigger: cria profile automaticamente ao criar auth.users
-- ------------------------------------------------------------
-- security definer faz a função rodar com privilégios do owner,
-- então o INSERT no profile não é bloqueado pelo RLS.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'display_name',
      split_part(new.email, '@', 1)
    )
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- 8. Row Level Security
-- ============================================================
alter table public.profiles enable row level security;
alter table public.medications enable row level security;
alter table public.medication_schedules enable row level security;
alter table public.medication_logs enable row level security;

-- ----- profiles --------------------------------------------------
-- usuário só vê e atualiza o próprio perfil.
-- insert é feito pelo trigger handle_new_user (security definer); não há
-- policy de insert para impedir criação manual via API.
-- delete não é exposto (cascade vem de auth.users).
create policy "profiles select own"
  on public.profiles for select
  using (id = auth.uid());

create policy "profiles update own"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- ----- medications ----------------------------------------------
create policy "medications select own"
  on public.medications for select
  using (profile_id = auth.uid());

create policy "medications insert own"
  on public.medications for insert
  with check (profile_id = auth.uid());

create policy "medications update own"
  on public.medications for update
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

create policy "medications delete own"
  on public.medications for delete
  using (profile_id = auth.uid());

-- ----- medication_schedules -------------------------------------
-- acesso transitivo: a schedule é "minha" se a medication dela é minha.
create policy "schedules select own"
  on public.medication_schedules for select
  using (
    exists (
      select 1 from public.medications m
      where m.id = medication_schedules.medication_id
        and m.profile_id = auth.uid()
    )
  );

create policy "schedules insert own"
  on public.medication_schedules for insert
  with check (
    exists (
      select 1 from public.medications m
      where m.id = medication_schedules.medication_id
        and m.profile_id = auth.uid()
    )
  );

create policy "schedules update own"
  on public.medication_schedules for update
  using (
    exists (
      select 1 from public.medications m
      where m.id = medication_schedules.medication_id
        and m.profile_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.medications m
      where m.id = medication_schedules.medication_id
        and m.profile_id = auth.uid()
    )
  );

create policy "schedules delete own"
  on public.medication_schedules for delete
  using (
    exists (
      select 1 from public.medications m
      where m.id = medication_schedules.medication_id
        and m.profile_id = auth.uid()
    )
  );

-- ----- medication_logs ------------------------------------------
-- acesso transitivo: log → schedule → medication.profile_id
create policy "logs select own"
  on public.medication_logs for select
  using (
    exists (
      select 1 from public.medication_schedules s
      join public.medications m on m.id = s.medication_id
      where s.id = medication_logs.schedule_id
        and m.profile_id = auth.uid()
    )
  );

create policy "logs insert own"
  on public.medication_logs for insert
  with check (
    exists (
      select 1 from public.medication_schedules s
      join public.medications m on m.id = s.medication_id
      where s.id = medication_logs.schedule_id
        and m.profile_id = auth.uid()
    )
  );

create policy "logs update own"
  on public.medication_logs for update
  using (
    exists (
      select 1 from public.medication_schedules s
      join public.medications m on m.id = s.medication_id
      where s.id = medication_logs.schedule_id
        and m.profile_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.medication_schedules s
      join public.medications m on m.id = s.medication_id
      where s.id = medication_logs.schedule_id
        and m.profile_id = auth.uid()
    )
  );

create policy "logs delete own"
  on public.medication_logs for delete
  using (
    exists (
      select 1 from public.medication_schedules s
      join public.medications m on m.id = s.medication_id
      where s.id = medication_logs.schedule_id
        and m.profile_id = auth.uid()
    )
  );
