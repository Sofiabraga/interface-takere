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


**Prompt de fato:** 
Estou desenvolvendo um TCC em Ciência da Computação na UFRGS com o tema: “Um estudo exploratório do uso de Claude no desenvolvimento e avaliação de uma interface mHealth”. O artefato prático será uma interface mobile mHealth para gestão de medicamentos em tratamentos de média e longa duração, no contexto do projeto Takere/UFRGS. A interface não deve ser tratada como sistema clínico autônomo nem como ferramenta de decisão médica. O foco é apoio à organização do tratamento, visualização de medicamentos, horários, doses, status e registro de tomadas. Quero começar o desenvolvimento usando React Native com Expo, mas de uma forma que o projeto não fique fortemente acoplado ao Expo. Ou seja, quero usar Expo principalmente para facilitar o desenvolvimento inicial, mas mantendo uma arquitetura que permita remover ou substituir esse layer no futuro com o mínimo de impacto possível. Requisitos importantes de arquitetura: 1. Usar React Native + TypeScript. 2. Usar Expo apenas como camada inicial de execução/desenvolvimento. 3. Evitar dependência forte de recursos específicos do Expo. 4. Não usar expo-router neste momento; prefiro uma navegação mais portável, como React Navigation. 5. Sempre que algum recurso específico do Expo for necessário, criar uma abstração/adaptador em vez de usar diretamente nas telas. 6. Manter separação clara entre: - screens; - components; - domain/models; - mock data; - services; - adapters; - hooks; - utils. 7. Usar dados fictícios/mocks, sem dados reais de pacientes. 8. Priorizar clareza, acessibilidade, simplicidade visual e boa usabilidade. 9. A interface deve ser adequada para avaliação posterior com heurísticas de Nielsen e SUS. 10. Evitar criar complexidade desnecessária no início. Funcionalidades iniciais desejadas: 1. Tela inicial com resumo dos medicamentos do dia. 2. Lista de medicamentos com: - nome; - dose; - horário; - status: pendente, tomado ou atrasado. 3. Destaque para o próximo medicamento. 4. Tela de detalhe do medicamento. 5. Ação para registrar medicamento como tomado. 6. Histórico simples de tomadas. 7. Uso de pacientes mockados, se fizer sentido para o fluxo. Perfis mockados que podem ser usados: - Maria Silva, 68 anos, baixa familiaridade tecnológica, tratamento contínuo. - Carlos Oliveira, 45 anos, familiaridade média com tecnologia. - Ana Souza, 30 anos, familiaridade alta com tecnologia. Quero que você comece me ajudando em etapas. Primeiro, faça: 1. Proponha a arquitetura inicial de pastas. 2. Explique quais dependências devo instalar e por quê. 3. Explique quais dependências evitar para não acoplar demais ao Expo. 4. Defina os tipos principais do domínio, como Patient, Medication, MedicationSchedule, MedicationStatus e MedicationLog. 5. Proponha o fluxo inicial de telas. 6. Depois gere os arquivos iniciais do projeto em React Native + TypeScript. Restrições de implementação: - Não use dados reais de saúde. - Não implemente prescrição médica, recomendação clínica ou alteração de tratamento. - Não crie funcionalidades clínicas avançadas. - Não assuma backend neste primeiro momento; use mocks locais. - Não use bibliotecas sem explicar o motivo. - Não acople regras de negócio diretamente nas telas. - Componentes visuais devem ser reutilizáveis. - Código deve ser limpo, legível e fácil de explicar no TCC. Também quero que, ao final de cada resposta, você inclua uma pequena seção chamada “Registro para o TCC”, contendo: - Categoria da interação: ideação, arquitetura, geração de código, design visual, bug, refatoração etc. - O que foi sugerido. - O que provavelmente exigirá revisão humana. - Possíveis riscos ou limitações da solução proposta. Comece pela arquitetura inicial e pelo plano de implementação. Não gere código demais de uma vez; prefiro evoluir o app em pequenos passos.


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

**Prompt de fato:** 
Pode seguir com a opção (a), usando paciente fixo Maria Silva.

Gere apenas a base inicial do projeto, sem implementar telas completas ainda.

