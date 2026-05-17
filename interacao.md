# Registro de Desenvolvimento — TCC

## Sessão 01 — 07/05/2026

**Objetivo da sessão:**  
Definir a arquitetura inicial do app mobile mHealth de gestão de medicamentos usando React Native, TypeScript e Expo com baixo acoplamento.

**Tempo aproximado:**  
Preencher depois.

**O que foi feito:**  
- Definição inicial da arquitetura de pastas.
- Definição das principais dependências.
- Definição de dependências a evitar para reduzir acoplamento ao Expo.
- Definição inicial dos tipos de domínio.
- Definição do fluxo inicial de telas.
- Decisão inicial de usar paciente mockado fixo: Maria Silva.

---

### Interação C01

**Categoria:**  
Ideação + Arquitetura

**Tela ou funcionalidade:**  
Arquitetura geral do aplicativo e fluxo inicial de medicamentos.

**Objetivo do prompt:**  
Solicitar a Claude uma proposta inicial de arquitetura para uma interface mobile mHealth de gestão de medicamentos, usando React Native + TypeScript + Expo com baixo acoplamento ao Expo.

**Prompt enviado:**  
Prompt inicial completo sobre o TCC, requisitos de arquitetura, funcionalidades iniciais, restrições e pedido para começar pela arquitetura inicial e plano de implementação.

**Resumo da resposta do Claude:**  
Claude propôs uma estrutura de pastas separando adapters, components, domain, hooks, mocks, navigation, screens, services, theme e utils. Também sugeriu dependências mínimas, como React Navigation e date-fns, explicou quais dependências Expo evitar diretamente nas telas, definiu tipos iniciais do domínio e propôs um fluxo com Home, lista de medicamentos, detalhe do medicamento e histórico. Também recomendou iniciar com a paciente mockada Maria Silva como paciente fixo.

**Decisão tomada:**  
Aceito com pequenas alterações.

**Utilidade percebida:**  
5

**Retrabalho:**  
Baixo

**Problema ou limitação:**  
A proposta ainda não gera código funcional. Algumas decisões precisam ser revisadas durante o desenvolvimento, como se o status “atrasado” será calculado dinamicamente ou persistido, e se o seletor de paciente entrará no MVP.

**Evidência:**  
Registro da resposta de Claude na sessão inicial; próxima etapa será geração de package.json, tsconfig.json, App.tsx e tipos de domínio.

---

### Interação C02

**Categoria:**  
Geração de código / Scaffolding inicial

**Tela ou funcionalidade:**  
Base inicial do aplicativo, navegação mínima e HomeScreen placeholder.

**Objetivo do prompt:**  
Solicitar a geração da estrutura inicial do projeto React Native + TypeScript com Expo, React Navigation, paciente fixo Maria Silva e tipos principais de domínio, sem ainda implementar funcionalidades completas.

**Prompt enviado:**  
Foi solicitado que Claude seguisse com a opção (a), usando paciente fixo Maria Silva, e gerasse apenas a base inicial do projeto: package.json, tsconfig.json, babel.config.js, App.tsx, RootNavigator, routes, tipos de domínio, mock da paciente e HomeScreen placeholder.

**Resumo da resposta do Claude:**  
Claude gerou a estrutura inicial do projeto com App.tsx, app.json, babel.config.js, package.json, tsconfig.json e a pasta src contendo domain, mocks, navigation e screens. Foram criados os tipos MedicationStatus, TechFamiliarity, Patient, Medication, MedicationSchedule, MedicationLog, o mock da paciente Maria Silva, a navegação inicial com Native Stack e uma HomeScreen mínima para validar que o app abre.

**Decisão tomada:**  
Aceito com pequenas alterações.

**Utilidade percebida:**  
5

**Retrabalho:**  
Baixo

**Problema ou limitação:**  
A HomeScreen ainda importa o mock diretamente, o que viola parcialmente a decisão arquitetural de que telas não devem acessar mocks diretamente. Isso é aceitável como placeholder inicial, mas deve ser corrigido antes das telas funcionais por meio de um PatientService ou hook. A solução também ainda não possui testes, lint, aliases de importação, .gitignore revisado ou adapters reais para recursos de plataforma.

**Evidência:**  
Arquivos iniciais gerados: App.tsx, app.json, babel.config.js, package.json, tsconfig.json, src/navigation/RootNavigator.tsx, src/navigation/routes.ts, src/screens/HomeScreen.tsx, src/mocks/patients.mock.ts e arquivos de domínio em src/domain.

**Outras consideracoes:**
tive que ficar instalando umas coisas e tentando fazer rodar o projeto pra testar local. nao funciona direto 

---

### Interação C03

**Categoria:**  
Bug / Configuração de ambiente

**Tela ou funcionalidade:**  
Execução local inicial do projeto Expo.

**Objetivo do prompt:**  
Resolver erro ao iniciar o projeto localmente com `npm run start`.

**Prompt enviado:**  
Foi enviado o erro: “The required package `expo-asset` cannot be found”.

**Resumo da resposta do Claude/assistente:**  
Foi identificado que o ambiente Expo/Metro exigia o pacote `expo-asset`, que não estava instalado no projeto. A solução sugerida foi instalar o pacote com `npx expo install expo-asset` e reiniciar o Expo limpando o cache.

**Decisão tomada:**  
Aceito com pequenas alterações.

**Utilidade percebida:**  
Preencher depois, de 1 a 5.

**Retrabalho:**  
Baixo

**Problema ou limitação:**  
O erro foi causado por dependência ausente/incompatível no scaffolding inicial. Também permanece a necessidade de verificar se as versões do Expo e das dependências estão alinhadas.

**Evidência:**  
Erro no terminal ao executar `npm run start`; instalação de `expo-asset`; app iniciado novamente com `npx expo start --clear`.

**Extra:**
tive que ficar fazendo uns prompts a mais pq mesmo assim nao funcionou, versao incompativel do SDK, outros erros, etc  

---

### Interação C04

**Categoria:**  
Design visual / Geração de código / Arquitetura de interface

**Tela ou funcionalidade:**  
Base visual do aplicativo e evolução inicial da HomeScreen.

**Objetivo do prompt:**  
Solicitar a criação de uma fundação visual consistente para o app, com tema, componentes reutilizáveis e uma HomeScreen mais clara, acessível e adequada para avaliação futura com heurísticas de Nielsen e SUS.

**Prompt enviado:**  
Foi solicitado que Claude evoluísse o projeto com foco em UI/UX, clareza visual, consistência e boa usabilidade, considerando a paciente Maria Silva, 68 anos, com baixa familiaridade tecnológica. O pedido incluía a criação de arquivos de tema, componentes reutilizáveis e atualização da HomeScreen com saudação, resumo do dia, card de próximo medicamento e lista simples de medicamentos de hoje.

**Resumo da resposta do Claude:**  
Claude criou uma base visual em `src/theme`, incluindo paleta de cores, escala de espaçamento, tipografia, raio de borda e arquivo agregador. Também criou componentes reutilizáveis em `src/components`, como `ScreenContainer`, `AppHeader`, `Card`, `SectionTitle`, `PrimaryButton` e `StatusBadge`. Além disso, adicionou `medications.mock.ts` para alimentar a HomeScreen e atualizou `RootNavigator.tsx` para esconder o cabeçalho padrão da stack, evitando duplicidade com o `AppHeader`.

A HomeScreen foi atualizada para apresentar uma sequência visual mais clara: saudação, resumo do dia, próximo medicamento em destaque e lista simples de medicamentos de hoje. A resposta também justificou decisões de UI/UX, como uso de fonte maior, botões com altura mínima adequada para toque, contraste elevado, status representados por cor e texto, ausência inicial de ícones, ausência de animações e foco em uma interface previsível para usuários idosos.

**Decisão tomada:**  
Aceito com pequenas alterações.

**Utilidade percebida:**  
5

**Retrabalho:**  
Baixo

**Problema ou limitação:**  
A solução melhorou significativamente a base visual, mas ainda usa dados mockados simples e pré-resolvidos para alimentar a HomeScreen. A lógica de medicamentos ainda não está organizada em uma camada de service, e a ação de “Marcar como tomado” ainda não foi implementada de forma funcional. A ausência de ícones e animações foi uma decisão consciente para reduzir complexidade, mas poderá ser revista posteriormente caso a interface precise de mais apoio visual. Também será necessário revisar manualmente se as cores, espaçamentos e textos realmente funcionam bem em dispositivos reais e com participantes.

**Evidência:**  
Arquivos criados ou modificados:
- `src/theme/colors.ts`
- `src/theme/spacing.ts`
- `src/theme/typography.ts`
- `src/theme/radius.ts`
- `src/theme/index.ts`
- `src/components/ScreenContainer.tsx`
- `src/components/AppHeader.tsx`
- `src/components/Card.tsx`
- `src/components/SectionTitle.tsx`
- `src/components/PrimaryButton.tsx`
- `src/components/StatusBadge.tsx`
- `src/mocks/medications.mock.ts`
- `src/screens/HomeScreen.tsx`
- `src/navigation/RootNavigator.tsx`

---

### Interação C05

**Categoria:**  
Design visual / Geração de código / Arquitetura / Refatoração

**Tela ou funcionalidade:**  
Dashboard inicial de medicamentos do dia na HomeScreen.

**Objetivo do prompt:**  
Transformar a HomeScreen em uma tela inicial mais completa, bonita e consistente, com foco em UI/UX, organização dos medicamentos do dia, dados mockados estruturados, service, hook e componentes reutilizáveis.

**Prompt enviado:**  
Foi solicitado que Claude evoluísse a HomeScreen para parecer mais próxima de uma interface real de gestão de medicamentos, adequada para avaliação futura com heurísticas de Nielsen e SUS. O pedido incluía organizar mocks de medicamentos, horários e registros; criar `MedicationService`; criar `useTodayMedications`; criar componentes visuais específicos; e atualizar a HomeScreen sem adicionar backend, persistência, bibliotecas novas ou regras clínicas.

**Resumo da resposta do Claude:**  
Claude reorganizou os dados mockados em três arquivos separados: `medications.mock.ts`, `medicationSchedules.mock.ts` e `medicationLogs.mock.ts`. Também criou `MedicationService.ts`, responsável por combinar os mocks e gerar dados preparados para a interface, como medicamentos do dia, próximo medicamento e resumo diário. Foi criado o hook `useTodayMedications.ts` para servir como ponte entre a HomeScreen e a camada de dados, evitando que a tela acesse mocks diretamente.

Além disso, Claude criou componentes específicos para a tela inicial: `MedicationSummaryCard`, `NextMedicationCard`, `MedicationListItem` e `StatusLegend`. A HomeScreen foi reorganizada em uma sequência mais clara: saudação, próximo medicamento em destaque, resumo do dia, lista de medicamentos de hoje, legenda de status e ação secundária. A resposta também explicou decisões de UI/UX relacionadas a hierarquia visual, legibilidade, espaçamento, destaque do próximo medicamento, uso de status com texto e cor, e adequação às heurísticas de Nielsen e ao SUS.

**Decisão tomada:**  
Aceito com pequenas alterações.

**Utilidade percebida:**  
5

**Retrabalho:**  
Baixo

**Problema ou limitação:**  
A tela ficou visualmente mais completa e melhor organizada, mas a ação “Marcar como tomado” ainda não altera o estado da aplicação, apenas exibe um alerta. Isso pode ser uma limitação importante antes da avaliação com usuários, pois botões sem efeito real podem prejudicar a percepção de utilidade e confiança. A regra que prioriza medicamentos atrasados como “próximo medicamento” também precisa ser validada, pois pode ser adequada do ponto de vista de organização, mas talvez gere ansiedade em usuários idosos. Além disso, o hook ainda usa dados derivados de mocks estáticos, sem persistência ou atualização dinâmica.

**Evidência:**  
Arquivos criados:
- `src/mocks/medicationSchedules.mock.ts`
- `src/mocks/medicationLogs.mock.ts`
- `src/services/MedicationService.ts`
- `src/hooks/useTodayMedications.ts`
- `src/components/MedicationSummaryCard.tsx`
- `src/components/NextMedicationCard.tsx`
- `src/components/MedicationListItem.tsx`
- `src/components/StatusLegend.tsx`

Arquivos modificados:
- `src/mocks/medications.mock.ts`
- `src/mocks/patients.mock.ts`
- `src/components/SectionTitle.tsx`
- `src/components/AppHeader.tsx`
- `src/screens/HomeScreen.tsx`

**Observações para análise posterior no TCC:**  
Esta interação é relevante porque mostra o uso de Claude não apenas para gerar código, mas também para apoiar decisões de arquitetura e design de interface. A resposta conectou explicitamente decisões visuais com heurísticas de Nielsen, como visibilidade do estado do sistema, correspondência com o mundo real, consistência, reconhecimento em vez de memorização, estética minimalista e ajuda/documentação. Também relacionou escolhas da interface com possíveis impactos no SUS, especialmente em itens ligados à facilidade de uso, confiança e necessidade de suporte.

**Possíveis riscos ou limitações:**  
- A ausência de persistência limita a avaliação funcional da interface.
- A ação principal ainda não modifica o estado do medicamento.
- O uso de cores verde, amarelo e vermelho exige cuidado para não depender apenas da cor como forma de comunicação.
- A lista pode ficar extensa se houver muitos medicamentos, prejudicando a visibilidade da legenda e do resumo.
- A regra de priorizar medicamentos atrasados precisa ser validada do ponto de vista de experiência do usuário.
- A estrutura atual ainda depende de mocks e deverá ser adaptada futuramente para backend ou persistência local.

---

### Interação C07

**Categoria:**  
Geração de código / Interação funcional / UX feedback / Acessibilidade

**Tela ou funcionalidade:**  
Ação de marcar medicamento como tomado na HomeScreen.

**Objetivo do prompt:**  
Tornar funcional a ação principal da HomeScreen, permitindo que a usuária marque um medicamento como tomado, veja a atualização imediata da interface e tenha feedback claro sobre a ação realizada.

**Prompt enviado:**  
Foi solicitado que Claude implementasse a ação “Marcar como tomado” de forma local, em memória, sem backend e sem persistência. O pedido incluía atualizar o status do medicamento, recalcular o próximo medicamento, atualizar o resumo do dia, atualizar a lista de medicamentos, registrar `takenAt`, exibir feedback visual claro e, se possível, permitir desfazer a última ação.

**Resumo da resposta do Claude:**  
Claude modificou a lógica da aplicação para que o estado dos registros de medicamentos seja mantido em memória no hook `useTodayMedications`. O `MedicationService` passou a receber os logs como parâmetro, tornando-se uma função pura que monta o dashboard a partir dos dados atuais. A HomeScreen passou a consumir o hook estendido e a renderizar um novo componente `FeedbackBanner` quando um medicamento é marcado como tomado.

A ação “Marcar como tomado” agora atualiza o status do medicamento para `taken`, registra `takenAt` com a data/hora atual, recalcula o resumo diário, atualiza o próximo medicamento em destaque e altera o status do item correspondente na lista. Também foi implementado um mecanismo simples de “Desfazer” para a última ação, disponível por 6 segundos no banner de feedback.

Além disso, Claude criou um `FeedbackBanner` acessível, com mensagem textual, cor consistente com o status “Tomado” e suporte a leitores de tela por meio de `AccessibilityInfo.announceForAccessibility`, `accessibilityRole="alert"` e `accessibilityLiveRegion="polite"`.

**Decisão tomada:**  
Aceito com pequenas alterações.

