-- ============================================================
-- TCC Takere — Seed de dados fictícios
-- ============================================================
-- Pré-requisito: os 3 usuários demo já devem ter sido criados em
-- Authentication → Users (com Auto Confirm User ativo) usando os
-- emails:
--   maria.demo@takere.test
--   carlos.demo@takere.test
--   ana.demo@takere.test
--
-- Este script encontra os UUIDs por email — não é necessário
-- copiar/colar UUIDs em lugar nenhum.
--
-- Idempotente: pode rodar várias vezes; apaga os dados das 3
-- contas demo antes de inserir os novos.
--
-- Fuso: assume 'America/Sao_Paulo'. Para outro fuso, troque o
-- literal nos cálculos de scheduled_for/taken_at.
--
-- Datação dos logs: usa current_date + horário fixo. Logs ficam
-- "datados de hoje" toda vez que o seed roda. Para reproduzir o
-- cenário no dia da banca, basta rodar o seed naquele dia.
-- ============================================================

-- ------------------------------------------------------------
-- 0. Verifica que os usuários existem (interrompe cedo se não)
-- ------------------------------------------------------------
do $$
declare
  v_missing text;
begin
  select string_agg(e, ', ') into v_missing
  from (values
    ('maria.demo@takere.test'),
    ('carlos.demo@takere.test'),
    ('ana.demo@takere.test')
  ) as expected(e)
  where e not in (select email from auth.users);

  if v_missing is not null then
    raise exception 'Usuários demo ausentes: %. Crie em Authentication → Users antes de rodar o seed.', v_missing;
  end if;
end $$;

-- ------------------------------------------------------------
-- 1. Limpa dados anteriores das 3 contas demo
--    (cascata: medications → schedules → logs)
-- ------------------------------------------------------------
delete from public.medications
where profile_id in (
  select id from auth.users
  where email in (
    'maria.demo@takere.test',
    'carlos.demo@takere.test',
    'ana.demo@takere.test'
  )
);

-- ------------------------------------------------------------
-- 2. Atualiza profiles (já criados pelo trigger handle_new_user)
-- ------------------------------------------------------------
update public.profiles
set display_name = 'Maria Silva', age = 68, tech_familiarity = 'low'
where id = (select id from auth.users where email = 'maria.demo@takere.test');

update public.profiles
set display_name = 'Carlos Oliveira', age = 45, tech_familiarity = 'medium'
where id = (select id from auth.users where email = 'carlos.demo@takere.test');

update public.profiles
set display_name = 'Ana Souza', age = 30, tech_familiarity = 'high'
where id = (select id from auth.users where email = 'ana.demo@takere.test');

-- ------------------------------------------------------------
-- 3. Maria: 4 medicamentos (1 tomado, 1 atrasado, 2 pendentes)
-- ------------------------------------------------------------
do $$
declare
  v_profile_id uuid;
  v_med_id     uuid;
  v_sched_id   uuid;
begin
  select id into v_profile_id from auth.users where email = 'maria.demo@takere.test';

  -- Omeprazol — tomado
  insert into public.medications (profile_id, name, dose, instructions)
  values (v_profile_id, 'Omeprazol', '20 mg', 'Tomar em jejum, 30 minutos antes do café da manhã.')
  returning id into v_med_id;
  insert into public.medication_schedules (medication_id, time_of_day)
  values (v_med_id, time '07:00')
  returning id into v_sched_id;
  insert into public.medication_logs (schedule_id, scheduled_for, status, taken_at)
  values (
    v_sched_id,
    (current_date + interval '7 hours') at time zone 'America/Sao_Paulo',
    'taken',
    (current_date + interval '7 hours 5 minutes') at time zone 'America/Sao_Paulo'
  );

  -- Losartana — atrasado
  insert into public.medications (profile_id, name, dose, instructions)
  values (v_profile_id, 'Losartana', '50 mg', 'Tomar com água, durante o café da manhã.')
  returning id into v_med_id;
  insert into public.medication_schedules (medication_id, time_of_day)
  values (v_med_id, time '08:00')
  returning id into v_sched_id;
  insert into public.medication_logs (schedule_id, scheduled_for, status)
  values (
    v_sched_id,
    (current_date + interval '8 hours') at time zone 'America/Sao_Paulo',
    'late'
  );

  -- Metformina — pendente
  insert into public.medications (profile_id, name, dose, instructions)
  values (v_profile_id, 'Metformina', '500 mg', 'Tomar logo após o almoço.')
  returning id into v_med_id;
  insert into public.medication_schedules (medication_id, time_of_day)
  values (v_med_id, time '12:00')
  returning id into v_sched_id;
  insert into public.medication_logs (schedule_id, scheduled_for, status)
  values (
    v_sched_id,
    (current_date + interval '12 hours') at time zone 'America/Sao_Paulo',
    'pending'
  );

  -- Sinvastatina — pendente
  insert into public.medications (profile_id, name, dose, instructions)
  values (v_profile_id, 'Sinvastatina', '20 mg', 'Tomar à noite, antes de dormir.')
  returning id into v_med_id;
  insert into public.medication_schedules (medication_id, time_of_day)
  values (v_med_id, time '22:00')
  returning id into v_sched_id;
  insert into public.medication_logs (schedule_id, scheduled_for, status)
  values (
    v_sched_id,
    (current_date + interval '22 hours') at time zone 'America/Sao_Paulo',
    'pending'
  );
