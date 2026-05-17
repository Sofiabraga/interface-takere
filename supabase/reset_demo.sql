-- ============================================================
-- TCC Takere — Reset do cenário demo
-- ============================================================
-- Script único para configuração inicial do banco E reset do
-- cenário demo antes de cada banca, avaliação heurística ou
-- sessão de teste com SUS. (Renomeado a partir de seed.sql na
-- C21 — o nome anterior era ambíguo entre "popular" e "resetar".)
--
-- Quando rodar:
--   - Configuração inicial do projeto Supabase.
--   - No dia da banca / avaliação, antes da sessão.
--   - Sempre que quiser voltar Maria/Carlos/Ana ao cenário canônico.
--
-- O que este script faz (em ordem):
--   1. Verifica que os 3 usuários demo existem em auth.users.
--   2. Apaga medications/schedules/logs das 3 contas demo (cascata).
--   3. Atualiza profiles (display_name, age, tech_familiarity).
--   4. Recria medicamentos, horários e logs de "hoje" + histórico
--      dos últimos 29 dias para alimentar a HistoryScreen mensal
--      (resumo dos últimos 30 dias = hoje + 29 anteriores).
--   5. Emite SELECT final de conferência por usuário.
--
-- O que este script NÃO toca:
--   - Linhas de auth.users (usuários e senhas demo são preservados).
--   - Schema, RLS policies, triggers (definidos em schema.sql).
--   - Dados de QUALQUER outro usuário fora dos 3 emails demo abaixo
--     (todos os DELETEs/INSERTs são filtrados por email).
--
-- Pré-requisito: os 3 usuários demo devem existir em
-- Authentication → Users (Auto Confirm User ativo) com os emails:
--   maria.demo@takere.test
--   carlos.demo@takere.test
--   ana.demo@takere.test
-- O script encontra os UUIDs por email — não é necessário copiar/
-- colar UUIDs em lugar nenhum.
--
-- Idempotente: pode rodar quantas vezes quiser; cada execução
-- restaura o mesmo cenário canônico.
--
-- Fuso: assume 'America/Sao_Paulo'. Para outro fuso, troque o
-- literal nos cálculos de scheduled_for/taken_at.
--
-- Datação dos logs: usa current_date + horário fixo. Logs ficam
-- "datados de hoje" toda vez que o script roda. Para reproduzir o
-- cenário no dia da banca, rode o script naquele dia.
--
-- Segurança:
--   - Rode SEMPRE no SQL Editor do Supabase Studio, autenticado
--     como dono do projeto. Nunca chame este script a partir do
--     app, de uma Edge Function ou de qualquer ambiente compartilhado.
--   - Nunca rode em um projeto Supabase que contenha dados reais
--     de usuários — o filtro por email protege os 3 demos, mas o
--     escopo de teste deste TCC pressupõe um projeto exclusivo de
--     demonstração.
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

-- ------------------------------------------------------------
-- 6. Logs históricos: últimos 29 dias para os 3 usuários
-- ------------------------------------------------------------
-- Alimenta a HistoryScreen com um mês inteiro de registros (hoje +
-- 29 dias anteriores = 30 dias). Os logs de "hoje" inseridos acima
-- cobrem o cenário usado pela Home; estes inserts adicionais cobrem
-- D-1 .. D-29 e nunca tocam D=0, então não há risco de quebrar
-- Home/List/Detail.
--
-- Os padrões usam aritmética modular sobre v_day_offset para ficarem
-- determinísticos e fáceis de verificar — diferente da versão de 7
-- dias, que listava os "dias pulados" à mão (inviável em 29 dias).
-- Cada usuário tem um perfil distinto para o resumo mensal:
--   - Maria: variada (~75% registrados, mistura confortável de
--     tomados e não tomados);
--   - Carlos: irregular (~17%, a maioria fica 'late');
--   - Ana: muito regular (~93%, quase tudo 'taken').
--
-- Status 'late' representa "previsto mas não registrado" no passado
-- — consistente com a check constraint do schema (taken_at is null
-- quando status <> 'taken').
do $$
declare
  v_profile_id uuid;
  v_sched      record;
  v_day_offset int;
  v_scheduled  timestamptz;
  v_take_it    boolean;
