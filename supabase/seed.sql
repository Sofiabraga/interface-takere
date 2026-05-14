-- ============================================================
-- TCC Takere — Seed / Reset do cenário demo
-- ============================================================
-- Este é o ÚNICO script necessário tanto para a configuração
-- inicial do banco quanto para resetar o cenário demo antes de
-- cada banca, avaliação heurística ou sessão de teste com SUS.
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
--      dos últimos 6 dias para alimentar a HistoryScreen semanal.
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
-- 6. Logs históricos: últimos 6 dias para os 3 usuários
-- ------------------------------------------------------------
-- Alimenta a HistoryScreen com uma semana variada. Os logs de "hoje"
-- inseridos acima cobrem o cenário usado pela Home; estes inserts
-- adicionais cobrem D-1 .. D-6 e nunca tocam D=0, então não há risco
-- de quebrar Home/List/Detail.
--
-- Os padrões por usuário foram desenhados para que o resumo semanal
-- mostre percentuais distintos:
--   - Maria: semana variada (mix de tomados e não tomados);
--   - Carlos: poucos registros (a maioria das doses fica 'late');
--   - Ana: registros mais completos (quase tudo 'taken').
--
-- Status 'late' é usado para representar "previsto mas não
-- registrado" no passado — consistente com a check constraint do
-- schema (taken_at is null quando status <> 'taken').
do $$
declare
  v_profile_id uuid;
  v_sched      record;
  v_day_offset int;
  v_scheduled  timestamptz;
  v_take_it    boolean;
begin
  -- Maria: padrão variado.
  -- Pula a Sinvastatina (22h) em D-4 e D-2 e a Losartana (08h) em D-3
  -- e D-6 para que dias diferentes produzam percentuais diferentes.
  select id into v_profile_id from auth.users where email = 'maria.demo@takere.test';
  for v_sched in
    select s.id as sched_id, s.time_of_day as t
    from public.medication_schedules s
    join public.medications m on m.id = s.medication_id
    where m.profile_id = v_profile_id
  loop
    for v_day_offset in 1..6 loop
      v_scheduled :=
        ((current_date - v_day_offset) + v_sched.t)
          at time zone 'America/Sao_Paulo';
      v_take_it := case
        when v_day_offset in (4, 2) and v_sched.t = time '22:00' then false
        when v_day_offset in (3, 6) and v_sched.t = time '08:00' then false
        when v_day_offset = 5 and v_sched.t = time '12:00' then false
        else true
      end;

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

  -- Carlos: poucos registros. Marca como 'taken' só em alguns dias,
  -- e nem todas as doses do dia, para refletir uma semana com
  -- percentual mais baixo.
  select id into v_profile_id from auth.users where email = 'carlos.demo@takere.test';
  for v_sched in
    select s.id as sched_id, s.time_of_day as t
    from public.medication_schedules s
    join public.medications m on m.id = s.medication_id
    where m.profile_id = v_profile_id
  loop
    for v_day_offset in 1..6 loop
      v_scheduled :=
        ((current_date - v_day_offset) + v_sched.t)
          at time zone 'America/Sao_Paulo';
      v_take_it := case
        -- Apenas a dose matinal em alguns dias específicos.
        when v_sched.t = time '08:00' and v_day_offset in (1, 3, 5) then true
        -- Dose noturna só em D-1.
        when v_sched.t = time '20:00' and v_day_offset = 1 then true
        else false
      end;

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

  -- Ana: registros mais completos. Praticamente todas as doses
  -- marcadas como 'taken'; deixa uma única falha em D-4 para que
  -- a semana não fique 100% reta.
  select id into v_profile_id from auth.users where email = 'ana.demo@takere.test';
  for v_sched in
    select s.id as sched_id, s.time_of_day as t
    from public.medication_schedules s
    join public.medications m on m.id = s.medication_id
    where m.profile_id = v_profile_id
  loop
    for v_day_offset in 1..6 loop
      v_scheduled :=
        ((current_date - v_day_offset) + v_sched.t)
          at time zone 'America/Sao_Paulo';
      v_take_it := not (v_day_offset = 4 and v_sched.t = time '09:00');

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
--   ana.demo@takere.test    | 3 meds | 3 sched | 21 logs | 20 taken | 1 late | 0 pending
--   carlos.demo@takere.test | 2 meds | 2 sched | 14 logs |  4 taken | 8 late | 2 pending
--   maria.demo@takere.test  | 4 meds | 4 sched | 28 logs | 20 taken | 6 late | 2 pending
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