Quero que você gere:

1. package.json com as dependências mínimas necessárias.
2. tsconfig.json adequado para React Native + TypeScript.
3. babel.config.js, se necessário.
4. App.tsx com a estrutura mínima de entrada do app.
5. src/navigation/RootNavigator.tsx com React Navigation usando Native Stack.
6. src/navigation/routes.ts com os nomes/tipos das rotas.
7. Os tipos principais do domínio em arquivos separados:
   - src/domain/enums/MedicationStatus.ts
   - src/domain/enums/TechFamiliarity.ts
   - src/domain/models/Patient.ts
   - src/domain/models/Medication.ts
   - src/domain/models/MedicationSchedule.ts
   - src/domain/models/MedicationLog.ts
8. Um mock simples da paciente Maria Silva em:
   - src/mocks/patients.mock.ts
9. Uma tela placeholder mínima para HomeScreen, apenas para validar que o app abre:
   - src/screens/HomeScreen.tsx

Restrições importantes:

- Não use expo-router.
- Não use dados reais de saúde.
- Não implemente ainda lista completa, histórico ou registro de tomada.
- Não importe nenhuma lib expo-* diretamente em screens.
- Não coloque regra de negócio dentro da tela.
- Não adicione bibliotecas além das já justificadas.
- Use nomes em inglês no código e textos visíveis em português na interface.
- Mantenha o código simples, legível e fácil de explicar no TCC.

Ao final, inclua novamente a seção “Registro para o TCC” com:
- Categoria da interação.
- O que foi sugerido/gerado.
- O que provavelmente exigirá revisão humana.
- Possíveis riscos ou limitações.

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

**Prompt real:**
 Agora quero evoluir o projeto com foco forte em UI/UX, clareza visual, consistência e boa usabilidade,    
  pensando que o app será avaliado futuramente com heurísticas de Nielsen e SUS.                            
                                                                                                            
  Importante:                                                                                               
  - O público principal da primeira versão deve ser a paciente Maria Silva, 68 anos, com baixa              
  familiaridade tecnológica.                                                                                
  - A interface deve ser simples, intuitiva, limpa, agradável e legível.                                    
  - Quero priorizar clareza, acessibilidade e boa estética, sem exagerar em complexidade.                   
                                                                                                            
  Faça apenas esta próxima etapa:                                                                           
                                                                                                            
  1. Crie uma base visual do app em:                                                                        
     - src/theme/colors.ts                                                                                  
     - src/theme/spacing.ts                                                                                 
     - src/theme/typography.ts                                                                              
     - src/theme/radius.ts                                                                                  
     - src/theme/index.ts                                                                                   
                                                                                                            
  2. Crie componentes reutilizáveis básicos em:                                                             
     - src/components/ScreenContainer.tsx                                                                   
     - src/components/AppHeader.tsx                                                                         
     - src/components/Card.tsx                                                                              
     - src/components/SectionTitle.tsx                                                                      
     - src/components/PrimaryButton.tsx                                                                     
     - src/components/StatusBadge.tsx                                                                       
                                                                                                            
  3. Atualize a HomeScreen para deixá-la visualmente mais consistente e mais adequada ao contexto do app,   
  ainda de forma simples, contendo:                                                                         
     - saudação para Maria Silva;                                                                           
     - resumo textual do dia;                                                                               
     - um card de “próximo medicamento” com dados mockados simples;                                         
     - uma pequena seção “medicamentos de hoje” com poucos itens mockados;                                  
     - botões/ações simples e claras;                                                                       
     - textos em português.                                                                                 
                                                                                                            
  Restrições:                                                                                               
  - Não implemente ainda lista completa, detalhe completo ou histórico completo.                            
  - Não implemente backend.                                                                                 
  - Não adicione bibliotecas extras sem justificar.                                                         
  - Não use expo-* diretamente nas screens.                                                                 
  - Não acople regras de negócio na tela.                                                                   
  - Priorize boa hierarquia visual, contraste, legibilidade e consistência.                                 
  - Status devem ser comunicados por texto e cor.                                                           
  - O visual deve ser limpo e fácil de explicar no TCC.                                                     
                                                                                                            
  Ao final, inclua:                                                                                         
  1. explicação breve das decisões de UI/UX tomadas;                                                        
  2. como essas decisões ajudam em usabilidade; 

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