begin
  -- Maria: pula doses sempre que v_day_offset é múltiplo de 4.
  -- Resulta em 7 pulos por schedule (offsets 4,8,12,16,20,24,28) ×
  -- 4 schedules = 28 logs 'late' históricos. Os 88 restantes ficam
  -- 'taken'. Com hoje (1 taken, 1 late, 2 pending) o total mensal
  -- bate 89 taken / 29 late / 2 pending = 120 logs → ~74%.
  select id into v_profile_id from auth.users where email = 'maria.demo@takere.test';
  for v_sched in
    select s.id as sched_id, s.time_of_day as t
    from public.medication_schedules s
    join public.medications m on m.id = s.medication_id
    where m.profile_id = v_profile_id
  loop
    for v_day_offset in 1..29 loop
      v_scheduled :=
        ((current_date - v_day_offset) + v_sched.t)
          at time zone 'America/Sao_Paulo';
      v_take_it := (v_day_offset % 4) <> 0;

      if v_take_it then
        insert into public.medication_logs (schedule_id, scheduled_for, status, taken_at)
        values (
          v_sched.sched_id,
          v_scheduled,
          'taken',
          v_scheduled + interval '5 minutes'
        );
      else
        insert into public.medication_logs (schedule_id, scheduled_for, status)
        values (v_sched.sched_id, v_scheduled, 'late');
      end if;
    end loop;
  end loop;

  -- Carlos: marca como 'taken' SÓ quando v_day_offset é múltiplo de
  -- 5 — registros muito esparsos. Resulta em 5 takes por schedule
  -- (offsets 5,10,15,20,25) × 2 schedules = 10 takes históricos +
  -- 48 'late' históricos. Com hoje (2 pending) o total mensal bate
  -- 10 taken / 48 late / 2 pending = 60 logs → ~17%.
  select id into v_profile_id from auth.users where email = 'carlos.demo@takere.test';
  for v_sched in
    select s.id as sched_id, s.time_of_day as t
    from public.medication_schedules s
    join public.medications m on m.id = s.medication_id
    where m.profile_id = v_profile_id
  loop
    for v_day_offset in 1..29 loop
      v_scheduled :=
        ((current_date - v_day_offset) + v_sched.t)
          at time zone 'America/Sao_Paulo';
      v_take_it := (v_day_offset % 5) = 0;

      if v_take_it then
        insert into public.medication_logs (schedule_id, scheduled_for, status, taken_at)
        values (
          v_sched.sched_id,
          v_scheduled,
          'taken',
          v_scheduled + interval '10 minutes'
        );
      else
        insert into public.medication_logs (schedule_id, scheduled_for, status)
        values (v_sched.sched_id, v_scheduled, 'late');
      end if;
    end loop;
  end loop;

  -- Ana: pula doses só quando v_day_offset é múltiplo de 10. Resulta
  -- em 2 pulos por schedule (offsets 10, 20) × 3 schedules = 6 logs
  -- 'late'. Os 81 restantes ficam 'taken'. Com hoje (3 taken) o
  -- total mensal bate 84 taken / 6 late / 0 pending = 90 logs → ~93%.
  select id into v_profile_id from auth.users where email = 'ana.demo@takere.test';
  for v_sched in
    select s.id as sched_id, s.time_of_day as t
    from public.medication_schedules s
    join public.medications m on m.id = s.medication_id
    where m.profile_id = v_profile_id
  loop
    for v_day_offset in 1..29 loop
      v_scheduled :=
        ((current_date - v_day_offset) + v_sched.t)
          at time zone 'America/Sao_Paulo';
      v_take_it := (v_day_offset % 10) <> 0;

      if v_take_it then
        insert into public.medication_logs (schedule_id, scheduled_for, status, taken_at)
        values (
          v_sched.sched_id,
          v_scheduled,
          'taken',
          v_scheduled + interval '5 minutes'
        );
      else
        insert into public.medication_logs (schedule_id, scheduled_for, status)
        values (v_sched.sched_id, v_scheduled, 'late');
      end if;
    end loop;
  end loop;
end $$;

-- ------------------------------------------------------------
-- 7. Conferência final — uma linha por usuário demo
-- ------------------------------------------------------------
-- Use o resultado para validar visualmente o cenário restaurado.
-- Esperado em qualquer dia (porque o seed é determinístico):
--
--   ana.demo@takere.test    | 3 meds | 3 sched |  90 logs | 84 taken |  6 late | 0 pending
--   carlos.demo@takere.test | 2 meds | 2 sched |  60 logs | 10 taken | 48 late | 2 pending
--   maria.demo@takere.test  | 4 meds | 4 sched | 120 logs | 89 taken | 29 late | 2 pending
--
-- Resumo mensal correspondente (HistoryScreen):
--   Ana    → 93% (84/90)
--   Carlos → 17% (10/60)
--   Maria  → 74% (89/120)
--
-- Se aparecer algo diferente, NÃO entre na banca com esse estado —
-- rode o script de novo e confira; provavelmente o script foi
-- interrompido na metade.
select
  u.email,
  count(distinct m.id)                                   as medications,
  count(distinct s.id)                                   as schedules,
  count(ml.id)                                           as logs_total,
  count(ml.id) filter (where ml.status = 'taken')        as taken,
  count(ml.id) filter (where ml.status = 'late')         as late,
  count(ml.id) filter (where ml.status = 'pending')      as pending
from auth.users u
left join public.medications m            on m.profile_id = u.id
left join public.medication_schedules s   on s.medication_id = m.id
left join public.medication_logs ml       on ml.schedule_id = s.id
where u.email in (
  'maria.demo@takere.test',
  'carlos.demo@takere.test',
  'ana.demo@takere.test'
)
group by u.email
order by u.email;
