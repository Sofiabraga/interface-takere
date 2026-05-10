# interface-takere
Interface do Takere

## Backend e persistência

Este projeto usa Supabase como backend simples para autenticação e persistência dos dados fictícios de demonstração.

O backend é usado apenas para:
- autenticação de usuários demo;
- persistência de medicamentos fictícios;
- persistência de horários/agendamentos fictícios;
- persistência dos registros de tomada.

O sistema não é uma ferramenta clínica, não realiza prescrição, não recomenda condutas médicas e não usa dados reais de pacientes.

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com:

EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=

Nunca commitar chaves secretas ou `service_role`.

## Usuários demo

Usuários fictícios usados para avaliação:

- Maria Silva — 68 anos — baixa familiaridade tecnológica
- Carlos Oliveira — 45 anos — familiaridade média com tecnologia
- Ana Souza — 30 anos — alta familiaridade tecnológica

Os e-mails e senhas devem ser fictícios e usados apenas no ambiente de demonstração.

## Rodando localmente

npm install
npm run start

(Depois i para iOS Simulator, a para Android Emulator, ou abrir o QR code no Expo Go.) 

## Aviso sobre dados

Todos os dados usados neste projeto são fictícios e têm finalidade exclusivamente acadêmica.

## Autenticação com Supabase

A partir da C16, o app possui autenticação com Supabase.

### Dependências

Instale as dependências necessárias com:

```bash
npx expo install @supabase/supabase-js @react-native-async-storage/async-storage react-native-url-polyfill