**Utilidade percebida:**  
5

**Retrabalho:**  
Baixo

**Problema ou limitação:**  
A ação agora funciona corretamente em memória, mas ainda não possui persistência. Ao recarregar o app, o estado volta aos mocks iniciais, o que é adequado para esta fase, mas precisa ser registrado como limitação. O mecanismo de desfazer cobre apenas a última ação realizada, o que simplifica a implementação, mas pode ser insuficiente em fluxos mais complexos. A ação de marcar como tomado existe apenas no card de próximo medicamento, e não em cada item da lista, o que reduz risco de erro, mas limita a flexibilidade da usuária.

**Evidência:**  
Arquivos modificados:
- `src/services/MedicationService.ts`
- `src/hooks/useTodayMedications.ts`
- `src/components/NextMedicationCard.tsx`
- `src/screens/HomeScreen.tsx`

Arquivo criado:
- `src/components/FeedbackBanner.tsx`

**Checklist de validação local:**  
- `npm run typecheck` passa sem erros.
- `npm run start` abre o Metro sem erro.
- O app abre no Expo Go.
- O estado inicial mostra Losartana como próximo medicamento atrasado.
- Ao tocar em “Marcar como tomado”, aparece o banner de confirmação.
- O próximo medicamento em destaque muda.
- O resumo do dia é atualizado.
- O item correspondente na lista muda para “Tomado”.
- Ao tocar em “Desfazer” dentro de 6 segundos, o estado anterior é restaurado.
- Se a usuária não tocar em “Desfazer”, o banner desaparece e o estado permanece atualizado.
- Ao recarregar o app, os dados voltam ao estado inicial dos mocks.
- Em VoiceOver/TalkBack, o banner é anunciado quando aparece.

**Observações para análise posterior no TCC:**  
Esta interação é importante porque transforma a interface de uma visualização estática em uma interface interativa. A ação implementada contribui diretamente para a heurística de visibilidade do estado do sistema, pois a interface responde imediatamente após o toque. Também contribui para controle e liberdade do usuário, pela presença da opção “Desfazer”, e para prevenção/recuperação de erros, já que a usuária pode corrigir rapidamente uma ação equivocada.

Do ponto de vista do SUS, a funcionalidade pode contribuir para maior percepção de facilidade de uso, integração das funções e confiança, pois a ação principal produz uma resposta clara, previsível e reversível.

**Possíveis riscos ou limitações:**  
- A ausência de persistência impede que o registro sobreviva ao fechamento ou recarregamento do app.
- O botão “Marcar como tomado” aparece apenas no medicamento em destaque.
- O desfazer é limitado à última ação e expira após 6 segundos.
- O feedback depende de leitura do banner, embora também seja reforçado por mudança visual no resumo, card e lista.
- Antes da avaliação com usuários, será necessário decidir se a ausência de persistência é aceitável ou se deve ser implementado ao menos armazenamento local simples.

---

### Interação C08

**Categoria:**  
Refatoração arquitetural / Estado compartilhado / Organização de camadas

**Tela ou funcionalidade:**  
Centralização do estado dos medicamentos para uso compartilhado entre telas futuras.

**Objetivo do prompt:**  
Criar uma camada de estado compartilhado para os registros de medicamentos, evitando que o estado ficasse isolado no hook `useTodayMedications` e preparando o app para futuras telas como lista de medicamentos, detalhe do medicamento e histórico.

**Prompt enviado:**  
Foi solicitado que Claude criasse um `MedicationProvider` com Context API para centralizar os logs de medicamentos, a ação de marcar como tomado, a opção de desfazer, o feedback temporário e o estado `lastTaken`. Também foi solicitado que `useTodayMedications` passasse a consumir esse provider, mantendo o `MedicationService` como camada pura de derivação dos dados e preservando o comportamento atual da HomeScreen.

**Resumo da resposta do Claude:**  
Claude criou o arquivo `src/contexts/MedicationProvider.tsx`, centralizando o estado mutável dos medicamentos em memória. O provider inicializa os logs a partir dos mocks, mantém os registros em estado local, expõe `logs`, `markAsTaken`, `undoLastTaken`, `dismissFeedback` e `lastTaken`, além de controlar o timer do feedback e a referência da última ação para desfazer.

O hook `useTodayMedications` foi refatorado para deixar de manter estado próprio. Ele passou a consumir o `MedicationProvider` e a usar o `MedicationService` apenas para derivar o dashboard com base nos logs atuais. O `App.tsx` foi atualizado para envolver a navegação com o `MedicationProvider`, mantendo a estrutura com `SafeAreaProvider`, `NavigationContainer` e `RootNavigator`.

A `HomeScreen` não foi alterada, pois a interface pública do hook foi mantida. Isso indica que a refatoração ficou bem encapsulada e preservou o contrato usado pela camada de UI.

**Decisão tomada:**  
Aceito com pequenas alterações.

**Utilidade percebida:**  
5

**Retrabalho:**  
Baixo

**Problema ou limitação:**  
A solução melhora a arquitetura e prepara o app para múltiplas telas, mas o estado ainda é mantido apenas em memória. Ao recarregar o app, os dados voltam ao estado inicial dos mocks. Isso é aceitável nesta fase, mas precisa ser registrado como limitação antes da avaliação com participantes. Também será necessário revisar futuramente se a Context API continuará suficiente caso o app cresça ou tenha histórico mais extenso.

**Evidência:**  
Arquivo criado:
- `src/contexts/MedicationProvider.tsx`

Arquivos modificados:
- `src/hooks/useTodayMedications.ts`
- `App.tsx`

A `HomeScreen` foi mantida sem alterações, demonstrando que a refatoração não exigiu mudanças na camada de apresentação.

**Checklist de validação local:**  
- `npm run typecheck` passa sem erros.
- `npm run start` abre o Metro sem erro.
- O app abre no Expo Go sem tela vermelha.
- O estado inicial continua igual ao anterior.
- O card principal mostra o medicamento atrasado inicial.
- Ao tocar em “Marcar como tomado”, o banner aparece.
- O próximo medicamento é atualizado.
- O resumo do dia é atualizado.
- O item correspondente na lista muda para “Tomado”.
- Ao tocar em “Desfazer” antes de 6 segundos, o estado anterior é restaurado.
- Ao aguardar 6 segundos, o banner desaparece e o estado permanece atualizado.
- Ao recarregar o app, os dados voltam ao estado inicial dos mocks.
- O console não mostra warnings relevantes de React.

**Observações para análise posterior no TCC:**  
Esta interação é relevante porque mostra o uso de Claude para apoiar uma decisão arquitetural, não apenas para gerar interface visual. A centralização do estado evita que diferentes telas tenham versões divergentes dos mesmos dados, o que é importante para a consistência da experiência do usuário.

Do ponto de vista das heurísticas de Nielsen, essa mudança contribui principalmente para consistência e padrões, visibilidade do estado do sistema e prevenção de erros. Se a usuária marcar um medicamento como tomado na Home e depois acessar uma futura tela de detalhe ou histórico, o app deverá apresentar o mesmo estado em todas as telas.

Do ponto de vista do SUS, a refatoração pode contribuir para a percepção de integração entre as funções do sistema, redução de inconsistências e aumento da confiança no uso.

**Possíveis riscos ou limitações:**  
- O estado ainda é apenas em memória e é perdido ao recarregar o app.
- A Context API pode gerar re-renderizações desnecessárias se o app crescer muito, embora seja adequada para o escopo atual.
- O timer de feedback fica no provider e pode ter comportamento diferente se o app for colocado em segundo plano.
- Futuramente, pode ser necessário separar melhor responsabilidades, como mover `findMedicationName` para um utilitário ou service.
- Caso o histórico cresça ou a aplicação passe a ter mais telas, talvez seja necessário avaliar outra estratégia de estado, embora isso não seja necessário nesta fase.

---

### Interação C09

**Categoria:**  
Geração de código / Nova tela / Navegação / UI/UX

**Tela ou funcionalidade:**  
Tela de lista completa dos medicamentos do dia.

**Objetivo do prompt:**  
Criar uma tela com a lista completa dos medicamentos de hoje, com filtros por status, navegação a partir da HomeScreen e integração com o estado compartilhado dos medicamentos.

**Prompt enviado:**  
Foi solicitado que Claude criasse a `MedicationListScreen`, mantendo consistência visual com a HomeScreen e usando o mesmo estado compartilhado do `MedicationProvider`. O pedido incluía lista completa dos medicamentos do dia, filtros por status, legenda, estado vazio amigável, atualização da navegação e conexão do botão “Ver todos os medicamentos” da Home com a nova tela.

**Resumo da resposta do Claude:**  
Claude criou a tela `MedicationListScreen`, que exibe o resumo dos medicamentos do dia, filtros por status, lista filtrada e legenda dos status. Também criou o hook `useMedicationList`, responsável por consumir o estado compartilhado via `MedicationProvider`, derivar os dados com `MedicationService` e aplicar o filtro selecionado. Foi criado o componente `StatusFilterTabs`, funcionando como um controle segmentado com as opções Todos, Pendentes, Tomados e Atrasados.

A navegação foi atualizada com a rota `MedicationList` em `routes.ts` e o registro da tela em `RootNavigator.tsx`. Também foi criado o hook `useAppNavigation`, para centralizar a navegação tipada. A `HomeScreen` foi modificada para que o botão “Ver todos os medicamentos” navegue para a nova tela, substituindo o comportamento anterior de `Alert`.

O `AppHeader` também foi ajustado para aceitar uma prop opcional `onBack`, permitindo exibir um botão textual “← Voltar”, mais claro e acessível para a persona Maria Silva.

**Decisão tomada:**  
Aceito com pequenas alterações.

**Utilidade percebida:**  
5

**Retrabalho:**  
Baixo

**Problema ou limitação:**  
A tela de lista foi implementada apenas como leitura, sem permitir marcar medicamentos como tomados diretamente nos itens. Essa decisão reduz carga cognitiva e evita toques acidentais, mas pode limitar a eficiência de usuários que esperam realizar ações diretamente na lista. Também será necessário avaliar se quatro filtros em uma única linha funcionam bem em telas pequenas. Além disso, a lista mostra apenas os medicamentos do dia, não um catálogo completo de medicamentos do paciente.

**Evidência:**  
Arquivos criados:
- `src/screens/MedicationListScreen.tsx`
- `src/hooks/useMedicationList.ts`
- `src/components/StatusFilterTabs.tsx`
- `src/navigation/useAppNavigation.ts`

Arquivos modificados:
- `src/navigation/routes.ts`
- `src/navigation/RootNavigator.tsx`
- `src/components/AppHeader.tsx`
- `src/screens/HomeScreen.tsx`

**Checklist de validação local:**  
- `npm run typecheck` passa sem erros.
- `npm run start` abre o Metro sem erro.
- A HomeScreen abre normalmente.
- O botão “Ver todos os medicamentos” navega para a lista.
- A tela mostra o título “Medicamentos de hoje”.
- O botão “← Voltar” funciona e retorna para a Home.
- O filtro “Todos” mostra os 4 medicamentos do dia.
- O filtro “Pendentes” mostra apenas os medicamentos pendentes.
- O filtro “Tomados” mostra apenas os medicamentos tomados.
- O filtro “Atrasados” mostra apenas os medicamentos atrasados.
- O resumo do dia permanece estável ao trocar de filtro.
- Depois de marcar um medicamento como tomado na Home, a lista reflete o estado atualizado.
- Quando um filtro não possui resultados, aparece um estado vazio amigável.
- Os status continuam sendo apresentados com texto e cor.
- O console não apresenta warnings relevantes.

**Observações para análise posterior no TCC:**  
Esta interação é relevante porque expande o app de uma única tela para um fluxo navegável, mantendo consistência visual e compartilhamento de estado. A criação da `MedicationListScreen` permite que tarefas de avaliação com usuários sejam mais realistas, como localizar medicamentos pendentes, verificar medicamentos tomados e compreender status do dia.

Do ponto de vista das heurísticas de Nielsen, a tela contribui para visibilidade do estado do sistema, consistência e padrões, controle e liberdade do usuário, reconhecimento em vez de memorização e estética minimalista. O botão textual “Voltar” e os filtros simples também favorecem clareza e previsibilidade.

Do ponto de vista do SUS, a tela pode contribuir para a percepção de integração entre as funções, facilidade de uso e confiança, pois o estado visto na Home é refletido corretamente na lista.

**Possíveis riscos ou limitações:**  
- A lista é apenas de medicamentos do dia, não de todos os medicamentos cadastrados do paciente.
- Os itens da lista ainda não navegam para uma tela de detalhe.
- A tela não permite marcar medicamento como tomado diretamente na lista.
- Quatro filtros em uma única linha podem ficar apertados em telas menores.
- O filtro selecionado não é persistido ao sair/reabrir o app.
- A escolha de `accessibilityRole="tab"` nos filtros pode precisar ser revisada caso se queira uma semântica mais próxima de radio buttons.

**OBS:**
Isso aqui eu fiz uma interacoes pra ver a melhor forma de fazer isso. Eu mesma sugeri usar os botoes ja disponiveis com numero de "Tomados" etc como forma de clicar e ver as opcoes

---

### Interação C11

**Categoria:**  
Geração de código / Nova tela / Arquitetura / Design de UI/UX

**Tela ou funcionalidade:**  
Tela de histórico de hoje.

**Objetivo do prompt:**  
Criar uma tela simples de histórico para que a usuária consiga visualizar os medicamentos registrados como tomados, mantendo consistência visual com HomeScreen, MedicationListScreen e MedicationDetailScreen, e usando o estado compartilhado do aplicativo.

**Prompt enviado:**  
Foi solicitado que Claude criasse a `HistoryScreen`, com lista de medicamentos registrados como tomados, horário previsto, horário de registro, status, estado vazio amigável e navegação a partir da HomeScreen. Também foi pedido que a tela consumisse o estado compartilhado via hook/service, sem acessar mocks diretamente, sem implementar backend, persistência, notificações ou funcionalidades clínicas.

**Resumo da resposta do Claude:**  
Claude criou a tela `HistoryScreen` e o hook `useMedicationHistory`. Também modificou o `MedicationService` para adicionar os tipos `HistoryEntryView`, `MedicationHistoryView` e o método `getMedicationHistory(patientId, logs)`, responsável por derivar o histórico a partir dos logs atuais.

A navegação foi atualizada com a rota `History` em `routes.ts` e o registro da tela em `RootNavigator.tsx`. A HomeScreen passou a exibir o botão secundário “Ver histórico de hoje", permitindo acessar a nova tela.

A `HistoryScreen` mostra os medicamentos registrados como tomados, incluindo nome, dose, horário previsto, horário em que foi marcado como tomado e status. A tela também possui estado vazio amigável, botão “← Voltar” e usa linguagem simples, como “Histórico de hoje, “Horário previsto” e “Registrado às”, evitando termos clínicos como “prescrição”, “conduta” ou “adesão terapêutica”.

**Decisão tomada:**  
Aceito com pequenas alterações.

**Utilidade percebida:**  
5

**Retrabalho:**  
Baixo

**Problema ou limitação:**  
A tela de histórico funciona apenas com dados em memória e volta ao estado inicial dos mocks ao recarregar o app. Além disso, o histórico atual é apenas do dia, não multi-dia. Também será necessário validar se a ordenação por horário de registro mais recente primeiro é a mais compreensível para a persona Maria Silva, pois alguns usuários podem esperar ordem cronológica do dia.

