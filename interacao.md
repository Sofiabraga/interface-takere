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