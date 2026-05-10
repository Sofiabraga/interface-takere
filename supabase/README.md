# Backend Supabase — TCC Takere

Este diretório guarda os **artefatos de banco** do TCC. Não é código de
aplicação; o app React Native ainda não conhece o Supabase nesta etapa
(C15). A integração no app começa na C16 (auth) e C17 (leitura).

> **Escopo acadêmico.** Todos os usuários, medicamentos, doses e horários
> abaixo são **fictícios**. Este backend não emite prescrição, não
> recomenda conduta, não armazena dados reais de saúde de nenhuma pessoa
> e não substitui avaliação clínica.

---

## Pré-requisitos

- Conta gratuita em [supabase.com](https://supabase.com).
- Projeto Supabase novo (use a região mais próxima — `sa-east-1` se
  possível).

---

## 1. Aplicar o schema

1. Abra o projeto no **Supabase Studio**.
2. **SQL Editor → New query**.
3. Cole o conteúdo de [`schema.sql`](./schema.sql).
4. **Run**.
5. Em **Table Editor**, confirme que existem `profiles`, `medications`,
   `medication_schedules` e `medication_logs`, e que cada uma exibe um
   ícone de cadeado (RLS ativa).

O schema também:
- cria o trigger `handle_new_user`, que insere automaticamente um
  `profile` toda vez que um usuário é criado em `auth.users`;
- liga RLS em todas as tabelas e adiciona policies para que cada usuário
  só enxergue os próprios dados;
- adiciona `updated_at` automático em todas as tabelas via trigger.

> Re-rodar `schema.sql` é seguro: ele faz `drop … cascade` antes de
> recriar. Isso apaga **todos** os dados — só faça em desenvolvimento.

---

## 2. Criar os 3 usuários demo

Antes, vá em **Authentication → Providers → Email** e desative
**"Confirm email"** (ou marque "Auto Confirm User" ao criar). Sem isso o
login dos demos vai falhar com `Email not confirmed`.

Para cada persona, vá em **Authentication → Users → Add user → Create
new user**:

| Persona | Email | Senha | Auto Confirm |
|---|---|---|---|
| Maria Silva | `maria.demo@takere.test` | `demo-maria-2026` | ✅ |
| Carlos Oliveira | `carlos.demo@takere.test` | `demo-carlos-2026` | ✅ |
| Ana Souza | `ana.demo@takere.test` | `demo-ana-2026` | ✅ |

> O domínio `.test` é reservado pela IETF (RFC 2606): nunca vira email
> real, não cai em caixa de entrada de ninguém. Use só esses 3 emails.

Após criar, em **Table Editor → profiles** já devem existir 3 linhas
(criadas pelo trigger `handle_new_user`), com `display_name` igual à
parte antes do `@` (p.ex. `maria.demo`). O seed da próxima etapa
substitui por "Maria Silva", "Carlos Oliveira", "Ana Souza" e preenche
`age` e `tech_familiarity`.

---

## 3. Aplicar o seed

1. **SQL Editor → New query**.
2. Cole o conteúdo de [`seed.sql`](./seed.sql).
3. **Run**.

O seed:
- confere que os 3 usuários existem (falha cedo se algum estiver
  faltando, com mensagem dizendo qual);
- apaga medications/schedules/logs anteriores das 3 contas demo
  (idempotente — pode rodar várias vezes);
- atualiza os 3 `profiles` com `display_name`, `age` e `tech_familiarity`;
- cria os medicamentos, horários e logs do dia atual:
  - **Maria** — 4 medicamentos (Omeprazol tomado, Losartana atrasada,
    Metformina pendente, Sinvastatina pendente);
  - **Carlos** — 2 medicamentos pendentes (Atorvastatina, Captopril);
  - **Ana** — 3 medicamentos todos tomados (Vitamina D, Ferro quelato,
    Multivitamínico).

### Sobre os logs do dia

O seed usa `current_date` + horário fixo. Os logs ficam **datados de
hoje** toda vez que você roda o seed. Para reproduzir o cenário no dia
da banca, basta rodar o seed naquele dia — nada para ajustar
manualmente.

A alternativa de usar uma data fixa (ex.: `'2026-05-09'`) **não** foi
adotada porque, fora desse dia, o app mostraria "nada para hoje" e
prejudicaria demonstrações ad-hoc. A escolha por `current_date` deixa a
demo sempre viva, ao custo de o `taken_at` em log de manhã ficar "no
futuro" se a demonstração rodar muito cedo (ver abaixo).

### Quirk conhecido

Se você rodar o seed antes das ~09:30, o `taken_at` da Vitamina D, do
Ferro quelato ou do Multivitamínico (Ana) podem ser timestamps no
futuro — visualmente estranho mas permitido pela constraint do banco.
Para a maior parte das demos (10h em diante), os horários estão todos no
passado e a tela fica natural.

---

## 4. Verificar a RLS

No SQL Editor você é o role `postgres`, que **bypassa** a RLS — é por
isso que `select * from medications` retorna tudo. Para testar a RLS de
verdade, simule a sessão de um usuário:

```sql
-- 1. Pegue o UUID da Maria:
select id from auth.users where email = 'maria.demo@takere.test';
--    Cole o UUID retornado em <maria-uuid> abaixo.

-- 2. Em uma nova query (ou abaixo, dentro de um único bloco):
begin;
  set local role authenticated;
  set local "request.jwt.claims" = '{"sub": "<maria-uuid>"}';

  select count(*) from public.medications;       -- esperado: 4
  select count(*) from public.medication_logs;   -- esperado: 4
  select display_name from public.profiles;      -- esperado: 1 linha (Maria Silva)
rollback;
```

Repita com Carlos: deve voltar `2 / 2 / 1 (Carlos Oliveira)`. Com Ana:
`3 / 3 / 1 (Ana Souza)`. Se algum desses retornar dados de outro
usuário, há policy faltando — refaça o `schema.sql`.

> Alternativa mais "real": instalar `@supabase/supabase-js` em um script
> Node, fazer `signInWithPassword` como Maria e rodar `select` em
> medications — deve voltar só os 4 dela. Não está incluído aqui porque
> adiciona dependências fora do escopo desta etapa.

---

## 5. Credenciais para o app (próxima etapa)

Em **Project Settings → API** copie dois valores:

- **Project URL** → vai em `EXPO_PUBLIC_SUPABASE_URL`.
- **anon / public key** → vai em `EXPO_PUBLIC_SUPABASE_ANON_KEY`.

Coloque ambos em um `.env` local (veja `.env.example` na raiz do repo).

> A chave **service_role** (bem abaixo, na mesma página) **nunca** vai
> para o app, para o `.env` que entra no git, ou para qualquer arquivo
> versionado. Ela bypassa RLS e equivale a acesso total ao banco. Se
> precisar dela em scripts locais (ex.: resetar usuários demo via API
> admin), use um `.env.local` específico do script, fora do repo.

---

## 6. O que NÃO commitar

- `.env`, `.env.local`, `.env.*.local` (já em `.gitignore`).
- Qualquer arquivo contendo a chave `service_role`, mesmo que pareça
  inofensivo (`tools/`, `scripts/`, etc).
- Dumps `pg_dump` da base, mesmo com dados fictícios — eles podem
  expor estrutura interna do Supabase.
- Capturas de tela do Studio que mostrem as chaves do projeto.

---

## 7. Se algo der errado

- **`Usuários demo ausentes: …`** ao seedar: a verificação inicial do
  `seed.sql` falhou. Volte ao passo 2 e crie os emails que faltaram.
- **`new row violates row-level security policy`** ao seedar: o seed
  está rodando como usuário autenticado em vez de `postgres`. Confirme
  que não há `set local role authenticated` ativo da sessão anterior do
  SQL Editor.
- **`Email not confirmed`** no login (próxima etapa): volte ao passo 2 e
  desative confirmação de email, ou abra cada usuário no Studio e marque
  como confirmado manualmente.
- **Trigger `handle_new_user` não disparou** ao criar usuário: confira em
  **Database → Triggers** se `on_auth_user_created` está ativo. Ordem
  correta: rodar `schema.sql` **antes** de criar os usuários. Se você
  inverteu a ordem, delete os 3 usuários, rode o schema, recrie os
  usuários.
- **Projeto pausado por inatividade** (após 7 dias sem uso): o plano
  gratuito do Supabase pausa automaticamente. Vá no dashboard do
  projeto e clique em "Restore" — leva ~1 minuto e os dados continuam
  intactos.