end $$;

-- ------------------------------------------------------------
-- 4. Carlos: 2 medicamentos, todos pendentes
-- ------------------------------------------------------------
do $$
declare
  v_profile_id uuid;
  v_med_id     uuid;
  v_sched_id   uuid;
begin
  select id into v_profile_id from auth.users where email = 'carlos.demo@takere.test';

  insert into public.medications (profile_id, name, dose, instructions)
  values (v_profile_id, 'Atorvastatina', '20 mg', 'Tomar pela manhã, durante o café.')
  returning id into v_med_id;
  insert into public.medication_schedules (medication_id, time_of_day)
  values (v_med_id, time '08:00')
  returning id into v_sched_id;
  insert into public.medication_logs (schedule_id, scheduled_for, status)
  values (
    v_sched_id,
    (current_date + interval '8 hours') at time zone 'America/Sao_Paulo',
    'pending'
  );

  insert into public.medications (profile_id, name, dose, instructions)
  values (v_profile_id, 'Captopril', '25 mg', 'Tomar à noite, com pouca comida.')
  returning id into v_med_id;
  insert into public.medication_schedules (medication_id, time_of_day)
  values (v_med_id, time '20:00')
  returning id into v_sched_id;
  insert into public.medication_logs (schedule_id, scheduled_for, status)
  values (
    v_sched_id,
    (current_date + interval '20 hours') at time zone 'America/Sao_Paulo',
    'pending'
  );
end $$;

-- ------------------------------------------------------------
-- 5. Ana: 3 medicamentos matinais, todos tomados (cenário "em dia")
--    Horários propositalmente cedo (07–09h) para que, em qualquer
--    demo a partir das 10h, todos os taken_at sejam no passado.
-- ------------------------------------------------------------
do $$
declare
  v_profile_id uuid;
  v_med_id     uuid;
  v_sched_id   uuid;
begin
  select id into v_profile_id from auth.users where email = 'ana.demo@takere.test';

  insert into public.medications (profile_id, name, dose, instructions)
  values (v_profile_id, 'Vitamina D', '1000 UI', 'Tomar pela manhã, com o café.')
  returning id into v_med_id;
  insert into public.medication_schedules (medication_id, time_of_day)
  values (v_med_id, time '07:00')
  returning id into v_sched_id;
  insert into public.medication_logs (schedule_id, scheduled_for, status, taken_at)
  values (
    v_sched_id,
    (current_date + interval '7 hours') at time zone 'America/Sao_Paulo',
    'taken',
    (current_date + interval '7 hours 2 minutes') at time zone 'America/Sao_Paulo'
  );

  insert into public.medications (profile_id, name, dose, instructions)
  values (v_profile_id, 'Ferro quelato', '14 mg', 'Tomar com suco de laranja.')
  returning id into v_med_id;
  insert into public.medication_schedules (medication_id, time_of_day)
  values (v_med_id, time '08:00')
  returning id into v_sched_id;
  insert into public.medication_logs (schedule_id, scheduled_for, status, taken_at)
  values (
    v_sched_id,
    (current_date + interval '8 hours') at time zone 'America/Sao_Paulo',
    'taken',
    (current_date + interval '8 hours 15 minutes') at time zone 'America/Sao_Paulo'
  );

  insert into public.medications (profile_id, name, dose, instructions)
  values (v_profile_id, 'Multivitamínico', '1 cápsula', 'Tomar após o almoço leve.')
  returning id into v_med_id;
  insert into public.medication_schedules (medication_id, time_of_day)
  values (v_med_id, time '09:00')
  returning id into v_sched_id;
  insert into public.medication_logs (schedule_id, scheduled_for, status, taken_at)
  values (
    v_sched_id,
    (current_date + interval '9 hours') at time zone 'America/Sao_Paulo',
    'taken',
    (current_date + interval '9 hours 5 minutes') at time zone 'America/Sao_Paulo'
  );
end $$;
