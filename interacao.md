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