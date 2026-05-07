# CLAUDE.md

## Contexto do projeto

Trabalho de Conclusão de Curso (TCC) em Ciência da Computação na UFRGS — estudo
exploratório sobre o uso de Claude no desenvolvimento e avaliação de uma
interface mHealth. Artefato prático: app mobile de gestão de medicamentos para
tratamentos de média e longa duração, no contexto do projeto Takere.

A interface será avaliada por:
- avaliação heurística (heurísticas de Nielsen);
- testes com participantes + SUS (System Usability Scale).

Um dos avaliadores é da área de IHC, então UI/UX precisa ser bem cuidada.

**Não é sistema clínico, não é ferramenta de decisão médica.** Nunca implementar
prescrição, recomendação clínica, validação de dosagem, alteração de tratamento
nem usar dados reais de saúde. A ação do usuário representa apenas registro
pessoal, não validação médica.

## Persona e padrões de UI/UX

Persona principal da v1: Maria Silva, 68 anos, baixa familiaridade tecnológica.

- Fonte do corpo ≥ 18 px; títulos 24–32 px.
- Tap target primário: altura mínima 56 px. Secundário / link: 44 px.
- **Sem ícones** nesta fase (escolha consciente para evitar dependência de lib).
- **Sem animações** nesta fase.
- Status comunicado sempre por **texto + cor**, nunca apenas cor.
- Tom em PT-BR coloquial; sem jargão técnico ou clínico.
- Espaçamento generoso entre blocos (`gap: spacing.md` no `ScreenContainer`).
- Transmitir calma, clareza e confiança — sem infantilizar o design.

Em mudanças de UI, explicar as decisões de UX e ligá-las a Nielsen / SUS.

## Regras arquiteturais

- `src/screens/` — não importam de `mocks/` nem contêm regra de negócio; só
  consomem hooks.
- `src/services/` — **puros**: recebem dados como argumento, não leem mocks
  diretamente.
- `src/hooks/` — ponte entre screen e service; detêm estado em memória.
- `src/mocks/` — **imutáveis em runtime**; clonar ao inicializar e mutar a cópia.
- `src/adapters/` — único lugar autorizado a importar `expo-*`. Screens e
  components **não** podem importar `expo-*`.
- Domínio e identificadores em **inglês**; textos visíveis ao usuário em
  **português**.
- View-models (ex.: `TodayMedicationView`) co-localizados no service que os
  produz e exportados de lá.
- Não adicionar bibliotecas sem justificativa registrada.

## Fora de escopo nesta fase

Não implementar a menos que o usuário peça explicitamente:

- backend / API real
- AsyncStorage / persistência
- login / autenticação
- notificações locais ou push
- expo-router
- novas telas espontâneas
- prescrição, recomendação clínica ou qualquer lógica clínica

## Convenções de resposta esperadas

Em respostas substantivas (qualquer mudança de código não-trivial):

1. Listar arquivos criados/modificados.
2. Para mudanças de UI: explicar decisões de UX e ligar a Nielsen / SUS.
3. Incluir **checklist de teste local** quando o comportamento muda.
4. Incluir seção **"Registro para o TCC"** com:
   - Categoria da interação (ideação, arquitetura, geração de código,
     refatoração, bug, design, etc.).
   - O que foi sugerido / gerado.
   - O que provavelmente exigirá revisão humana.
   - Riscos ou limitações da solução.

Perguntas curtas e tasks triviais não precisam de "Registro para o TCC".

## Notas operacionais

- Stack: Expo SDK 54, React Native 0.81.x, React 19, TypeScript estrito,
  React Navigation v7 (native-stack).
- `npm install` precisa de `--legacy-peer-deps` (conflito benigno transitivo
  envolvendo `@types/react`).
- Após qualquer mudança em versões: `npx expo install --fix`.
- `package-lock.json` vai para o git. Ignorados: `node_modules/`, `.expo/`,
  `android/`, `ios/`, `dist/`.
- O registro de cada interação relevante para o TCC fica em `interacao.md`
  (preenchido manualmente; Claude pode propor texto, mas não deve editar
  esse arquivo sem ser solicitado).

## Decisões já tomadas (não re-debater sem motivo)

- React Navigation native-stack — Expo Router descartado.
- date-fns — moment descartado.
- Paleta primária teal-700; status em pares bg-claro / text-escuro
  (amber, green, red) com contraste AA garantido.
- Cards com borda + sombra discreta, `radius.lg` (16), `padding: spacing.lg`
  (24).
- "Próximo medicamento" prioriza `late` antes de `pending`.
- Paciente atual fixa (Maria Silva) via `currentPatient` em
  `patients.mock.ts` — stand-in para uma futura camada de sessão.
- Sem dark mode na v1.
- Sem testes automatizados nesta fase (limitação consciente, registrar no
  texto do TCC).