**Evidência:**  
Arquivos criados:
- `src/screens/HistoryScreen.tsx`
- `src/hooks/useMedicationHistory.ts`

Arquivos modificados:
- `src/services/MedicationService.ts`
- `src/navigation/routes.ts`
- `src/navigation/RootNavigator.tsx`
- `src/screens/HomeScreen.tsx`

**Checklist de validação local:**  
- `npx expo start` sobe sem erros.
- A HomeScreen renderiza normalmente.
- O botão “Ver histórico de hoje aparece na Home.
- Ao tocar no botão, a `HistoryScreen` é aberta.
- O cabeçalho mostra “Histórico de hoje.
- O botão “← Voltar” retorna para a Home.
- O histórico inicial mostra os medicamentos já marcados como tomados nos mocks.
- Ao marcar um novo medicamento como tomado na Home ou na tela de detalhe, ele aparece no histórico.
- Ao desfazer uma tomada pelo `FeedbackBanner`, o item correspondente sai do histórico.
- A lista de medicamentos tomados aparece ordenada pelo horário de registro.
- A tela mostra estado vazio amigável quando não houver tomadas registradas.
- `npx tsc --noEmit` passa sem erros.

**Observações para análise posterior no TCC:**  
Esta interação é relevante porque completa uma parte importante do fluxo de uso: além de visualizar medicamentos e registrar tomadas, a usuária passa a conseguir consultar o que já foi registrado. Isso torna a interface mais próxima de um artefato avaliável, pois permite tarefas como verificar se um medicamento já foi tomado ou consultar o horário em que a tomada foi registrada.

Do ponto de vista das heurísticas de Nielsen, a tela contribui para visibilidade do estado do sistema, reconhecimento em vez de memorização, consistência e padrões, correspondência com o mundo real e design minimalista. A tela também reforça controle e previsibilidade, pois reflete imediatamente ações feitas em outras telas.

Do ponto de vista do SUS, a tela pode contribuir para percepção de integração entre funcionalidades, facilidade de uso e confiança, já que a usuária consegue verificar o resultado de suas ações em uma área específica de histórico.

**Possíveis riscos ou limitações:**  
- O histórico não é persistido após recarregar o app.
- O histórico mostra apenas registros do dia.
- A ordenação por registro mais recente primeiro pode precisar ser validada com usuários.
- O texto “Você registrou X medicamentos como tomados hoje” pode soar didático demais e talvez precise de ajuste após teste piloto.
- Dois botões secundários empilhados na Home podem deixar o final da tela um pouco carregado visualmente.
- Como o histórico só mostra medicamentos tomados, o `StatusBadge` “Tomado” é redundante, mas foi mantido para consistência visual e reforço textual.

---

### Interação C12

**Categoria:**  
Refatoração / Design visual / Polimento de UI/UX / Consistência de interface

**Tela ou funcionalidade:**  
Polimento visual geral e revisão de consistência entre HomeScreen, MedicationListScreen, MedicationDetailScreen e HistoryScreen.

**Objetivo do prompt:**  
Revisar a interface como um todo, identificando inconsistências visuais, problemas de microcopy, acessibilidade, estados vazios e pequenos pontos de UI/UX que pudessem prejudicar a avaliação futura com heurísticas de Nielsen e SUS.

**Prompt enviado:**  
Foi solicitado que Claude realizasse uma revisão geral de UI/UX e polimento visual do app, sem adicionar novas funcionalidades grandes. O pedido incluía revisar consistência entre telas, microcopy, acessibilidade, estados vazios, feedbacks, componentes reutilizáveis, HomeScreen, MedicationListScreen, MedicationDetailScreen e HistoryScreen.

**Resumo da resposta do Claude:**  
Claude criou o componente reutilizável `EmptyState`, centralizando a aparência e o comportamento dos estados vazios usados em diferentes telas. Também ajustou o `StatusFilterTabs`, aumentando a fonte dos filtros de 14 para 16, usando peso 600 e adicionando `adjustsFontSizeToFit` com `minimumFontScale={0.85}` para reduzir risco de truncamento em telas menores.

Na HomeScreen, Claude agrupou os dois botões secundários sob a seção “Mais opções”, melhorando a organização visual do rodapé e mantendo a ação principal “Marcar como tomado” como elemento dominante. Na MedicationListScreen, o subtítulo foi reescrito para “Toque em um medicamento para ver os detalhes.”, tornando mais clara a interação principal da tela. A tela também passou a usar o novo `EmptyState`. A HistoryScreen e a MedicationDetailScreen também foram ajustadas para reutilizar o `EmptyState`, reduzindo duplicação de estilos e aumentando a consistência visual.

A resposta também identificou pontos fracos, como estados vazios duplicados, fonte pequena nos filtros, subtítulo redundante na lista, botões secundários soltos na Home e risco de truncamento no filtro “Atrasados”.

**Decisão tomada:**  
Aceito com pequenas alterações.

**Utilidade percebida:**  
5

**Retrabalho:**  
Baixo

**Problema ou limitação:**  
As mudanças foram intencionalmente pequenas e seguras, sem alterar estrutura, navegação, provider ou lógica funcional. Ainda será necessário validar em dispositivos reais se o tamanho dos filtros é suficiente e se `adjustsFontSizeToFit` se comporta bem tanto em iOS quanto em Android. Também será necessário verificar com participantes se o texto “Mais opções” é claro o suficiente e se o subtítulo instrucional da lista não fica excessivamente didático após o primeiro uso.

**Evidência:**  
Arquivo criado:
- `src/components/EmptyState.tsx`

Arquivos modificados:
- `src/components/StatusFilterTabs.tsx`
- `src/screens/HomeScreen.tsx`
- `src/screens/MedicationListScreen.tsx`
- `src/screens/HistoryScreen.tsx`
- `src/screens/MedicationDetailScreen.tsx`

**Checklist de validação local:**  
- `npx expo start` sobe sem erros.
- A HomeScreen continua renderizando normalmente.
- O card do próximo medicamento continua sendo o elemento visualmente mais importante.
- A Home mostra a seção “Mais opções” acima dos botões secundários.
- O botão “Ver agenda completa de hoje” continua navegando para a lista.
- O botão “Ver histórico de hoje continua navegando para o histórico.
- A MedicationListScreen mostra o novo subtítulo “Toque em um medicamento para ver os detalhes.”.
- Os filtros aparecem maiores, em peso semibold, e não truncam em telas pequenas.
- Os estados vazios da lista, histórico e detalhe usam o mesmo padrão visual.
- A ação “Marcar como tomado” continua funcionando.
- O `FeedbackBanner` continua aparecendo e permitindo desfazer.
- O histórico continua refletindo as ações realizadas.
- Os botões “← Voltar” continuam funcionando nas telas internas.
- `npx tsc --noEmit` passa sem erros.

**Observações para análise posterior no TCC:**  
Esta interação é relevante porque representa uma etapa de refinamento da interface após a implementação do fluxo principal. Em vez de adicionar novas funcionalidades, Claude foi usado para revisar consistência visual, reduzir duplicação, melhorar legibilidade e ajustar textos da interface. Isso pode ser discutido no TCC como uso do LLM em uma etapa de polimento e avaliação preliminar de qualidade de interface.

Do ponto de vista das heurísticas de Nielsen, a interação contribui especialmente para consistência e padrões, design estético e minimalista, reconhecimento em vez de memorização, visibilidade do estado do sistema e ajuda/documentação. O componente `EmptyState`, por exemplo, evita que telas vazias sejam percebidas como erro ou travamento.

Do ponto de vista do SUS, as mudanças podem contribuir para percepção de facilidade de uso, redução de inconsistências, menor necessidade de suporte e menor sensação de complexidade.

**Possíveis riscos ou limitações:**  
- O texto “Mais opções” pode ser genérico demais e deve ser validado em teste piloto.
- A fonte de 16 px nos filtros pode ainda ser pequena para usuários com baixa visão.
- O subtítulo “Toque em um medicamento para ver os detalhes.” pode parecer instrucional demais depois do primeiro uso.
- `adjustsFontSizeToFit` pode se comportar de forma diferente entre iOS e Android.
- A etapa foi de polimento pequeno; problemas maiores de usabilidade ainda precisam ser identificados por revisão heurística ou teste com participantes.
- A ordenação do histórico e o comportamento da legenda/status ainda precisam ser validados com usuários.

---

### Interação C13

**Categoria:**  
Arquitetura / Backend / Autenticação / Persistência / Planejamento técnico

**Tela ou funcionalidade:**  
Definição da arquitetura de backend com login e persistência para o app mHealth.

**Objetivo do prompt:**  
Definir uma arquitetura mínima de backend para o TCC, com autenticação, persistência de dados e usuários fictícios, sem implementar código ainda. O objetivo foi planejar como migrar os mocks locais para um backend simples, mantendo o foco do trabalho na interface e na avaliação de usabilidade.

**Prompt enviado:**  
Foi solicitado que Claude propusesse uma arquitetura de backend simples, preferencialmente usando Supabase, com login, persistência de medicamentos, horários/agendamentos e registros de tomada. Também foi pedido que a solução contemplasse três usuários/pacientes fictícios — Maria Silva, Carlos Oliveira e Ana Souza — e que a migração dos mocks para backend fosse feita de forma incremental, preservando a separação entre telas, hooks, services, repositories, adapters e backend.

**Resumo da resposta do Claude:**  
Claude recomendou o uso do Supabase como backend gratuito/simples para o TCC, por oferecer Postgres, autenticação, Row Level Security, APIs e SDK em uma única plataforma, evitando a necessidade de criar e manter um backend próprio. A resposta justificou que essa escolha mantém o foco do TCC na interface e na avaliação de usabilidade, em vez de deslocar esforço para infraestrutura.

Foi proposta uma arquitetura baseada em repository pattern, na qual as telas continuam consumindo hooks e services sem saber se os dados vêm de mocks ou do Supabase. A estrutura sugerida inclui `supabaseClient` em `adapters`, `AuthProvider`, `MedicationProvider`, hooks de autenticação e paciente atual, repositories mockados e Supabase, além de uma `LoginScreen`.

Claude propôs quatro tabelas principais para o banco: `profiles`, `medications`, `medication_schedules` e `medication_logs`. Também sugeriu o uso de três usuários fictícios, com e-mails no domínio `.test`, representando diferentes idades e níveis de familiaridade tecnológica: Maria Silva, Carlos Oliveira e Ana Souza.

A resposta também detalhou uma estratégia de autenticação com `AuthProvider`, sessão ativa, login, logout, navegação condicional entre `AuthStack` e `AppStack`, além de isolamento dos dados por usuário usando Row Level Security. Por fim, Claude propôs um plano incremental de implementação dividido entre C14 e C20.

**Decisão tomada:**  
Aceito como plano arquitetural inicial.

**Utilidade percebida:**  
5

**Retrabalho:**  
Médio

**Problema ou limitação:**  
A proposta aumenta o escopo do projeto, pois adiciona autenticação, banco de dados, persistência, configuração de ambiente e segurança básica. Apesar disso, o backend foi considerado necessário porque o orientador indicou que login e persistência são obrigatórios. A solução ainda precisa ser implementada e validada, especialmente em relação às policies de Row Level Security, ao seed dos dados fictícios e à integração do estado atual do app com o backend.

**Evidência:**  
Não houve alteração de arquivos nesta etapa. A interação gerou uma proposta arquitetural com:
- escolha do Supabase como backend;
- sugestão de repository pattern;
- modelagem inicial de banco;
- estratégia de autenticação;
- três usuários demo;
- plano incremental C14–C20;
- cuidados de segurança e privacidade;
- texto sugerido para descrever o backend no TCC.

**Plano incremental sugerido:**  
- `C14` — Introduzir repository pattern ainda usando mocks.
- `C15` — Criar projeto Supabase, schema, RLS e seed dos três usuários demo.
- `C16` — Implementar autenticação no app com LoginScreen, AuthProvider e sessão.
- `C17` — Integrar leitura dos dados do Supabase.
- `C18` — Persistir “Marcar como tomado” e “Desfazer” no backend.
- `C19` — Adicionar estados de loading e erro.
- `C20` — Polimento, QA e documentação final do backend.

**Observações para análise posterior no TCC:**  
Esta interação é relevante porque marca a transição do app de uma interface baseada em mocks locais para uma implementação com backend simples e persistência. A decisão de usar Supabase pode ser justificada como uma solução BaaS adequada ao escopo acadêmico, permitindo autenticação e persistência sem exigir a criação de um backend próprio.

A proposta também preserva a arquitetura em camadas construída nas interações anteriores. O uso de repositories permite que as telas continuem agnósticas à origem dos dados, o que reduz retrabalho e ajuda a explicar a evolução arquitetural do projeto.

Do ponto de vista do TCC, o backend deve ser descrito como infraestrutura de apoio à persistência e à avaliação da interface, não como sistema clínico autônomo. Os dados usados serão fictícios e o sistema não realizará prescrição, recomendação médica, alteração de tratamento ou avaliação de eficácia clínica.

**Possíveis riscos ou limitações:**  
- O escopo cresce significativamente com login, autenticação, banco e persistência.
- A configuração incorreta de Row Level Security pode comprometer o isolamento entre usuários demo.
- O plano gratuito do Supabase pode ter limitações operacionais, como pausa por inatividade.
- O uso de `AsyncStorage` volta a ser necessário para persistência de sessão, apesar de ter sido evitado nas fases iniciais.
- A geração de logs do dia ainda precisa de decisão: on-demand no app ou via mecanismo no banco.
- A integração com backend pode introduzir estados de loading, erro e latência que ainda não existem na versão mockada.
- Será necessário documentar claramente que os usuários e dados são fictícios.

---

### Interação C14

**Categoria:**  
Arquitetura / Refatoração / Repository Pattern / Preparação para backend

**Tela ou funcionalidade:**  
Introdução da camada de repository para medicamentos usando os dados mockados atuais.

**Objetivo do prompt:**  
Preparar a arquitetura do app para uma futura integração com Supabase, criando uma camada de repository entre o `MedicationProvider` e a origem dos dados. O objetivo foi manter telas, hooks e componentes agnósticos à origem dos dados, preservando o comportamento atual do app.

**Prompt enviado:**  
Foi solicitado que Claude criasse uma interface `MedicationRepository` e uma implementação `MockMedicationRepository`, usando os mocks locais existentes. Também foi pedido que o `MedicationProvider` passasse a consumir o repository, deixando de acessar diretamente os mocks de medicamentos, agendamentos e logs. A etapa deveria preservar o comportamento visual e funcional existente, sem integrar Supabase, autenticação, AsyncStorage ou backend real.

**Resumo da resposta do Claude:**  
Claude criou a interface `MedicationRepository`, definindo operações como listar medicamentos, listar agendamentos, listar logs, marcar medicamento como tomado e restaurar um log anterior. Também criou `MockMedicationRepository`, uma implementação baseada nos mocks locais, com cópias internas dos dados para evitar mutação dos mocks originais.

O `MedicationService` foi refatorado para ficar mais puro: deixou de importar mocks diretamente e passou a receber um objeto `MedicationData`, contendo `logs`, `schedules` e `medications`. Os métodos públicos do service passaram a receber esses dados como argumento, mantendo a responsabilidade do service restrita à derivação de view-models.

O `MedicationProvider` foi atualizado para receber um `MedicationRepository`, usando `mockMedicationRepository` como padrão. Ele agora carrega medicamentos, agendamentos e logs por meio do repository, e as ações `markAsTaken` e `undoLastTaken` passam pelo repository. O context também passou a expor `medications` e `schedules`.

