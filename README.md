# interface-takere

Interface mobile de gestão de medicamentos para tratamentos de média e
longa duração, no contexto do projeto **Takere**. Artefato prático do
TCC em Ciência da Computação na UFRGS — estudo exploratório sobre o uso
de **Claude** no desenvolvimento e avaliação de uma interface mHealth.

A interface é avaliada por:

- avaliação heurística (heurísticas de Nielsen);
- testes com participantes + SUS (System Usability Scale).

> ⚠️ **Não é sistema clínico.** O app não prescreve, não recomenda
> conduta médica, não valida dosagem nem usa dados reais de saúde. A
> ação do usuário representa apenas um **registro pessoal**, não uma
> validação clínica.

---

## Stack

- Expo SDK 54 · React Native 0.81.x · React 19
- TypeScript estrito · React Navigation v7 (native-stack)
- Supabase (auth + persistência via `@supabase/supabase-js`)
- Sem bibliotecas de UI/ícones/animação/gráfico — escolha consciente
  para evitar dependências e manter o estudo de UX focado.

---

## Quick start

```bash
# 1. Clonar e instalar (--legacy-peer-deps é necessário — conflito
#    benigno transitivo envolvendo @types/react)
git clone <repo>
cd interface-takere
npm install --legacy-peer-deps

# 2. Criar .env na raiz com as credenciais do Supabase
cat > .env <<EOF
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
EOF

# 3. Rodar
npm run start
#    i  → iOS Simulator
#    a  → Android Emulator
#    ou abra o QR code no Expo Go
```

Backend não está configurado? Veja [`supabase/README.md`](./supabase/README.md)
— ele documenta passo a passo schema, usuários demo, seed e reset.

Após mudar versões de qualquer dependência Expo: `npx expo install --fix`.

---

## Variáveis de ambiente

| Variável | Origem |
|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase Studio → Project Settings → API → Project URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase Studio → Project Settings → API → anon / public |

> 🔒 **Nunca commitar** `.env`, `.env.local` ou qualquer arquivo
> contendo a chave `service_role`. O app **só** usa a chave anônima —
> RLS no Supabase faz o isolamento por usuário. Detalhes em
> [`supabase/README.md`](./supabase/README.md).

---

## Usuários demo

Personas fictícias usadas em demonstrações, avaliação heurística e
sessões de SUS:

| Persona | Email | Familiaridade tecnológica |
|---|---|---|
| Maria Silva (68 anos) | `maria.demo@takere.test` | baixa |
| Carlos Oliveira (45 anos) | `carlos.demo@takere.test` | média |
| Ana Souza (30 anos) | `ana.demo@takere.test` | alta |

Maria é a persona principal da v1 — o design prioriza tipografia
maior (corpo ≥ 18 px), tap targets generosos (primário ≥ 56 px), zero
ícones, zero animações, status em **texto + cor**, e linguagem em
PT-BR coloquial.

Senhas e procedimento de criação dos usuários em
[`supabase/README.md`](./supabase/README.md).

---

## Cenário demo resetável

O cenário inicial das três personas (medicamentos, horários, logs de
hoje + histórico semanal) é restaurado por um único script SQL no
Supabase:

- Antes de cada banca, sessão de avaliação ou demo: rode
  [`supabase/seed.sql`](./supabase/seed.sql) no SQL Editor do Supabase
  Studio **no mesmo dia da sessão** (os logs usam `current_date`).
- Reset rápido durante uma sessão (só logs de hoje, sem mexer no
  histórico):
  [`supabase/reset_logs.sql`](./supabase/reset_logs.sql).
- Checklist passo a passo, valores esperados e troubleshooting em
  [`supabase/README.md`](./supabase/README.md) → seção "Antes da banca".

### Por que não existe reset dentro do app

Por design. Resetar dados é operação administrativa que:

- não cabe na RLS atual (apagar dados de outro usuário exigiria
  `service_role`, que **nunca** vai para o cliente);
- pode ser tocada por engano durante uma sessão de SUS e invalidar a
  coleta de dados em andamento;
- não traz valor ao avaliador participante, que entra com a persona
  já no cenário inicial.

O reset administrativo via SQL no Supabase Studio é a fronteira
explícita entre "operação do pesquisador" e "interação do
participante".

---

## Estrutura do projeto

```
src/
  screens/        Componentes de tela — não importam mocks nem regra de negócio.
  components/     UI reutilizável.
  hooks/          Ponte entre tela e service; detêm estado em memória.
  services/       Funções puras de derivação (view-models, agregações).
  contexts/       AuthProvider, MedicationProvider.
  repositories/   Repository Pattern; SupabaseMedicationRepository + MockMedicationRepository.
  domain/         Tipos e enums do domínio (em inglês).
  adapters/       Único lugar autorizado a importar expo-* / supabase-js.
  navigation/     React Navigation v7 — native-stack.
  theme/          colors, spacing, radius, typography.
  mocks/          Dados imutáveis em runtime (clonados ao inicializar).

supabase/
  schema.sql      Tabelas, RLS, triggers, policies.
  seed.sql        Cenário inicial dos 3 demos + reset antes da banca.
  reset_logs.sql  Reset rápido só dos logs de hoje (uso pontual).
  README.md       Passo a passo do backend.
```

Regras arquiteturais detalhadas (o que cada camada pode/não pode
importar, convenções de domínio em inglês vs. UI em PT-BR) estão no
[`CLAUDE.md`](./CLAUDE.md).

---

## Convenções de UI/UX

- Corpo ≥ 18 px; títulos 24–32 px.
- Tap target primário ≥ 56 px; secundário ≥ 44 px.
- **Sem ícones nem animações** nesta fase.
- Status comunicado por **texto + cor**, nunca apenas cor.
- Linguagem PT-BR coloquial; sem jargão clínico ou termos avaliativos
  ("adesão", "cumprimento", "falha").
- Sem dark mode na v1.

Mudanças de UI devem justificar decisões em termos de heurísticas de
Nielsen e/ou SUS — registro vai em [`interacao.md`](./interacao.md).

---

## Limitações conscientes (registradas no texto do TCC)

- Sem testes automatizados nesta fase.
- Sem notificações locais ou push.
- Sem expo-router (React Navigation native-stack escolhido).
- Sem dark mode na v1.
- Histórico limitado aos últimos 7 dias; sem navegação entre semanas
  nem gráfico complexo.
- Cenário demo restrito a 3 personas; sem cadastro pelo app.

---

## Aviso sobre dados

Todos os dados deste repositório são **fictícios** e têm finalidade
**exclusivamente acadêmica**. O domínio `.test` usado nos emails é
reservado pela IETF (RFC 2606) — nunca vira email real.
