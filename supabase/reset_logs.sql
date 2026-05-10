-- ============================================================
-- TCC Takere — Reset dos logs de tomada (volta ao estado do seed)
-- ============================================================
-- Use quando quiser desfazer todos os "marcar como tomado" feitos
-- pelo app nos perfis demo, sem recriar medications/schedules
-- (mantém os UUIDs estáveis — bom durante uma sessão de teste).
--
-- Aplicar em Supabase Studio → SQL Editor → cole tudo → Run.
-- Idempotente: pode rodar quantas vezes quiser.
--
-- Alternativa "nuclear": rodar `seed.sql`, que recria
-- medications/schedules/logs do zero. Use este script quando quiser
-- só rebobinar os logs do dia atual.
--
-- Os valores aqui têm que bater com `seed.sql`. Se mudar lá
-- (medicamento, horário, fuso), atualize aqui também.
-- ============================================================

-- ------------------------------------------------------------
-- 0. Confere que os usuários demo existem (interrompe cedo se não)
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
    raise exception 'Usuários demo ausentes: %. Rode seed.sql antes deste script.', v_missing;
  end if;
end $$;

-- ------------------------------------------------------------
-- 1. Reset dos logs de hoje
-- ------------------------------------------------------------
-- Estratégia:
--   - WHERE restringe aos 3 perfis demo;
--   - CASE em m.name determina o estado-alvo. Os nomes são únicos
--     entre os 3 perfis no seed atual, então não precisa desambiguar
--     por email. Se o seed passar a reusar nomes, troque o CASE para
--     casar em (u.email, m.name).
--   - scheduled_for é reescrito a partir do schedule.time_of_day para
--     que o reset volte a dar logs "datados de hoje" mesmo se o seed
--     foi rodado num dia anterior.
--   - status e taken_at são atualizados juntos para satisfazer
--     `medication_logs_taken_consistency`.
update public.medication_logs ml
set
  status = case m.name
    when 'Omeprazol'        then 'taken'
    when 'Losartana'        then 'late'
    when 'Vitamina D'       then 'taken'
    when 'Ferro quelato'    then 'taken'
    when 'Multivitamínico'  then 'taken'
    else 'pending'
  end,
  taken_at = case m.name
    when 'Omeprazol'
      then (current_date + interval '7 hours 5 minutes')  at time zone 'America/Sao_Paulo'
    when 'Vitamina D'
      then (current_date + interval '7 hours 2 minutes')  at time zone 'America/Sao_Paulo'
    when 'Ferro quelato'
      then (current_date + interval '8 hours 15 minutes') at time zone 'America/Sao_Paulo'
    when 'Multivitamínico'
      then (current_date + interval '9 hours 5 minutes')  at time zone 'America/Sao_Paulo'
    else null
  end,
  scheduled_for =
    (current_date + (s.time_of_day::text)::interval) at time zone 'America/Sao_Paulo'
from public.medication_schedules s
join public.medications m on m.id = s.medication_id
join auth.users u on u.id = m.profile_id
where ml.schedule_id = s.id
  and u.email in (
    'maria.demo@takere.test',
    'carlos.demo@takere.test',
    'ana.demo@takere.test'
  );

-- ------------------------------------------------------------
-- 2. Conferência rápida (opcional — comente se quiser silêncio)
-- ------------------------------------------------------------
-- Esperado após o reset:
--   maria.demo  → 1 taken, 1 late, 2 pending
--   carlos.demo → 0 taken, 0 late, 2 pending
--   ana.demo    → 3 taken, 0 late, 0 pending
select
  u.email,
  count(*) filter (where ml.status = 'taken')   as taken,
  count(*) filter (where ml.status = 'late')    as late,
  count(*) filter (where ml.status = 'pending') as pending
from public.medication_logs ml
join public.medication_schedules s on s.id = ml.schedule_id
join public.medications m on m.id = s.medication_id
join auth.users u on u.id = m.profile_id
where u.email in (
  'maria.demo@takere.test',
  'carlos.demo@takere.test',
  'ana.demo@takere.test'
)
group by u.email
order by u.email;