Os hooks `useTodayMedications`, `useMedicationList`, `useMedicationDetail` e `useMedicationHistory` foram ajustados para consumir `logs`, `schedules` e `medications` do context e repassar esses dados ao `MedicationService`. As telas, componentes, navegação e mocks não foram alterados.

**Decisão tomada:**  
Aceito com pequenas alterações.

**Utilidade percebida:**  
5

**Retrabalho:**  
Médio

**Problema ou limitação:**  
A refatoração não traz mudança visual imediata, mas prepara a arquitetura para o backend. A interface do repository ainda é síncrona, enquanto a futura implementação com Supabase será assíncrona, o que exigirá adaptação posterior no provider para lidar com `Promise`, `loading` e erros. Também permanece o uso de `currentPatient` como substituto temporário de sessão até a implementação de autenticação.

**Evidência:**  
Arquivos criados:
- `src/repositories/MedicationRepository.ts`
- `src/repositories/MockMedicationRepository.ts`

Arquivos modificados:
- `src/services/MedicationService.ts`
- `src/contexts/MedicationProvider.tsx`
- `src/hooks/useTodayMedications.ts`
- `src/hooks/useMedicationList.ts`
- `src/hooks/useMedicationDetail.ts`
- `src/hooks/useMedicationHistory.ts`

Arquivos não modificados intencionalmente:
- `HomeScreen`
- `MedicationListScreen`
- `MedicationDetailScreen`
- `HistoryScreen`
- componentes visuais
- navegação
- mocks locais

**Checklist de validação local:**  
- `npx expo start` sobe sem warnings novos.
- `npx tsc --noEmit` passa sem erros.
- A HomeScreen continua exibindo os quatro medicamentos do mock.
- O card “Próximo medicamento” continua mostrando Losartana como atrasada.
- O resumo continua mostrando 1 tomado, 2 pendentes e 1 atrasado no estado inicial.
- A ação “Marcar como tomado” continua funcionando.
- O banner de feedback continua aparecendo.
- A ação “Desfazer” continua restaurando o status anterior corretamente.
- A MedicationListScreen continua filtrando corretamente.
- A MedicationDetailScreen continua abrindo e exibindo os dados corretos.
- A HistoryScreen continua refletindo os medicamentos tomados.
- Não há imports diretos de `medicationsMock`, `medicationSchedulesMock` ou `medicationLogsMock` fora de `src/repositories/` ou `src/mocks/`, salvo exceções justificadas.
- O comportamento visual do app permanece igual ao anterior.

**Observações para análise posterior no TCC:**  
Esta interação é relevante porque introduz uma separação explícita entre a camada de apresentação e a origem dos dados. A partir desta etapa, os mocks deixam de ser apenas dados importados diretamente e passam a ser uma implementação temporária de repository. Isso fortalece a justificativa arquitetural da evolução do app, pois a futura integração com Supabase poderá ser feita substituindo a implementação do repository, sem reescrever telas e componentes.

A refatoração também melhora a pureza do `MedicationService`, que deixa de conhecer os mocks e passa a transformar dados recebidos em view-models para a interface. Essa separação ajuda a explicar, no TCC, a diferença entre domínio, derivação de dados para apresentação, estado da aplicação e persistência.

**Possíveis riscos ou limitações:**  
- A interface do repository ainda é síncrona, mas o Supabase exigirá operações assíncronas.
- A adaptação futura para backend exigirá estados de carregamento e erro.
- O `MockMedicationRepository` usa singleton, o que ajuda na simulação de persistência durante hot reload, mas pode causar diferenças em relação ao estado inicial esperado em alguns testes locais.
- O `currentPatient` ainda funciona como substituto temporário de sessão e precisará ser substituído por autenticação real.
- A integração com backend ainda não existe; esta etapa apenas prepara a arquitetura.

---

### Interação C15

**Categoria:**  
Backend / Banco de dados / Supabase / Segurança / Documentação

**Tela ou funcionalidade:**  
Criação do schema Supabase, seed dos usuários demo e documentação inicial do backend.

**Objetivo do prompt:**  
Criar os artefatos necessários para configurar o backend Supabase do projeto, incluindo tabelas, constraints, Row Level Security, seed de usuários fictícios e documentação de setup, sem ainda integrar o app React Native ao backend.

**Prompt enviado:**  
Foi solicitado que Claude gerasse os arquivos de configuração do Supabase para o backend do TCC, incluindo `schema.sql`, `seed.sql`, `supabase/README.md`, `.env.example` e sugestões de atualização do `.gitignore`. O pedido incluía modelagem para perfis, medicamentos, agendamentos e registros de tomada, além de dados fictícios para Maria Silva, Carlos Oliveira e Ana Souza.

**Resumo da resposta do Claude:**  
Claude criou os arquivos `supabase/schema.sql`, `supabase/seed.sql`, `supabase/README.md` e `.env.example`. Também modificou o `.gitignore` para reforçar o cuidado com variáveis de ambiente, chaves secretas e dumps do Supabase.

O `schema.sql` define quatro tabelas principais: `profiles`, `medications`, `medication_schedules` e `medication_logs`. A tabela `profiles` se relaciona com `auth.users`, enquanto medicamentos, agendamentos e logs se relacionam de forma encadeada. O schema inclui chaves primárias, chaves estrangeiras, checks de validade, `created_at`, `updated_at`, triggers para atualização automática de `updated_at`, além de Row Level Security em todas as tabelas.

Também foi criada uma constraint em `medication_logs` para garantir consistência entre `status` e `taken_at`: logs com status `taken` precisam ter `taken_at`, enquanto logs pendentes ou atrasados não devem ter horário de tomada.

O `seed.sql` foi estruturado para depender dos usuários criados previamente no Supabase Auth. Ele busca os UUIDs dos usuários por e-mail em `auth.users`, atualiza os respectivos profiles e cria medicamentos, agendamentos e logs fictícios para as três personas demo:
- Maria Silva, com cenário mais completo;
- Carlos Oliveira, com cenário intermediário;
- Ana Souza, com cenário em que os medicamentos já estão tomados.

O `supabase/README.md` documenta a ordem de configuração: aplicar o schema, criar usuários demo, aplicar o seed, testar RLS, obter URL e anon key e evitar commit de chaves sensíveis. O `.env.example` define as variáveis públicas esperadas para a futura integração do app com Supabase.

**Decisão tomada:**  
Aceito com pequenas alterações.

**Utilidade percebida:**  
5

**Retrabalho:**  
Médio

**Problema ou limitação:**  
Esta etapa configura o backend, mas ainda não integra o app React Native ao Supabase. O app continua usando o `MockMedicationRepository`. Além disso, a configuração exige ordem correta: aplicar `schema.sql`, criar os três usuários no Supabase Auth e depois rodar `seed.sql`. Caso os usuários sejam criados antes do schema, o trigger de criação automática de profiles ainda não existirá. Também há dependência de `current_date` no seed, o que exige atenção no dia da demonstração ou avaliação.

**Evidência:**  
Arquivos criados:
- `supabase/schema.sql`
- `supabase/seed.sql`
- `supabase/README.md`
- `.env.example`

Arquivo modificado:
- `.gitignore`

**Checklist de validação local / Supabase:**  
- Criar projeto no Supabase.
- Aplicar `supabase/schema.sql` no SQL Editor.
- Verificar se as tabelas `profiles`, `medications`, `medication_schedules` e `medication_logs` foram criadas.
- Confirmar se RLS está ativado nas quatro tabelas.
- Criar os três usuários demo no Supabase Auth:
  - `maria.demo@takere.test`
  - `carlos.demo@takere.test`
  - `ana.demo@takere.test`
- Confirmar se os usuários estão com e-mail confirmado ou se a confirmação foi desabilitada para demonstração.
- Aplicar `supabase/seed.sql`.
- Verificar se Maria possui 4 medicamentos.
- Verificar se Carlos possui 2 medicamentos.
- Verificar se Ana possui 3 medicamentos.
- Verificar contagem geral esperada dos logs:
  - `taken = 4`
  - `pending = 4`
  - `late = 1`
- Testar se a RLS limita cada usuário aos próprios dados.
- Confirmar que `.env` e chaves secretas não foram commitadas.
- Rodar `git grep -n service_role` antes de qualquer commit para garantir que nenhuma chave secreta foi versionada.

**Observações para análise posterior no TCC:**  
Esta interação é relevante porque materializa a camada de persistência definida na arquitetura da C13. O uso do Supabase permite que o app tenha autenticação e armazenamento persistente sem exigir a construção de um backend próprio, o que mantém o foco do TCC na interface e na avaliação de usabilidade.

A modelagem em quatro tabelas reflete diretamente o domínio do app: usuário/paciente demo, medicamentos, horários e registros de tomada. A ativação de Row Level Security também permite justificar que, mesmo com dados fictícios, a aplicação foi estruturada com preocupação de isolamento por usuário.

A criação de usuários demo com diferentes idades e familiaridade tecnológica também contribui para o TCC, pois permite demonstrar o app em cenários distintos sem utilizar dados reais de saúde.

**Possíveis riscos ou limitações:**  
- O app ainda não está integrado ao Supabase nesta etapa.
- A ordem de setup é importante: schema → usuários Auth → seed.
- O seed depende de usuários já existentes em `auth.users`.
- O uso de `current_date` no seed exige atenção no dia da demonstração.
- Os logs não são gerados automaticamente todos os dias.
- O plano gratuito do Supabase pode pausar por inatividade.
- As senhas demo são previsíveis e devem ser usadas apenas no contexto acadêmico.
- RLS precisa ser testada cuidadosamente antes da avaliação ou banca.
- A futura integração exigirá novas dependências no app, como `@supabase/supabase-js`, `@react-native-async-storage/async-storage` e `react-native-url-polyfill`.

---

### Interação C16

**Categoria:**  
Autenticação / Supabase / Navegação / Login / Integração inicial com backend

**Tela ou funcionalidade:**  
Login com Supabase, controle de sessão e navegação condicional entre fluxo autenticado e não autenticado.

**Objetivo do prompt:**  
Integrar autenticação Supabase ao app, criando uma tela de login, controle de sessão com `AuthProvider`, adapter para o Supabase e navegação condicional. A etapa deveria permitir login/logout com os usuários demo, mas ainda manter os dados de medicamentos vindos do `MockMedicationRepository`.

**Prompt enviado:**  
Foi solicitado que Claude implementasse a integração inicial de autenticação com Supabase, incluindo instalação das dependências necessárias, criação do `supabaseClient`, `AuthProvider`, `useAuth`, `LoginScreen`, `AuthStack`, `AppStack`, ajuste no `RootNavigator`, atualização do `App.tsx` e adição de logout. Também foi especificado que a leitura real dos medicamentos do Supabase ficaria para a próxima etapa.

**Resumo da resposta do Claude:**  
Claude indicou os comandos de instalação das dependências `@supabase/supabase-js`, `@react-native-async-storage/async-storage` e `react-native-url-polyfill`. Também alertou que o valor de `EXPO_PUBLIC_SUPABASE_URL` deve ser apenas a URL base do projeto Supabase, sem `/rest/v1/` no final, pois o SDK adiciona os caminhos internos automaticamente.

Foram criados os arquivos `supabaseClient.ts`, `AuthProvider.tsx`, `useAuth.ts`, `LoginScreen.tsx`, `AuthStack.tsx` e `AppStack.tsx`. A navegação foi reorganizada para renderizar `AuthStack` quando não houver sessão e `AppStack` quando houver sessão autenticada. O `RootNavigator` passou a consumir `useAuth` e mostrar um `ActivityIndicator` enquanto a sessão inicial é carregada.

O `AuthProvider` foi implementado para restaurar a sessão com `supabase.auth.getSession()`, escutar mudanças com `onAuthStateChange`, expor `session`, `user`, `isLoading`, `authError`, `signIn`, `signOut` e `clearError`. A `LoginScreen` foi criada com campos de e-mail e senha, mensagens amigáveis de erro e botões de demonstração para preencher credenciais de Maria, Carlos e Ana.

O `MedicationProvider` foi movido para dentro do `AppStack`, garantindo que ele só seja montado após login e que seja desmontado no logout. Isso evita que estados locais de uma sessão vazem para outra. A HomeScreen passou a ter uma opção discreta de “Sair” dentro da seção “Mais opções”, com confirmação via `Alert`.

**Decisão tomada:**  
Aceito com pequenas alterações.

**Utilidade percebida:**  
5

**Retrabalho:**  
Médio

**Problema ou limitação:**  
A autenticação foi integrada, mas os dados dos medicamentos ainda continuam vindo dos mocks. Assim, nesta etapa, mesmo ao logar como Carlos ou Ana, o app ainda pode exibir os medicamentos mockados da Maria. Isso foi considerado comportamento esperado da C16, pois a leitura real dos dados do Supabase será feita apenas na C17. Também é necessário garantir que as dependências sejam instaladas corretamente e que o `.env` use a URL do Supabase sem `/rest/v1/`.

**Evidência:**  
Arquivos criados:
- `src/adapters/supabaseClient.ts`
- `src/contexts/AuthProvider.tsx`
- `src/hooks/useAuth.ts`
- `src/screens/LoginScreen.tsx`
- `src/navigation/AuthStack.tsx`
- `src/navigation/AppStack.tsx`

Arquivos modificados:
- `src/navigation/routes.ts`
- `src/navigation/RootNavigator.tsx`
- `src/screens/HomeScreen.tsx`
- `App.tsx`

Dependências indicadas:
- `@supabase/supabase-js`
- `@react-native-async-storage/async-storage`
- `react-native-url-polyfill`

**Checklist de validação local:**  
- Instalar dependências com:
  - `npx expo install @supabase/supabase-js @react-native-async-storage/async-storage react-native-url-polyfill`
- Conferir se o `.env` contém:
  - `EXPO_PUBLIC_SUPABASE_URL=https://<projeto>.supabase.co`
  - `EXPO_PUBLIC_SUPABASE_ANON_KEY=<anon-ou-publishable-key>`
- Garantir que a URL não termina com `/rest/v1/`.
- Reiniciar o Expo após alterar `.env`.
- Abrir o app sem sessão e verificar se a `LoginScreen` aparece.
- Confirmar se os campos de e-mail e senha aparecem corretamente.
- Testar login com Maria.
- Testar login com Carlos.
- Testar login com Ana.
- Verificar se, após login, o app entra na Home.
- Verificar se a sessão é restaurada ao fechar e reabrir o app.
- Testar logout pela Home.
- Confirmar se logout volta para a LoginScreen.
- Testar erro de senha incorreta e verificar se a mensagem aparece em português.
- Confirmar que o app ainda usa dados mockados nesta etapa.
- Confirmar que Home, lista, detalhe, histórico, filtros, marcar como tomado e desfazer continuam funcionando.
- Rodar `npx tsc --noEmit` depois de instalar as dependências.

**Observações para análise posterior no TCC:**  
Esta interação é importante porque introduz autenticação real no app, uma exigência indicada pelo orientador para que a implementação tenha persistência e login. A integração foi feita mantendo separação entre autenticação e dados de medicamentos, reduzindo risco de quebrar o fluxo já implementado.

A criação de uma `LoginScreen` com perfis fictícios de demonstração também contribui para a avaliação, pois permite alternar entre usuários de diferentes idades e níveis de familiaridade tecnológica. Ao mesmo tempo, a interface deixa claro que se trata de um ambiente acadêmico/de demonstração, evitando interpretação como sistema clínico real.