**Prompt de fato:**
Agora quero fazer a próxima etapa do app com foco em deixar a HomeScreen mais parecida com uma interface real, bonita, consistente e adequada para avaliação de IHC.

Contexto:
Estou desenvolvendo um TCC em Ciência da Computação sobre o uso de Claude no desenvolvimento e avaliação de uma interface mHealth. A interface será avaliada posteriormente com heurísticas de Nielsen e SUS. Um dos avaliadores é da área de IHC, então a UI/UX precisa ser bem cuidada, clara, intuitiva e visualmente consistente.

A paciente principal da primeira versão continua sendo Maria Silva, 68 anos, baixa familiaridade tecnológica. A interface deve ser acessível, legível e simples, mas sem parecer rudimentar.

Objetivo desta etapa:
Transformar a HomeScreen em um dashboard inicial de medicamentos do dia, visualmente mais completo e organizado, sem ainda criar todas as telas do app.

Implemente apenas esta etapa:

1. Organize dados mockados de medicamentos em arquivos separados:
   - src/mocks/medications.mock.ts
   - src/mocks/medicationSchedules.mock.ts
   - src/mocks/medicationLogs.mock.ts

2. Crie uma camada de serviço:
   - src/services/MedicationService.ts

   Esse service deve:
   - usar os mocks internamente;
   - retornar os medicamentos do dia da paciente atual;
   - retornar o próximo medicamento em destaque;
   - retornar um resumo do dia com quantidade de medicamentos tomados, pendentes e atrasados;
   - não depender de backend;
   - não usar AsyncStorage ainda;
   - não conter regras clínicas, apenas organização e apresentação dos dados mockados.

3. Crie um hook:
   - src/hooks/useTodayMedications.ts

   Esse hook deve:
   - consumir o MedicationService;
   - entregar para a HomeScreen os dados já preparados;
   - evitar que a tela tenha regra de negócio ou acesse mocks diretamente.

4. Crie componentes visuais reutilizáveis específicos para esta tela:
   - src/components/MedicationSummaryCard.tsx
   - src/components/NextMedicationCard.tsx
   - src/components/MedicationListItem.tsx
   - src/components/StatusLegend.tsx

5. Atualize a HomeScreen para usar esses componentes.

A HomeScreen deve conter:

- saudação clara para Maria;
- texto curto explicando o objetivo da tela;
- card em destaque para o próximo medicamento;
- resumo visual do dia com tomados, pendentes e atrasados;
- lista curta de medicamentos de hoje;
- legenda simples dos status;
- botões ou ações claras, mas sem implementar navegação complexa ainda.

Diretrizes de UI/UX:

- A tela deve parecer mais polida e menos rudimentar.
- Use boa hierarquia visual.
- Use espaçamento generoso.
- Use cards consistentes.
- Use textos em português.
- Use status com cor + texto, nunca apenas cor.
- Evite excesso de informação.
- Evite termos clínicos complexos.
- Priorize fonte legível e elementos fáceis de tocar.
- Pense em uma pessoa idosa usando a interface, mas sem infantilizar o design.
- A interface deve transmitir calma, clareza e confiança.
- A ação principal da tela deve ser fácil de identificar.
- Não use ícones por enquanto, para evitar adicionar dependências.
- Não use animações por enquanto.
- Não adicione bibliotecas novas.
- Não use expo-* diretamente em screens ou components.
- Não implemente prescrição, recomendação clínica ou alteração de tratamento.
- Não use dados reais de saúde.
- Não implemente login, backend ou persistência.

Importante:
Se precisar criar tipos auxiliares para a Home, coloque-os em local adequado e explique a decisão. Não coloque lógica de montagem de dados diretamente na HomeScreen.

Ao responder:
1. Liste os arquivos criados/modificados.
2. Explique brevemente as decisões de UI/UX tomadas.
3. Explique como essas decisões ajudam na futura avaliação por heurísticas de Nielsen e SUS.
4. Inclua uma checklist de teste local.

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