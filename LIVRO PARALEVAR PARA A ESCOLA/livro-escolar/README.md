# Livro Escolar - Controle de Livros Didáticos

Aplicativo para controlar quais livros didáticos os alunos devem levar para a escola, de acordo com o horário e disciplinas do dia.

**Escola Professor Pedro Teixeira Barroso**  
Desenvolvido por: Genezio de Lavor Oliveira  
Clube de Robótica Criativa

## Funcionalidades

- Cadastro de alunos por série, turno e horário
- Cadastro de professores e suas disciplinas
- Cadastro dos livros didáticos por disciplina
- Configuração de horários de aula por dia da semana
- Sistema de lembretes com notificações
- Envio de notificações 30 minutos antes do horário de aula
- 3 lembretes sequenciais para garantir que o aluno não esqueça o livro

## Estrutura do Projeto

O projeto está organizado em duas partes principais:

1. **Frontend** (Aplicativo móvel em React Native com Expo)
2. **Backend** (API RESTful em Node.js com Express e MongoDB)

## Requisitos

- Node.js 14+
- MongoDB (ou MongoDB Atlas)
- Expo CLI
- Conta no Expo para geração do APK

## Configuração do Ambiente de Desenvolvimento

### Backend

1. Navegue até a pasta do backend:
```
cd livro-escolar/backend
```

2. Instale as dependências:
```
npm install
```

3. Crie um arquivo `.env` com as seguintes variáveis:
```
PORT=5000
MONGODB_URI=sua_string_de_conexão_mongodb
```

4. Inicie o servidor:
```
npm start
```

### Frontend

1. Navegue até a pasta do frontend:
```
cd livro-escolar/frontend
```

2. Instale as dependências:
```
npm install
```

3. Edite o arquivo `src/api/api.js` e atualize o endereço da API:
```javascript
const API_URL = 'http://seu_ip_ou_dominio:5000/api';
```

4. Inicie o aplicativo em modo de desenvolvimento:
```
npx expo start
```

## Gerando APK

1. Instale o Expo CLI globalmente (se ainda não tiver):
```
npm install -g expo-cli
```

2. Faça login na sua conta Expo:
```
expo login
```

3. Execute o build do Android:
```
expo build:android -t apk
```

4. Siga as instruções na tela para completar o processo.

## Fluxo de Uso do Aplicativo

1. **Cadastrar Professores**: Adicione os professores e suas respectivas disciplinas.
2. **Cadastrar Livros**: Adicione os livros didáticos associando-os às disciplinas.
3. **Cadastrar Alunos**: Adicione os alunos com suas séries, turnos e números de telefone.
4. **Configurar Horários**: Configure os horários de aula para cada série, dia da semana e disciplina.
5. **Configurar Lembretes**: Na aba de lembretes, configure os lembretes automaticamente para todos os alunos.

## Recebendo Notificações

Os alunos (ou responsáveis) receberão notificações:
- 30 minutos antes de cada aula
- Com 3 lembretes consecutivos (a cada 10 minutos)
- Mostrando qual livro levar para qual disciplina

## Suporte e Contato

Para suporte ou dúvidas, entre em contato com:  
Genezio de Lavor Oliveira - Clube de Robótica Criativa

## Licença

Este projeto está licenciado sob a licença MIT - consulte o arquivo LICENSE para obter detalhes. 