Do ponto de vista arquitetural, a navegação condicional por sessão protege as telas internas quando não há usuário autenticado. Além disso, mover o `MedicationProvider` para dentro do `AppStack` evita vazamento de estado entre sessões.

**Possíveis riscos ou limitações:**  
- Os dados de medicamentos ainda não vêm do Supabase nesta etapa.
- Usuários diferentes ainda podem ver os mesmos dados mockados até a C17.
- O login depende da configuração correta dos usuários demo no Supabase.
- Se os usuários não estiverem confirmados, o login pode falhar com erro de e-mail não confirmado.
- Se a URL do Supabase estiver com `/rest/v1/`, o SDK pode falhar.
- A sessão depende de `AsyncStorage`, introduzindo uma nova dependência nativa.
- A interface ainda não trata dados carregados do backend, loading de medicamentos ou erro de rede para os dados.

---

### Interação C17

**Categoria:**  
Backend / Supabase / Repository Pattern / Leitura de dados / Integração com usuário autenticado

**Tela ou funcionalidade:**  
Leitura dos medicamentos, agendamentos e registros de tomada a partir do Supabase.

**Objetivo do prompt:**  
Substituir a leitura dos dados mockados pela leitura real do Supabase, fazendo com que os dados exibidos no app reflitam o usuário autenticado. O objetivo foi permitir que Maria, Carlos e Ana visualizem seus próprios medicamentos, sem ainda persistir no backend a ação de “Marcar como tomado” ou “Desfazer”.

**Prompt enviado:**  
Foi solicitado que Claude criasse uma implementação `SupabaseMedicationRepository`, ajustasse a interface `MedicationRepository` para operações assíncronas, atualizasse o `MedicationProvider` para carregar dados do usuário autenticado, criasse ou ajustasse `useCurrentPatient`, mantivesse o `MedicationService` puro e preservasse as telas sem acesso direto ao Supabase. Também foi solicitado que a escrita de “Marcar como tomado” permanecesse local nesta etapa, deixando a persistência real para a C18.

**Resumo da resposta do Claude:**  
Claude criou o `SupabaseMedicationRepository`, responsável por ler medicamentos, agendamentos e logs diretamente do Supabase usando o client configurado anteriormente. A interface `MedicationRepository` foi convertida para uma interface assíncrona, e o `MockMedicationRepository` foi atualizado para manter o mesmo contrato com `Promise`.

Também foi criado o arquivo `supabaseMedicationMapper`, centralizando a conversão entre os nomes do banco em `snake_case` e os tipos do app em `camelCase`. Assim, campos como `display_name`, `tech_familiarity`, `time_of_day`, `scheduled_for` e `taken_at` são convertidos para o formato esperado pela aplicação, sem vazar estruturas do Supabase para as telas ou hooks.

O `AuthProvider` passou a carregar o profile atual a partir da tabela `profiles`, expondo os dados do usuário autenticado. O hook `useCurrentPatient` foi criado para fornecer o paciente atual para as telas e hooks. O `MedicationProvider` foi atualizado para carregar dados de forma assíncrona com base no usuário autenticado, usando o repository configurado. Ele passou a expor também estados de `isLoading`, `error` e `reload`.

Foi criado o `MedicationGate`, usado no `AppStack`, para centralizar estados de carregamento e erro antes de renderizar as telas principais. Dessa forma, as telas continuam sem precisar lidar diretamente com loading/error de backend.

A escrita de “Marcar como tomado” e “Desfazer” ainda não foi persistida no Supabase. Nesta etapa, o `SupabaseMedicationRepository` usa um `logsCache` interno para manter a experiência local durante a sessão, enquanto a persistência real ficou planejada para a C18.

**Decisão tomada:**  
Aceito com pequenas alterações.

**Utilidade percebida:**  
5

**Retrabalho:**  
Médio

**Problema ou limitação:**  
A leitura dos dados agora vem do Supabase, mas a escrita ainda não é persistida. Assim, ao marcar um medicamento como tomado e depois fazer logout/login ou recarregar os dados, a alteração pode ser perdida, pois ainda não foi salva no banco. Esse comportamento é esperado para a C17 e será corrigido na C18. Também foi introduzida maior complexidade assíncrona no `MedicationProvider`, exigindo tratamento de loading, erro e troca de usuário.

**Evidência:**  
Arquivos criados:
- `src/repositories/SupabaseMedicationRepository.ts`
- `src/repositories/mappers/supabaseMedicationMapper.ts`
- `src/hooks/useCurrentPatient.ts`
- `src/navigation/MedicationGate.tsx`

Arquivos modificados:
- `src/repositories/MedicationRepository.ts`
- `src/repositories/MockMedicationRepository.ts`
- `src/contexts/AuthProvider.tsx`
- `src/contexts/MedicationProvider.tsx`
- `src/navigation/AppStack.tsx`
- `src/hooks/useTodayMedications.ts`
- `src/hooks/useMedicationList.ts`
- `src/hooks/useMedicationHistory.ts`
- `src/screens/HomeScreen.tsx`

**Checklist de validação local:**  
- Reiniciar o Metro com cache limpo: `npx expo start -c`.
- `npm run typecheck` passa sem erros.
- Login com Maria mostra os 4 medicamentos da Maria.
- Login com Carlos mostra os 2 medicamentos do Carlos.
- Login com Ana mostra os 3 medicamentos da Ana.
- Nenhum dado da Maria aparece ao logar como Carlos ou Ana.
- Logout limpa o estado do usuário anterior.
- Trocar de usuário sem fechar o app não mantém dados do usuário anterior.
- A HomeScreen continua funcionando.
- A MedicationListScreen continua filtrando corretamente.
- A MedicationDetailScreen continua abrindo os detalhes.
- A HistoryScreen mostra os logs vindos do Supabase.
- Em Maria, a lista mostra 1 tomado, 2 pendentes e 1 atrasado.
- Em Ana, o histórico mostra os 3 medicamentos tomados.
- Marcar medicamento como tomado ainda altera a UI na sessão atual.
- Desfazer ainda funciona dentro da sessão.
- Após logout/login, alterações de “Marcar como tomado” não persistem ainda, comportamento esperado da C17.
- Modo offline antes do login mostra erro amigável.
- Botão “Tentar novamente” recarrega os dados após conexão voltar.

**Observações para análise posterior no TCC:**  
Esta interação é relevante porque marca a passagem do app de uma interface baseada em mocks para uma interface conectada a um backend real. A leitura dos dados passa a refletir o usuário autenticado, permitindo que os três perfis fictícios tenham experiências diferentes no app.

Do ponto de vista arquitetural, a interação valida o repository pattern introduzido na C14. As telas e componentes permaneceram agnósticos à origem dos dados, enquanto a troca da fonte de dados ficou concentrada em repositories, mappers, provider e hooks. Isso fortalece a argumentação do TCC sobre separação de responsabilidades e redução de retrabalho.

A criação dos mappers também é importante porque isola a diferença entre o modelo relacional do banco e os tipos usados pela interface. Assim, a UI continua trabalhando com modelos de domínio mais simples e adequados à aplicação.

Do ponto de vista de usabilidade, o `MedicationGate` evita que as telas apareçam vazias ou quebradas durante carregamento ou erro de rede, contribuindo para visibilidade do estado do sistema e mensagens mais compreensíveis para o usuário.

**Possíveis riscos ou limitações:**  
- A ação “Marcar como tomado” ainda não é persistida no Supabase.
- O `logsCache` usado pelo `SupabaseMedicationRepository` é uma solução temporária até a C18.
- O optimistic update ainda não possui rollback baseado em falha real de backend.
- Se a persistência falhar na C18, será necessário garantir que a UI volte ao estado anterior e mostre erro amigável.
- O campo `frequencyHours` continua sendo preenchido com valor padrão no mapper, pois não existe no schema.
- `Patient.age` pode receber valor padrão caso o banco retorne `null`, embora isso não apareça na UI.
- A leitura assíncrona introduz novos estados de loading e erro que precisam ser testados em dispositivos reais.
- Ainda não há testes automatizados para validar repository, mappers ou provider.

---

### Interação C18

**Categoria:**  
Backend / Supabase / Persistência / UX feedback / Tratamento de erro

**Tela ou funcionalidade:**  
Persistência das ações “Marcar como tomado” e “Desfazer” no Supabase.

**Objetivo do prompt:**  
Persistir no backend as ações de marcar medicamento como tomado e desfazer a ação, garantindo que o estado continue salvo após logout/login, refresh ou reabertura do app. A experiência visual deveria permanecer igual, mas agora com escrita real no Supabase, rollback em caso de erro e feedback amigável para o usuário.

**Prompt enviado:**  
Foi solicitado que Claude implementasse a persistência real dos métodos `markAsTaken` e `restoreLog` no `SupabaseMedicationRepository`, atualizasse o `MedicationProvider` para usar optimistic update com rollback em erro, adicionasse tratamento visual de erro no `FeedbackBanner` e mantivesse Home, lista, detalhe e histórico consistentes entre si.

**Resumo da resposta do Claude:**  
Claude atualizou o `SupabaseMedicationRepository` para que `markAsTaken` e `restoreLog` façam updates reais na tabela `public.medication_logs`. O método `markAsTaken` agora atualiza `status = 'taken'` e `taken_at = takenAt`, retornando o log atualizado do banco. O método `restoreLog` restaura o status anterior e o valor anterior de `taken_at`, respeitando a constraint do banco que exige `taken_at` preenchido apenas quando o status é `taken`.

O cache temporário de logs criado na C17 foi removido, e a fonte de verdade passou a ser o Supabase. O `MedicationProvider` foi ajustado para manter optimistic update: a UI muda imediatamente após a ação, mas o app aguarda a confirmação do repository. Em caso de sucesso, o estado local é substituído pelo valor retornado pelo banco. Em caso de falha, o estado anterior é restaurado e uma mensagem amigável de erro é exibida.

O `FeedbackBanner` foi atualizado para aceitar variantes de sucesso e erro. A variante de erro usa a paleta associada a atraso/alerta e mantém texto acessível, sem expor mensagens técnicas do Supabase para o usuário. A HomeScreen e a MedicationDetailScreen foram ajustadas para priorizar o banner de erro quando houver falha.

**Decisão tomada:**  
Aceito com pequenas alterações.

**Utilidade percebida:**  
5

**Retrabalho:**  
Médio

**Problema ou limitação:**  
A persistência principal agora funciona, mas ainda há pontos a evoluir. O app ainda não possui retry automático, realtime/multi-dispositivo, telemetria de erro ou histórico semanal/mensal. Em caso de falha de rede, a UI faz rollback e mostra erro, mas não tenta salvar novamente automaticamente. O histórico ainda depende da estrutura atual dos logs e não foi expandido para visão semanal nesta etapa.

**Evidência:**  
Arquivos modificados:
- `src/repositories/SupabaseMedicationRepository.ts`
- `src/components/FeedbackBanner.tsx`
- `src/contexts/MedicationProvider.tsx`
- `src/hooks/useTodayMedications.ts`
- `src/hooks/useMedicationDetail.ts`
- `src/screens/HomeScreen.tsx`
- `src/screens/MedicationDetailScreen.tsx`

Arquivos criados:
- Nenhum.

Schema:
- Não foi alterado.

**Checklist de validação local:**  
- Reiniciar o Metro com `npx expo start -c`.
- `npm run typecheck` passa sem erros.
- Login com Maria carrega os dados da Maria.
- Marcar Losartana como tomada altera a UI imediatamente.
- O banner verde aparece com opção de “Desfazer”.
- O resumo da Home é atualizado.
- A lista é atualizada.
- O detalhe da Losartana mostra que ela foi marcada como tomada.
- O histórico passa a incluir Losartana.
- Fazer logout e login novamente com Maria mantém Losartana como tomada.
- Fechar e reabrir o app mantém o estado persistido.
- Conferir no Supabase Studio se o log foi atualizado com `status = 'taken'` e `taken_at` preenchido.
- Marcar Metformina como tomada e tocar em “Desfazer” antes do banner desaparecer.
- Confirmar que Metformina volta para `pending`.
- Fazer logout/login e confirmar que Metformina continua pendente.
- Conferir no Supabase Studio se `taken_at` voltou para `null`.
- Desligar a internet e tentar marcar um medicamento.
- Confirmar que a UI faz rollback e mostra o banner vermelho de erro.
- Religar a internet e tentar novamente.
- Confirmar que Home, lista, detalhe e histórico continuam consistentes.
- Confirmar que trocar de usuário não mistura dados entre Maria, Carlos e Ana.

**Observações para análise posterior no TCC:**  
Esta interação é importante porque completa o ciclo de persistência principal do app. A interface deixa de apenas simular registros em memória e passa a salvar ações no backend, atendendo à exigência de persistência indicada pelo orientador.

Do ponto de vista arquitetural, a interação valida a separação em camadas construída anteriormente. As telas continuam sem acessar Supabase diretamente; a persistência fica concentrada no repository e no provider. O `MedicationService` permanece puro, responsável apenas por derivar dados para a interface.

Do ponto de vista de UX, a solução mantém resposta imediata por meio de optimistic update, mas também preserva confiabilidade ao fazer rollback em caso de falha. Isso contribui para a visibilidade do estado do sistema e para a confiança do usuário. O feedback de erro em linguagem simples evita expor detalhes técnicos e mantém a interface adequada para avaliação com participantes.

**Possíveis riscos ou limitações:**  
- Ainda não há retry automático para falhas temporárias de rede.
- O app ainda não usa realtime; mudanças feitas em outro dispositivo não aparecem automaticamente.
- Não há diferenciação visual entre tipos de erro, como falha de rede, RLS ou constraint.
- Ainda não há histórico semanal ou agrupamento por vários dias.
- O reset de cenário demo ainda não foi implementado no app.
- Falhas de RLS devem ser corrigidas nas policies, nunca usando `service_role` no app.
- A persistência funciona, mas ainda precisa de uma rodada de QA com diferentes usuários e cenários.

---

### Interação C19

**Categoria:**  
UX / Tratamento de erro / Loading / Acessibilidade / Robustez de rede

**Tela ou funcionalidade:**  
Estados de carregamento, erro e recuperação em fluxos dependentes do Supabase.

**Objetivo do prompt:**  
Melhorar a experiência do app em situações de carregamento, erro de rede, restauração de sessão, falha ao carregar medicamentos e falha ao salvar ações no backend. A etapa buscou tornar a interface mais clara, acessível e robusta após a integração com Supabase e persistência real.

**Prompt enviado:**  
Foi solicitado que Claude revisasse e melhorasse os estados de loading e erro do app, especialmente na restauração de sessão, carregamento inicial dos medicamentos, troca de usuário, reload após erro e ações de marcar como tomado/desfazer. Também foi pedido que a solução mantivesse a UI limpa, acessível e consistente com o restante da interface, sem adicionar dependências novas ou alterar funcionalidades principais.

**Resumo da resposta do Claude:**  
Claude criou os componentes reutilizáveis `LoadingState` e `ErrorState`, substituindo spinners e mensagens inline por componentes padronizados. O `RootNavigator` passou a usar `LoadingState` durante a restauração da sessão, evitando um spinner sem contexto. O `MedicationGate` foi refatorado para usar `LoadingState` enquanto carrega medicamentos e `ErrorState` quando ocorre falha, com botão “Tentar novamente” ligado ao `reload`.

Também foram feitos ajustes no `MedicationProvider` para lidar melhor com ações simultâneas. Foi introduzida uma serialização de operações por `logId` usando `Map<string, Promise<void>>`, evitando problemas como duplo toque em “Marcar como tomado” ou tentativa de “Desfazer” enquanto a marcação ainda está em andamento. Isso reduz o risco de divergência entre estado local e banco de dados em redes lentas.

O `AuthProvider` recebeu um `catch` defensivo em `getSession()`, evitando que o app fique preso indefinidamente em loading caso a restauração de sessão falhe. A `LoginScreen` foi simplificada removendo um `ActivityIndicator` redundante, deixando apenas o texto “Entrando…” no botão durante o login.

**Decisão tomada:**  
Aceito com pequenas alterações.

**Utilidade percebida:**  
5

**Retrabalho:**  
Baixo

**Problema ou limitação:**  
A etapa melhorou o tratamento de loading e erro, mas ainda não implementou retry automático, realtime, pull-to-refresh, telemetria estruturada ou reset de cenário demo. Em falhas de rede, o usuário ainda precisa tentar novamente manualmente. Além disso, histórico semanal e agrupamento por vários dias ficaram para a próxima etapa.

**Evidência:**  
Arquivos criados:
- `src/components/LoadingState.tsx`
- `src/components/ErrorState.tsx`

Arquivos modificados:
- `src/navigation/RootNavigator.tsx`
- `src/navigation/MedicationGate.tsx`
- `src/contexts/MedicationProvider.tsx`
- `src/contexts/AuthProvider.tsx`
- `src/screens/LoginScreen.tsx`

Schema:
- Não foi alterado.

Dependências:
- Nenhuma dependência nova foi adicionada.

**Checklist de validação local:**  
- Rodar `npx expo start -c`.
- Abrir o app sem sessão e verificar se aparece `LoadingState` antes da `LoginScreen`.
- Fazer login com Maria e verificar a transição para “Carregando medicamentos...”.
- Confirmar que a Home aparece após o carregamento.
- Fazer logout e login com Carlos, verificando que não aparecem dados da sessão anterior.
- Desligar a internet antes de carregar os medicamentos.
- Confirmar que aparece `ErrorState` com mensagem amigável e botão “Tentar novamente”.
- Religar a internet e tocar em “Tentar novamente”.
- Confirmar que os medicamentos carregam corretamente.
- Fazer duplo toque rápido em “Marcar como tomado” e confirmar que a ação ocorre apenas uma vez.
- Em rede lenta, marcar um medicamento e tocar em “Desfazer” rapidamente.
- Confirmar que o estado final no Supabase permanece correto.
- Testar erro de ação desligando a internet antes de desfazer ou marcar como tomado.
- Confirmar rollback da UI e banner de erro amigável.
- Confirmar que a `LoginScreen` não mostra spinner redundante no rodapé.
- Testar erro de login e verificar mensagem amigável.
- Rodar `npm run typecheck`.
- Verificar que screens e services não importam Supabase diretamente.

**Observações para análise posterior no TCC:**  
Esta interação é relevante porque trata a interface como uma aplicação conectada a backend real, sujeita a carregamento, falhas de rede e inconsistências temporárias. O uso de componentes padronizados de loading e erro melhora a previsibilidade da interface e reduz a chance de o usuário interpretar uma tela vazia como falha ou travamento.

Do ponto de vista das heurísticas de Nielsen, a etapa contribui principalmente para visibilidade do estado do sistema, prevenção de erros, recuperação de erros e ajuda ao usuário. As mensagens de erro são apresentadas em português e não expõem detalhes técnicos do Supabase, o que melhora a compreensão por participantes não técnicos.

Do ponto de vista do SUS, a etapa pode contribuir para a percepção de facilidade de uso, confiança e consistência, pois o usuário recebe feedback claro quando o sistema está carregando ou quando algo falha.

A serialização de ações por medicamento também é relevante do ponto de vista técnico e de UX, pois evita inconsistências provocadas por duplo toque ou por operações concorrentes em redes lentas.

**Possíveis riscos ou limitações:**  
- Ainda não há retry automático com backoff.
- Ainda não há atualização realtime/multi-dispositivo.
- Ainda não há pull-to-refresh manual.  
- Ainda não há telemetria estruturada para diferenciar tipos de erro.
- O reset do cenário demo ainda não foi implementado.
- A experiência em redes muito lentas ainda depende de tentativa manual do usuário.
- O histórico semanal e percentual por dia ainda não foram implementados.
- Alguns cenários de falha, como storage corrompido, são difíceis de reproduzir manualmente.

---

### Interação C20

**Categoria:**  
Design de UI/UX / Histórico semanal / Visualização de dados simples / Supabase / Serviço de domínio

**Tela ou funcionalidade:**  
Aprimoramento da HistoryScreen com resumo semanal e percentual de medicamentos registrados por dia.

**Objetivo do prompt:**  
Melhorar a tela de histórico para deixá-la mais útil, bonita e informativa, adicionando uma visão semanal simples com percentual de medicamentos registrados por dia e resumo geral da semana. A funcionalidade deveria continuar sendo apenas de organização e registro, sem assumir caráter clínico ou julgamento sobre o tratamento.

**Prompt enviado:**  
Foi solicitado que Claude aprimorasse a `HistoryScreen` com um card de resumo semanal, percentual geral da semana, quantidade de medicamentos registrados e previstos, visualização por dia da semana e manutenção da lista de registros existente. Também foi pedido que o cálculo fosse feito de forma pura no `MedicationService`, que o hook `useMedicationHistory` entregasse os novos dados para a tela, e que o Supabase carregasse logs suficientes para os últimos 7 dias.

**Resumo da resposta do Claude:**  
Claude criou os componentes `WeeklySummaryCard` e `WeeklyDayProgressItem`, responsáveis por exibir o resumo semanal e os percentuais por dia. A `HistoryScreen` foi atualizada para apresentar uma hierarquia composta por resumo da semana, resumo por dia e lista de medicamentos registrados.

O `MedicationService` recebeu a função pura `getWeeklyHistory`, além de novos tipos de view-model: `WeeklyDaySummaryView`, `WeeklySummaryView` e `WeeklyHistoryView`. Essa função calcula a janela dos últimos 7 dias, agrupa os logs por dia, calcula quantidade prevista, quantidade registrada e percentual de registro para cada dia e para a semana como um todo.

O hook `useMedicationHistory` foi atualizado para expor os novos dados da visão semanal. O `SupabaseMedicationRepository` foi ajustado para carregar logs a partir do início do dia local de 6 dias atrás, usando `scheduled_for` como referência. Como consequência, o `MedicationService.getTodayDashboard` passou a filtrar os logs de hoje, evitando que a Home exibisse logs antigos como se fossem do dia atual.

O `seed.sql` também foi atualizado para inserir logs históricos fictícios dos últimos 6 dias para os três usuários demo. Maria passou a ter uma semana variada, Carlos um cenário com poucos registros e Ana um cenário quase todo registrado. O cenário de hoje usado por Home, lista e detalhe foi preservado.

**Decisão tomada:**  
Aceito com pequenas alterações.

**Utilidade percebida:**  
5

**Retrabalho:**  
Médio

**Problema ou limitação:**  
A melhoria torna o histórico mais informativo, mas exige rodar novamente o `seed.sql` para que os dados históricos apareçam no Supabase. A visualização semanal ainda é limitada aos últimos 7 dias e não possui navegação entre semanas, paginação ou histórico mensal. Também não há gráfico complexo, por escolha consciente de simplicidade e adequação à avaliação de usabilidade.

**Evidência:**  
Arquivos criados:
- `src/components/WeeklySummaryCard.tsx`
- `src/components/WeeklyDayProgressItem.tsx`

Arquivos modificados:
- `src/services/MedicationService.ts`
- `src/hooks/useMedicationHistory.ts`
- `src/screens/HistoryScreen.tsx`
- `src/repositories/SupabaseMedicationRepository.ts`
- `supabase/seed.sql`

**Checklist de validação local:**  
- Rodar novamente `supabase/seed.sql` no Supabase Studio.
- Reiniciar o app.
- Logar como Maria.
- Confirmar que a Home continua mostrando os 4 itens de hoje.
- Acessar o histórico e verificar o título “Histórico da semana”.
- Confirmar que aparece o card de resumo semanal.
- Confirmar que o percentual geral da semana aparece.
- Confirmar que o resumo por dia mostra Hoje, Ontem e os dias anteriores.
- Confirmar que cada dia mostra “X de Y registrados”.
- Confirmar que cada dia mostra o percentual correspondente.
- Confirmar que a barra horizontal é proporcional ao percentual.
- Confirmar que a lista de medicamentos registrados continua existindo.
- Marcar um medicamento como tomado e voltar ao histórico.
- Confirmar que o percentual de hoje e o percentual da semana foram atualizados.
- Desfazer a ação e confirmar que os percentuais voltam ao estado anterior.
- Logar como Carlos e verificar um percentual semanal mais baixo.
- Logar como Ana e verificar um percentual semanal mais alto.
- Confirmar que não aparecem dados de outro usuário.
- Testar com leitor de tela se cada linha de dia é anunciada com dia, data, quantidade registrada e percentual.
- Rodar `npx tsc --noEmit`.

**Observações para análise posterior no TCC:**  
Esta interação é relevante porque melhora a capacidade da interface de apresentar informações agregadas sem transformar o app em uma ferramenta clínica. O histórico deixa de ser apenas uma lista de eventos e passa a oferecer uma visão resumida da semana, ajudando o usuário a compreender seus próprios registros.

Do ponto de vista de IHC, a solução contribui para visibilidade do estado do sistema, reconhecimento em vez de memorização e estética minimalista. A visualização por dia usa texto e barras simples, sem depender exclusivamente de cor e sem introduzir gráficos complexos.

Do ponto de vista do SUS, a funcionalidade pode aumentar a percepção de utilidade e integração do sistema, pois a marcação de medicamentos passa a impactar não apenas a lista e o detalhe, mas também um resumo semanal compreensível.

A escolha do termo “registrados” em vez de “consumidos” é importante para o TCC, pois o app registra uma ação declarada pelo usuário, mas não comprova clinicamente o consumo do medicamento. Isso mantém o escopo do sistema como organização e registro, não avaliação clínica.

**Possíveis riscos ou limitações:**  
- É necessário rodar novamente o `seed.sql` para visualizar os dados históricos.
- A visão cobre apenas os últimos 7 dias.
- Não há navegação entre semanas.
- Não há histórico mensal.
- Não há paginação para históricos longos.
- A query do Supabase agora carrega mais logs, o que pode exigir paginação em escala maior.
- A barra de progresso é apenas reforço visual; a informação principal precisa continuar sendo textual.
- Percentuais podem causar sensação de julgamento se a linguagem não for cuidadosamente mantida neutra.
- A funcionalidade ainda depende da consistência dos logs gerados no seed ou no backend.

---

### Interação C21

**Categoria:**  
Backend / Supabase / Reset de cenário demo / Documentação / Segurança

**Tela ou funcionalidade:**  
Processo de reset do cenário demo para avaliação, banca e testes.

**Objetivo do prompt:**  
Criar um processo claro, seguro e reproduzível para resetar os dados fictícios dos três usuários demo antes de sessões de avaliação, banca ou testes locais, sem adicionar botão de reset no app e sem expor `service_role`.

**Prompt enviado:**  
Foi solicitado que Claude revisasse ou criasse um script SQL de reset para os dados demo, preservando os usuários Auth e recriando medicamentos, horários e logs das personas Maria, Carlos e Ana. Também foi pedido que o processo fosse documentado no `supabase/README.md` e, se necessário, no `README.md` principal, deixando claro quando rodar o reset, o que ele apaga, o que preserva e quais cuidados de segurança devem ser observados.

**Resumo da resposta do Claude:**  
Claude renomeou `supabase/seed.sql` para `supabase/reset_demo.sql` usando `git mv`, preservando o histórico do arquivo. A decisão foi tomada porque o script não serve apenas para popular inicialmente o banco, mas também para resetar o cenário antes de avaliações e demonstrações. Com isso, `reset_demo.sql` passa a ser a fonte única de verdade para recriar o cenário canônico dos três usuários fictícios.

O script `reset_demo.sql` verifica se os três usuários demo existem em `auth.users`, falhando com mensagem clara caso algum esteja ausente. Em seguida, remove os dados das três contas demo por meio de `DELETE` filtrado pelos e-mails fictícios, preservando os usuários de autenticação. Como as relações usam cascade, medicamentos, agendamentos e logs são recriados do zero. O script também atualiza os profiles das personas e recria tanto o cenário do dia atual quanto o histórico semanal dos últimos dias.

Claude também atualizou `supabase/reset_logs.sql`, `supabase/README.md` e o `README.md` principal para apontarem para `reset_demo.sql`, documentando o processo de reset antes da banca ou sessão de avaliação.

**Decisão tomada:**  
Aceito com pequenas alterações.

**Utilidade percebida:**  
5

**Retrabalho:**  
Baixo

**Problema ou limitação:**  
O reset precisa ser executado manualmente no Supabase Studio pelo pesquisador/desenvolvedor. Isso é intencional por segurança, mas exige disciplina antes de cada banca ou sessão de avaliação. Se o app estiver aberto durante o reset, pode ser necessário fazer logout/login ou recarregar os dados para que o estado do app reflita o banco atualizado.

**Evidência:**  
Arquivos criados/renomeados:
- `supabase/reset_demo.sql` — renomeado a partir de `supabase/seed.sql`.

Arquivos modificados:
- `supabase/reset_logs.sql`
- `supabase/README.md`
- `README.md`

Arquivos React Native:
- Nenhum arquivo de código do app foi alterado.

**Checklist de validação:**  
- Abrir o Supabase Studio do projeto de demonstração.
- Acessar `SQL Editor → New query`.
- Colar e rodar `supabase/reset_demo.sql`.
- Confirmar que o script não retorna erro.
- Verificar se o `SELECT` final retorna 3 linhas, uma para cada usuário demo.
- Confirmar os cenários esperados:
  - Maria: 4 medicamentos, 28 logs semanais, cenário variado.
  - Carlos: 2 medicamentos, 14 logs semanais, poucos registros.
  - Ana: 3 medicamentos, 21 logs semanais, quase tudo registrado.
- Fazer logout/login no app com Maria e verificar a Home.
- Fazer logout/login com Carlos e verificar a Home.
- Fazer logout/login com Ana e verificar a Home.
- Abrir a HistoryScreen e confirmar que o resumo semanal aparece preenchido.
- Marcar um medicamento como tomado e confirmar que a persistência funciona.
- Rodar `reset_demo.sql` novamente e confirmar que o cenário volta ao estado inicial.
- Confirmar que o processo é idempotente.
- Rodar `npx tsc --noEmit` e confirmar que o app segue compilando.

**Observações para análise posterior no TCC:**  
Esta interação é relevante porque prepara o ambiente para avaliação controlada. Como o app agora possui persistência real no Supabase, era necessário garantir que os dados pudessem retornar a um estado previsível antes de cada sessão de teste ou banca. Isso ajuda a reduzir variações entre participantes e facilita a comparação dos resultados de usabilidade.

A decisão de não colocar reset dentro do app também é importante. O reset é uma operação administrativa, não uma funcionalidade do usuário final. Mantê-lo fora da interface evita risco de apagamento acidental durante a coleta de dados e impede a necessidade de usar chaves privilegiadas no cliente mobile.

Do ponto de vista metodológico, o `reset_demo.sql` ajuda a padronizar o cenário experimental, garantindo que Maria, Carlos e Ana sempre partam dos mesmos estados fictícios de medicamentos, registros e histórico semanal.

**Possíveis riscos ou limitações:**  
- O reset é manual e depende do pesquisador executá-lo antes da avaliação.
- Se o reset for executado enquanto o app está aberto, o estado em memória pode ficar desatualizado até logout/login ou reload.
- O script deve ser usado apenas no projeto de demonstração, nunca em ambiente com dados reais.
- O reset apaga registros persistidos anteriormente para os três usuários demo.
- O reset preserva os usuários Auth, mas depende de eles existirem previamente.
- O processo ainda não possui interface administrativa própria, por escolha de segurança e simplicidade.
- Um botão de reset dev-only poderia ser útil no futuro, mas exigiria cuidado com flags de ambiente e uma operação segura fora do app público.

---

### Interação C22

**Categoria:**  
Design visual / Polimento estético / UI/UX / Refatoração visual pontual

**Tela ou funcionalidade:**  
Ajustes visuais no card de próximo medicamento e nos botões principais/secundários.

**Objetivo do prompt:**  
Avaliar possibilidades de melhoria estética na interface e aplicar ajustes visuais pequenos, seguros e consistentes, sem alterar regras de negócio, backend, navegação ou funcionalidades principais.

**Prompt enviado:**  
Foi solicitado que Claude analisasse mudanças estéticas possíveis para deixar a interface mais bonita, leve e consistente, considerando a importância de uma boa avaliação de IHC, heurísticas de Nielsen e SUS.

**Resumo da resposta do Claude:**  
Claude modificou o layout do `NextMedicationCard` para deixá-lo mais compacto e visualmente leve. O chip “Próximo medicamento” foi substituído por um texto discreto em maiúsculas com espaçamento entre letras, alinhado ao `StatusBadge`. O horário passou a aparecer à esquerda como um marcador visual forte, enquanto nome e dose ficam empilhados à direita. As instruções permanecem abaixo quando existem, e o botão principal continua no rodapé do card.

Também foram ajustados os estilos do `PrimaryButton`. Os botões passaram a ter cantos mais arredondados, com raio maior, criando uma aparência mais suave e menos institucional. O botão primário ganhou sombra sutil para reforçar hierarquia visual, enquanto botões secundários ficaram planos e um pouco menores, reduzindo o peso visual da seção de ações secundárias.

Segundo Claude, a altura aproximada do card de próximo medicamento foi reduzida, tornando a HomeScreen mais leve e menos verticalmente pesada. As mudanças preservaram tipografia legível, áreas de toque adequadas, ausência de ícones/animações e comunicação de status por texto e cor.

**Decisão tomada:**  
Aceito com pequenas alterações.

**Utilidade percebida:**  
4

**Retrabalho:**  
Baixo

**Problema ou limitação:**  
As mudanças são positivas do ponto de vista estético, mas precisam ser validadas visualmente em dispositivos pequenos. O layout horizontal do card pode exigir ajustes se nomes de medicamentos ou doses forem mais longos. A sombra do botão primário também deve ser verificada no Android, pois `elevation` pode produzir aparência mais forte do que o esperado. Além disso, como o `PrimaryButton` é usado em várias telas, a alteração afeta Home, detalhe e login, exigindo checagem visual em todo o app.

**Evidência:**  
Arquivos modificados:
- `src/components/NextMedicationCard.tsx`
- `src/components/PrimaryButton.tsx`

**Checklist de validação local:**  
- Rodar `npx tsc --noEmit` e confirmar que não há erros.
- Abrir a HomeScreen da Maria.
- Verificar se o card “Próximo medicamento” ficou visualmente mais leve.
- Confirmar se o horário aparece claramente à esquerda.
- Confirmar se nome, dose e instruções continuam legíveis.
- Confirmar se o `StatusBadge` continua visível e bem alinhado.
- Testar com medicamento pendente, atrasado e tomado.
- Verificar o estado “Tudo em dia”.
- Conferir se o botão “Marcar como tomado” continua dominante.
- Conferir se os botões secundários continuam fáceis de tocar.
- Testar navegação para agenda, histórico e logout.
- Verificar a `MedicationDetailScreen`, pois ela também usa `PrimaryButton`.
- Verificar a `LoginScreen`, pois o botão principal também recebeu novo estilo.
- Testar em tela pequena, como iPhone SE ou Android compacto.
- Verificar se VoiceOver/TalkBack continuam lendo os rótulos corretamente.

**Observações para análise posterior no TCC:**  
Esta interação é relevante porque mostra o uso de Claude em uma etapa de refinamento estético e não apenas de geração funcional. A mudança buscou melhorar a percepção visual da interface, reduzir peso vertical da HomeScreen e reforçar hierarquia entre ação principal e ações secundárias.

Do ponto de vista das heurísticas de Nielsen, os ajustes preservam consistência e padrões, reconhecimento em vez de memorização e estética minimalista. O card continua comunicando claramente o próximo medicamento, mantendo status textual e ação principal visível.

Do ponto de vista do SUS, a melhoria estética pode contribuir para maior percepção de qualidade, facilidade de uso e confiança, especialmente porque a interface passa a parecer menos rudimentar e mais próxima de um produto real.

**Possíveis riscos ou limitações:**  
- O novo layout horizontal pode sofrer com textos longos.
- A sombra do botão pode variar entre iOS e Android.
- O botão secundário menor ainda respeita área de toque, mas deve ser testado com usuários.
- O texto em maiúsculas no card deve ser validado quanto à legibilidade.
- Como a alteração no `PrimaryButton` é global, pode haver efeitos visuais inesperados em outras telas.
- As mudanças são estéticas e não substituem uma revisão heurística formal ou teste com participantes.

---

### Interação C23

**Categoria:**  
QA / Correção de bugs / Backend / Documentação / Revisão de UI/UX

**Tela ou funcionalidade:**  
QA final do app com backend, autenticação, persistência, histórico semanal e reset de cenário demo.

**Objetivo do prompt:**  
Realizar uma rodada conservadora de QA final no app integrado ao Supabase, procurando bugs funcionais, regressões, inconsistências de estado, problemas de navegação, problemas de loading/erro, problemas de persistência, textos ambíguos, acoplamentos indevidos e riscos para a avaliação com participantes.

**Prompt enviado:**  
Foi solicitado que Claude revisasse o projeto de forma ampla, considerando autenticação, backend, HomeScreen, MedicationListScreen, MedicationDetailScreen, HistoryScreen, loading/error states, acessibilidade, arquitetura e documentação. O pedido enfatizou que a etapa deveria ser conservadora, corrigindo apenas problemas pequenos, claros e seguros, e listando problemas maiores como recomendações futuras.

**Resumo da resposta do Claude:**  
Claude realizou uma revisão geral do app e confirmou que o typecheck continuava passando. Foram modificados três arquivos: `HomeScreen.tsx`, `supabase/README.md` e `supabase/reset_logs.sql`.

Na `HomeScreen`, o rótulo “Ver histórico de hoje” foi alterado para “Ver histórico da semana”, pois a tela de histórico passou a apresentar uma visão semanal. Também foi ajustada a seção “Medicamentos de hoje” para não renderizar um card vazio quando não houver itens, evitando uma experiência confusa em cenários sem medicamentos.

No `supabase/reset_logs.sql`, Claude identificou um problema mais sério: o script atualizava todos os logs dos últimos 7 dias, reescrevendo `scheduled_for` para o dia atual e, consequentemente, colapsando o histórico semanal em um único dia. O script foi corrigido para filtrar apenas os logs do dia atual, preservando o histórico semanal. O `SELECT` de conferência também foi ajustado para refletir corretamente esse escopo.

No `supabase/README.md`, foi corrigida uma frase desatualizada que ainda dizia que o app não conhecia o Supabase desde a etapa C15. A documentação passou a refletir o estado atual do projeto, com autenticação e persistência reais já implementadas.

Além das correções sugeridas por Claude, foi realizado um ajuste manual na `HistoryScreen`: a lista de medicamentos registrados estava ficando muito longa, prejudicando a leitura e aumentando a carga visual da tela. Para tornar o histórico semanal mais usável, foi adicionado um seletor por dia (`<>`), permitindo navegar entre os dias e visualizar apenas os registros correspondentes ao dia selecionado. Essa alteração melhora a organização da informação e reduz a densidade visual da tela, mantendo o histórico útil sem sobrecarregar o usuário.

**Decisão tomada:**  
Aceito com pequenas alterações.

**Utilidade percebida:**  
5

**Retrabalho:**  
Baixo

**Problema ou limitação:**  
A etapa corrigiu problemas pontuais e também exigiu um pequeno ajuste manual de UX na HistoryScreen, pois a lista completa de medicamentos registrados ficava longa demais. Esse ajuste foi considerado de baixo retrabalho, pois não alterou a arquitetura nem o funcionamento principal do histórico, apenas melhorou a forma de apresentação dos registros por meio de seleção por dia.

Ainda permaneceram melhorias maiores fora do escopo desta interação, como adicionar contadores aos filtros, revisar textos com tom encorajador, melhorar tipagem das queries aninhadas do Supabase ou adicionar testes automatizados.

**Evidência:**  
Arquivos modificados por Claude:
- `src/screens/HomeScreen.tsx`
- `supabase/README.md`
- `supabase/reset_logs.sql`

Ajuste manual posterior:
- `HistoryScreen`, com adição de seletor por dia (`<>`) para reduzir o tamanho da lista de medicamentos registrados e melhorar a navegação pelo histórico.

Arquivos criados:
- Nenhum.

Dependências:
- Nenhuma dependência nova foi adicionada.

Typecheck:
- `npm run typecheck` passa sem erros.

**Problemas corrigidos:**  
- O botão da Home que levava para o histórico dizia “Ver histórico de hoje”, embora a tela mostre histórico semanal.
- A seção “Medicamentos de hoje” podia renderizar um card vazio em cenários sem medicamentos.
- `supabase/reset_logs.sql` atualizava logs de vários dias, podendo destruir a visão semanal do histórico.
- `supabase/README.md` continha uma descrição desatualizada do estado da integração com Supabase.
- A lista de medicamentos registrados no histórico semanal ficava longa demais; foi adicionada navegação por dia para reduzir a densidade visual.

**Problemas encontrados, mas não corrigidos:**  
- Os filtros da MedicationListScreen ainda não mostram contadores, apesar de isso ter sido considerado uma possível melhoria de UX.
- Textos como “Continue assim!” podem soar levemente julgadores ou encorajadores demais, devendo ser avaliados na revisão heurística.
- `getTodayDashboard` usa `new Date()` durante renderização, o que pode não atualizar automaticamente se o app atravessar a meia-noite aberto.
- Algumas queries do Supabase usam relações aninhadas para RLS sem tipagem totalmente explícita.
- A HistoryScreen não mostra `FeedbackBanner` se o usuário navegar para ela logo após marcar/desfazer em outra tela.
- Ainda não há testes automatizados.

**Checklist de QA final:**  
- Rodar `npm install --legacy-peer-deps`, se necessário.
- Conferir `.env` com `EXPO_PUBLIC_SUPABASE_URL` sem `/rest/v1`.
- Conferir `.env` com `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
- Rodar `reset_demo.sql` no mesmo dia da avaliação.
- Confirmar que o `SELECT` final do reset mostra os logs esperados.
- Rodar `npm run typecheck`.
- Login com Maria funciona.
- Logout funciona.
- Login com Carlos mostra apenas dados de Carlos.
- Login com Ana mostra apenas dados de Ana.
- Fechar e reabrir o app restaura sessão.
- Erro de login mostra mensagem amigável.
- Sem internet, o app mostra erro compreensível.
- Home da Maria mostra Losartana como próximo medicamento atrasado.
- Resumo do dia mostra 1 tomado, 2 pendentes e 1 atrasado.
- “Marcar como tomado” mostra banner verde e permite desfazer.
- “Ver agenda completa de hoje” abre a lista.
- “Ver histórico da semana” abre o histórico.
- MedicationListScreen filtra corretamente por status.
- MedicationDetailScreen abre o medicamento correto.
- HistoryScreen mostra resumo semanal e registros organizados por dia.
- O seletor por dia do histórico permite navegar entre os dias sem exibir uma lista excessivamente longa.
- Marcar/desfazer atualiza o histórico semanal.
- LoadingState aparece em cold start.
- ErrorState aparece em falha de rede/carregamento.
- VoiceOver/TalkBack lê os principais elementos.
- Status aparecem com texto e cor.
- `service_role` não aparece no código do app.

**Observações para análise posterior no TCC:**  
Esta interação é relevante porque representa uma etapa de controle de qualidade antes da avaliação heurística. Em vez de adicionar novas funcionalidades, Claude foi usado para procurar regressões e inconsistências no sistema já integrado ao backend.

A correção do `reset_logs.sql` é especialmente importante do ponto de vista metodológico, pois o histórico semanal precisa permanecer consistente para a avaliação. Se o script colapsasse todos os logs para o dia atual, os dados apresentados aos participantes ficariam incorretos, prejudicando a validade da avaliação.

Do ponto de vista de IHC, a alteração de “Ver histórico de hoje” para “Ver histórico da semana” melhora a correspondência entre linguagem da interface e comportamento real do sistema. A remoção de card vazio também evita uma situação visual ambígua que poderia ser interpretada como erro ou falha de carregamento.

O ajuste manual no histórico, com navegação por dia, também é relevante para o TCC porque mostra uma adaptação humana feita após observar uma limitação prática da solução gerada. A lista de registros estava longa demais e poderia prejudicar a legibilidade; a navegação por dia reduz a carga cognitiva e melhora a organização da informação sem alterar o escopo funcional do app.

**Possíveis riscos ou limitações:**  
- Ainda não há testes automatizados.
- O reset precisa ser executado corretamente no dia da banca ou avaliação.
- O app depende de conexão estável para login e persistência.
- A experiência offline é limitada a rollback e mensagens de erro.
- Algumas melhorias de UX ainda podem surgir na revisão heurística.
- Os filtros sem contadores podem ser apontados como oportunidade de melhoria.
- A linguagem de alguns estados positivos pode precisar ser ajustada para manter tom neutro.
- A ausência de realtime significa que alterações em outro dispositivo não aparecem automaticamente.
- A navegação por dia melhora o histórico, mas ainda deve ser validada para confirmar se os usuários entendem facilmente o uso dos controles `<>`.

---

### Interação C24

**Categoria:**  
Design de UI/UX / Histórico mensal / Visualização de dados simples / Supabase / Serviço de domínio / Ajuste manual

**Tela ou funcionalidade:**  
Aprimoramento da HistoryScreen com resumo mensal dos últimos 30 dias.

**Objetivo do prompt:**  
Adicionar uma visão mensal bonita, limpa e fácil de entender à tela de histórico, mostrando o percentual de medicamentos registrados nos últimos 30 dias, sem transformar a funcionalidade em avaliação clínica, adesão terapêutica ou recomendação médica.

**Prompt enviado:**  
Foi solicitado que Claude aprimorasse a `HistoryScreen` para apresentar um histórico mensal com resumo dos últimos 30 dias, percentual geral, quantidade de medicamentos registrados e previstos, além de uma visualização mensal simples e acessível. Também foi pedido que a solução priorizasse estética, clareza, acessibilidade, baixo esforço cognitivo e compatibilidade com Nielsen e SUS, sem adicionar bibliotecas de gráficos ou dependências novas.

**Resumo da resposta do Claude:**  
Claude criou os componentes `MonthlySummaryCard` e `MonthlyWeekProgressItem`. O primeiro exibe o percentual mensal em destaque, junto com uma frase explicativa e a quantidade de medicamentos registrados e previstos. O segundo apresenta o progresso por blocos semanais, com rótulo do período, faixa de datas, quantidade registrada, percentual e barra horizontal de reforço visual.

No `MedicationService`, foram adicionados novos tipos de view-model (`MonthlySummaryView`, `MonthlyWeekSummaryView` e `MonthlyHistoryView`) e uma função pura `getMonthlyHistory()`, responsável por calcular o histórico dos últimos 30 dias a partir de `logs`, `schedules` e `medications`, sem acessar Supabase, mocks ou UI.

O hook `useMedicationHistory` foi atualizado para expor tanto os dados mensais quanto os semanais. A `HistoryScreen` foi reestruturada para apresentar resumo do mês, progresso por semanas e navegador por dia. O `SupabaseMedicationRepository` passou a buscar logs dos últimos 30 dias, em vez de apenas 7 dias.

Também foram removidos os componentes antigos `WeeklySummaryCard` e `WeeklyDayProgressItem`, que não eram mais utilizados. O `reset_demo.sql` foi atualizado para gerar logs históricos de 29 dias anteriores, totalizando 30 dias, com padrões determinísticos para Maria, Carlos e Ana. A documentação em `supabase/README.md` e `README.md` também foi atualizada para refletir o histórico mensal e reforçar que os percentuais representam registros feitos no app, não comprovação clínica de consumo.

Após a implementação inicial, foi necessário realizar ajustes manuais. Alguns nomes de atributos gerados por Claude não estavam alinhados aos tipos/objetos reais usados no projeto, exigindo correção para que o código ficasse consistente com os view-models e componentes. Além disso, o problema de lista longa no histórico voltou a aparecer: a seção de medicamentos registrados ficava extensa demais, gerando novamente uma experiência próxima de “scroll infinito”. Para resolver isso, foi necessário ajustar novamente a apresentação dos medicamentos da semana/dia, mantendo a navegação por dia e evitando que a tela exibisse uma lista excessivamente longa de registros.

**Decisão tomada:**  
Aceito com alterações manuais relevantes.

**Utilidade percebida:**  
4

**Retrabalho:**  
Médio

**Problema ou limitação:**  
A funcionalidade gerada por Claude foi útil e trouxe uma melhoria importante para o histórico, mas exigiu correções manuais. Os nomes de alguns atributos precisaram ser ajustados para refletir corretamente a estrutura real do código. Além disso, a HistoryScreen voltou a apresentar excesso de registros em uma lista longa, problema que já havia aparecido no histórico semanal. Foi necessário corrigir novamente a organização da lista para evitar uma tela muito extensa e difícil de escanear.

A visualização mensal ficou mais rica e visualmente mais interessante, mas aumentou a complexidade do histórico e do reset demo. A opção por agrupar os 30 dias em 4 blocos semanais reduz a densidade visual, mas perde granularidade completa de todos os dias do mês na visualização principal. O navegador por dia continua sendo importante para manter a lista de registros controlada.

**Evidência:**  
Arquivos criados:
- `src/components/MonthlySummaryCard.tsx`
- `src/components/MonthlyWeekProgressItem.tsx`

Arquivos modificados:
- `src/services/MedicationService.ts`
- `src/hooks/useMedicationHistory.ts`
- `src/repositories/SupabaseMedicationRepository.ts`
- `src/screens/HistoryScreen.tsx`
- `src/components/DayNavigator.tsx`
- `src/components/MonthlyWeekProgressItem.tsx`
- `supabase/reset_demo.sql`
- `supabase/reset_logs.sql`
- `supabase/README.md`
- `README.md`

Arquivos removidos:
- `src/components/WeeklySummaryCard.tsx`
- `src/components/WeeklyDayProgressItem.tsx`

Ajustes manuais posteriores:
- Correção de nomes de atributos para alinhar a implementação aos tipos reais do projeto.
- Reorganização da lista de medicamentos registrados para evitar uma experiência de lista longa/scroll excessivo.
- Manutenção do seletor/navegador por dia para controlar a quantidade de registros exibidos na HistoryScreen.

**Modelagem do histórico mensal:**  
A janela considerada é composta pelo dia atual e os 29 dias anteriores, totalizando 30 dias. O `MedicationService` devolve um view-model mensal com:
- resumo geral do mês;
- total de medicamentos previstos;
- total de medicamentos registrados;
- percentual geral;
- 4 blocos semanais;
- lista de registros.

A divisão escolhida foi:
- Esta semana: D-0 até D-6;
- Semana passada: D-7 até D-13;
- Há 2 semanas: D-14 até D-20;
- Há 3 semanas: D-21 até D-29.

O último bloco contém 9 dias para fechar exatamente 30 dias sem criar uma quinta semana parcial. A faixa de datas exibida em cada bloco ajuda a deixar essa assimetria compreensível para o usuário.

**Cálculo dos percentuais:**  
O percentual é calculado como:

```txt
medicamentos registrados / medicamentos previstos * 100

---

### Interação C25

**Categoria:**  
Design de UI/UX / Perfil de usuário / Menu de conta / Navegação / Refinamento visual

**Tela ou funcionalidade:**  
Perfil simples da pessoa logada e menu de conta na HomeScreen.

**Objetivo do prompt:**  
Adicionar um perfil simples da pessoa logada, com aparência de app real, permitindo identificar claramente qual usuário demo está em uso e mantendo o logout acessível, sem criar funcionalidades complexas de configuração, edição de conta ou comunicação clínica.

**Prompt enviado:**  
Foi solicitado que Claude adicionasse um perfil compacto à HomeScreen, usando dados já disponíveis em `useAuth` ou `useCurrentPatient`, sem buscar dados diretamente do Supabase na tela. O pedido incluía avatar com iniciais, nome da pessoa, indicação de perfil fictício/de demonstração e botão de logout. Também foi explicitado que não deveriam ser implementadas funcionalidades como alterar senha, editar perfil, falar com médico ou configurações clínicas.

**Resumo da resposta do Claude:**  
Claude criou o componente `ProfileAvatar`, um avatar circular com iniciais da pessoa logada, com variantes pequena e grande. A variante pequena é usada no topo da HomeScreen, e a variante grande aparece dentro do menu de perfil. O helper `getInitials` foi exportado para gerar iniciais como `MS`, `CO` e `AS`.

Também foi criado o componente `ProfileMenu`, implementado como um modal estilo bottom-sheet. Esse menu mostra o avatar grande, o nome completo da pessoa, o rótulo “Perfil de demonstração”, um texto auxiliar e os botões “Sair da conta” e “Fechar”. O menu pode ser fechado pelo botão explícito ou pelo backdrop.

A `HomeScreen` foi modificada para substituir o `AppHeader` por um cabeçalho em linha, com saudação à esquerda e avatar à direita. O botão “Sair” foi removido da seção “Mais opções” e movido para dentro do `ProfileMenu`, mantendo a confirmação por `Alert` antes de realizar logout. A seção “Mais opções” passou a conter apenas ações de navegação, como “Ver agenda completa de hoje” e “Ver histórico”.

**Decisão tomada:**  
Aceito com pequenas alterações.

**Utilidade percebida:**  
5

**Retrabalho:**  
Baixo

**Problema ou limitação:**  
A solução melhora a identificação do usuário logado e a organização da HomeScreen, mas ainda é um perfil simples. Não há edição de dados, alteração de senha, personalização, foto real ou configurações avançadas, por decisão consciente de escopo. A implementação deve ser validada visualmente em telas pequenas para garantir que o cabeçalho em linha não prejudique a saudação nem a hierarquia da Home.

**Evidência:**  
Arquivos criados:
- `src/components/ProfileAvatar.tsx`
- `src/components/ProfileMenu.tsx`

Arquivos modificados:
- `src/screens/HomeScreen.tsx`

**Checklist de validação local:**  
- Fazer login como Maria e confirmar que o avatar mostra `MS`.
- Fazer login como Carlos e confirmar que o avatar mostra `CO`.
- Fazer login como Ana e confirmar que o avatar mostra `AS`.
- Tocar no avatar e confirmar que o bottom-sheet abre.
- Verificar se o menu mostra avatar grande, nome completo e “Perfil de demonstração”.
- Tocar fora do menu e confirmar que ele fecha.
- Tocar em “Fechar” e confirmar que o menu fecha.
- Tocar em “Sair da conta” e confirmar que o `Alert` aparece.
- Tocar em “Cancelar” e confirmar que o usuário permanece logado.
- Confirmar “Sair” e verificar se o app volta para a LoginScreen.
- Confirmar que “Sair” não aparece mais em “Mais opções”.
- Confirmar que “Mais opções” contém apenas ações navegacionais.
- Confirmar que o `NextMedicationCard` continua sendo o destaque da Home.
- Confirmar que “Marcar como tomado” e “Desfazer” continuam funcionando.
- Navegar para agenda, detalhe e histórico e voltar para a Home.
- Rodar `npx tsc --noEmit`.

**Observações para análise posterior no TCC:**  
Esta interação é relevante porque melhora a aparência de produto da interface sem expandir o escopo funcional do app. O perfil simples ajuda a reforçar a identidade do usuário logado, o que é especialmente útil no contexto do TCC, em que há três perfis fictícios diferentes para demonstração e avaliação.

Do ponto de vista de IHC, a solução contribui para visibilidade do estado do sistema, pois deixa claro quem está usando o app. Também melhora consistência e organização ao separar ações de navegação das ações de conta. O logout passa a ficar em um lugar mais esperado, dentro do menu de perfil, em vez de misturado às ações de “Mais opções”.

Do ponto de vista do SUS, a mudança pode contribuir para a percepção de integração, confiança e familiaridade, pois o app passa a seguir um padrão comum de aplicativos móveis: avatar/perfil no topo e menu de conta com opção de sair.

A decisão de não implementar configurações avançadas também é importante para o TCC. Ela mantém o foco no objetivo principal: organização e registro de medicamentos. Funcionalidades como editar perfil, alterar senha ou falar com médico poderiam diluir o foco da avaliação e introduzir expectativas clínicas ou de suporte que não fazem parte do escopo do trabalho.

**Possíveis riscos ou limitações:**  
- O perfil é apenas informativo, sem edição de dados.
- Não há foto real, apenas iniciais, por escolha de privacidade e simplicidade.
- O menu de perfil aparece apenas na HomeScreen, não em todas as telas internas.
- O bottom-sheet deve ser testado com leitor de tela para garantir fechamento e foco adequados.
- O cabeçalho customizado da Home substituiu o `AppHeader`, o que deve ser observado para manter consistência visual.
- A opção “Sair da conta” exige confirmação, mas ainda pode ser considerada menos visível por usuários que esperavam encontrá-la em “Mais opções”.

---

### Interação C25.1

**Categoria:**  
Ideação / Priorização de escopo / UI/UX / Avaliação de melhorias

**Tela ou funcionalidade:**  
Melhorias possíveis para o ProfileMenu e perfil da pessoa logada.

**Objetivo do prompt:**  
Avaliar quais melhorias adicionais fariam sentido para o menu de perfil, considerando estética, usabilidade, heurísticas de Nielsen, SUS, escopo do TCC e pouco tempo restante de desenvolvimento.

**Prompt enviado:**  
Foi solicitado que Claude sugerisse melhorias possíveis para o perfil da pessoa logada, sem implementar automaticamente. O objetivo era identificar ideias que deixassem o perfil mais útil, confiável e com aparência de app real, mas sem criar funcionalidades avançadas de conta, configurações ou comunicação clínica.

**Resumo da resposta do Claude:**  
Claude sugeriu melhorias organizadas por categoria. Entre as ideias de baixo esforço, propôs exibir o e-mail da conta da pessoa, idade e data de criação/uso do app. Como melhorias de maior valor para SUS, sugeriu mostrar o total de medicamentos acompanhados, um resumo dos registros dos últimos 30 dias e o total de doses já registradas. Também sugeriu um bloco “Sobre esta demonstração”, explicando que os dados são fictícios e usados para avaliação acadêmica, além de um rodapé com contexto acadêmico, como “Takere · TCC em Ciência da Computação · UFRGS · 2026”.

Claude também listou ideias que não recomenda implementar, como streaks, troféus, botões desabilitados de “Editar perfil” ou “Alterar senha”, tela cheia de configurações, alteração de tema e funcionalidades como “falar com médico”. A justificativa foi evitar aumento de escopo, evitar aparência de funcionalidade incompleta e não transformar o app em canal clínico.

Após análise, foi decidido que as sugestões mais pertinentes seriam:
- exibir o e-mail da conta;
- exibir o total de medicamentos acompanhados;
- incluir um bloco “Sobre esta demonstração”;
- adicionar um rodapé acadêmico discreto;
- considerar um resumo simples dos registros do mês apenas se for fácil reaproveitar os dados já existentes.

Também foi decidido não implementar, neste momento:
- idade no menu;
- data de criação da conta;
- total acumulado de doses registradas;
- botão separado “Trocar de perfil de demonstração”;
- alteração de senha;
- edição de perfil;
- falar com médico;
- configurações avançadas.

**Decisão tomada:**  
Usado como base para priorização de escopo.

**Utilidade percebida:**  
5

**Retrabalho:**  
Nenhum

**Problema ou limitação:**  
A interação não gerou código diretamente, mas ajudou a decidir quais melhorias valem ser implementadas posteriormente. Algumas sugestões poderiam melhorar a percepção de completude do app, mas também aumentariam o risco de poluição visual ou desvio de escopo se implementadas em excesso.

**Evidência:**  
Não houve alteração de arquivos nesta interação.

Sugestões consideradas para uma possível próxima etapa:
- adicionar e-mail da conta no `ProfileMenu`;
- adicionar total de medicamentos acompanhados;
- adicionar bloco “Sobre esta demonstração”;
- adicionar rodapé acadêmico discreto;
- opcionalmente adicionar resumo simples dos registros do mês, se o esforço for baixo.

**Observações para análise posterior no TCC:**  
Esta interação é relevante porque mostra o uso de Claude não apenas para gerar código, mas também para apoiar decisões de escopo e priorização de funcionalidades. A resposta ajudou a separar melhorias úteis para usabilidade e transparência de funcionalidades que poderiam gerar complexidade desnecessária.

Do ponto de vista de IHC, as melhorias priorizadas reforçam visibilidade do estado do sistema, ajuda/documentação, correspondência com o mundo real e confiança. O bloco “Sobre esta demonstração” é especialmente importante para deixar claro que os dados são fictícios e que o app tem finalidade acadêmica.

Do ponto de vista do SUS, mostrar a conta logada, o total de medicamentos acompanhados e informações simples sobre o mês pode aumentar a percepção de integração e confiança. Porém, o excesso de métricas ou funcionalidades incompletas poderia ter o efeito oposto, tornando o sistema mais complexo.

**Possíveis riscos ou limitações:**  
- Adicionar muitas informações ao ProfileMenu pode deixá-lo visualmente carregado.
- Métricas como percentual mensal podem duplicar conteúdo da HistoryScreen.
- Idade no menu pode parecer informação pessoal desnecessária.
- Botões desabilitados de configuração poderiam parecer funcionalidades quebradas.
- Funcionalidades como “falar com médico” poderiam deslocar o escopo do app para comunicação clínica, o que não faz parte do TCC.
- Streaks/troféus poderiam infantilizar a experiência ou gerar sensação de cobrança.