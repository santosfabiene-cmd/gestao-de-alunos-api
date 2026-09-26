# Gestão de Alunos API

API REST para gestão de alunos, disciplinas, notas e trabalhos, com persistência em MongoDB.

Este projeto também contém uma suíte de **testes automatizados de API**, desenvolvida com **Mocha, SuperTest e Chai**, utilizando **Data-Driven Testing**, **Dotenv**, Helpers de autenticação e execução automatizada através do **GitHub Actions**.

---

## Descrição

A API modela um cenário de gestão escolar com dois tipos de usuários:

- **Administrador**: cadastra alunos, cadastra disciplinas, matricula alunos em disciplinas e lança notas.
- **Aluno**: consulta as disciplinas em que está matriculado, consulta suas próprias notas e registra trabalhos para as disciplinas cursadas.

As rotas estão organizadas da seguinte forma:

- `/api/admin/*` — operações administrativas.
- `/api/alunos/*` — operações relacionadas ao aluno.
- `/api/auth/login` — autenticação de administradores e alunos.

A autenticação da API utiliza **JWT (JSON Web Token)**.

O banco de dados utilizado é o **MongoDB**, acessado através do **Mongoose**.

---

## Tecnologias utilizadas

### API

- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcryptjs
- Swagger
- CORS
- Morgan

### Testes automatizados

- **Mocha** — framework utilizado para execução dos testes.
- **SuperTest** — utilizado para realizar requisições HTTP contra a API.
- **Chai** — biblioteca utilizada para as asserções.
- **Dotenv** — utilizado para carregar variáveis de ambiente.
- **JSON** — utilizado para implementar Data-Driven Testing.
- **GitHub Actions** — utilizado para executar os testes automaticamente na pipeline.

---

## Arquitetura do projeto

```text
gestao-de-alunos-api/
│
├── .github/
│   └── workflows/
│       └── tests.yml
│
├── docs/
│   └── openapi.yaml
│
├── src/
│   ├── app.js
│   ├── server.js
│   │
│   ├── config/
│   │   └── jwt.js
│   │
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   │
│   └── database/
│       ├── db.js
│       └── seed.js
│
├── test/
│   ├── data/
│   │   └── testData.json
│   │
│   ├── helpers/
│   │   ├── adminHelper.js
│   │   └── userHelper.js
│   │
│   ├── aluno.test.js
│   └── auth.test.js
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

# Instalação e execução

## Pré-requisitos

Para executar o projeto localmente é necessário possuir:

- Node.js 18 ou superior
- npm
- MongoDB
- Git

---

## Clonar o repositório

```bash
git clone https://github.com/santosfabiene-cmd/gestao-de-alunos-api.git
```

Entre na pasta:

```bash
cd gestao-de-alunos-api
```

---

## Instalar as dependências

Execute:

```bash
npm install
```

---

## Configuração do MongoDB

Por padrão, a aplicação utiliza:

```text
mongodb://127.0.0.1:27017/gestao-de-alunos
```

Também é possível configurar outra conexão utilizando:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/gestao-de-alunos
```

Na primeira execução com o banco vazio, a aplicação realiza uma carga inicial de dados através do arquivo:

```text
src/database/seed.js
```

Entre os dados iniciais está o administrador utilizado para autenticação.

---

## Variáveis de ambiente

Crie um arquivo:

```text
.env
```

na raiz do projeto.

Exemplo utilizado nos testes:

```env
ADMIN_EMAIL=admin@escola.com
ADMIN_PASSWORD=admin123
```

O projeto utiliza **Dotenv** para carregar essas variáveis.

O arquivo `.env` não deve ser enviado ao GitHub e está incluído no `.gitignore`.

---

# Executando a aplicação

Modo produção:

```bash
npm start
```

Modo desenvolvimento:

```bash
npm run dev
```

Por padrão, o servidor fica disponível em:

```text
http://localhost:3000
```

---

# Documentação da API

A documentação Swagger pode ser acessada em:

```text
http://localhost:3000/api-docs
```

O arquivo OpenAPI encontra-se em:

```text
docs/openapi.yaml
```

---

# Autenticação

A API utiliza autenticação JWT.

O login é realizado através de:

```text
POST /api/auth/login
```

Exemplo de autenticação do administrador:

```json
{
  "email": "admin@escola.com",
  "senha": "admin123"
}
```

Após o login, a API retorna um token.

Esse token deve ser utilizado nas rotas protegidas:

```text
Authorization: Bearer <token>
```

---

# Testes automatizados

Os testes automatizados foram implementados utilizando:

- **Mocha**
- **SuperTest**
- **Chai**

Para executar todos os testes:

```bash
npm test
```

O comando configurado no projeto executa:

```bash
mocha test/**/*.test.js --exit
```

---

## Cenário automatizado

O principal fluxo automatizado simula operações reais da API.

### 1. Login como administrador

O teste realiza autenticação através de:

```text
POST /api/auth/login
```

O token retornado é utilizado nas operações administrativas.

### 2. Cadastro de um novo aluno

O administrador realiza:

```text
POST /api/admin/alunos
```

Os dados utilizados no teste são obtidos do arquivo JSON de Data-Driven Testing.

### 3. Criação de uma disciplina

Para permitir o fluxo completo de entrega do trabalho, o teste cria uma disciplina através de:

```text
POST /api/admin/disciplinas
```

### 4. Matrícula do aluno

O aluno criado é matriculado na disciplina:

```text
POST /api/admin/disciplinas/{disciplinaId}/matriculas
```

### 5. Login como aluno

Após o cadastro, o teste realiza autenticação utilizando as credenciais do novo aluno.

### 6. Registro da entrega de trabalho

Autenticado como aluno, o teste registra a entrega através de:

```text
POST /api/alunos/{alunoId}/trabalhos
```

O teste verifica se a API retorna:

```text
HTTP 201 Created
```

Também é validado o título do trabalho registrado.

---

# Data-Driven Testing

Os testes implementam o conceito de **Data-Driven Testing**.

Os dados utilizados estão separados da lógica dos testes e armazenados em:

```text
test/data/testData.json
```

Exemplo:

```json
{
  "novoAluno": {
    "nome": "Aluno Teste Automatizado",
    "email": "aluno.automatizado@teste.com",
    "matricula": "2026999",
    "senha": "123456"
  },
  "trabalho": {
    "disciplinaId": "disciplina-matematica",
    "titulo": "Trabalho Automatizado - Mocha"
  },
  "loginInvalido": {
    "senha": "senha-incorreta"
  }
}
```

Durante a execução, alguns dados, como e-mail e matrícula, são gerados dinamicamente para evitar conflitos entre diferentes execuções dos testes.

---

# Helpers

Para evitar duplicação de código, os processos de autenticação foram separados em Helpers.

## Helper de administrador

Arquivo:

```text
test/helpers/adminHelper.js
```

Responsável por realizar o login do administrador e retornar o token JWT.

Uso:

```javascript
tokenAdmin = await loginAdmin();
```

---

## Helper de usuário

Arquivo:

```text
test/helpers/userHelper.js
```

Responsável por autenticar o aluno.

Uso:

```javascript
tokenAluno = await loginUsuario(
  novoAluno.email,
  novoAluno.senha
);
```

Dessa forma, a lógica de autenticação pode ser reutilizada pelos testes.

---

# Estrutura dos testes

```text
test/
│
├── aluno.test.js
├── auth.test.js
│
├── data/
│   └── testData.json
│
└── helpers/
    ├── adminHelper.js
    └── userHelper.js
```

### `aluno.test.js`

Responsável pelo fluxo:

```text
Login Admin
     ↓
Cadastrar aluno
     ↓
Criar disciplina
     ↓
Matricular aluno
     ↓
Login Aluno
     ↓
Registrar trabalho
```

### `auth.test.js`

Responsável pelos testes de autenticação, incluindo:

- login válido do administrador;
- tentativa de login utilizando senha inválida.

---

# Resultado dos testes

Na execução local, a suíte foi concluída com sucesso:

```text
7 passing
```

Entre os cenários validados estão:

```text
✔ deve cadastrar um novo aluno usando dados do arquivo JSON
✔ deve criar uma disciplina para o teste
✔ deve matricular o aluno na disciplina
✔ deve realizar login como aluno
✔ deve submeter um trabalho como aluno
✔ deve retornar 200 e um token quando o admin informar e-mail e senha corretos
✔ deve retornar 401 quando a senha informada for inválida
```

---

# Integração Contínua com GitHub Actions

Os testes também são executados automaticamente através do **GitHub Actions**.

O workflow está localizado em:

```text
.github/workflows/tests.yml
```

A pipeline utiliza:

- Ubuntu
- Node.js
- MongoDB
- npm
- Mocha
- SuperTest
- Chai

---

## Gatilhos da pipeline

A pipeline pode ser executada através de:

### Push na branch main

```yaml
push:
  branches: [main]
```

### Pull Request para main

```yaml
pull_request:
  branches: [main]
```

### Execução manual

```yaml
workflow_dispatch:
```

A execução manual pode ser iniciada através da aba:

```text
GitHub → Actions → Testes de API → Run workflow
```

---

# Etapas da pipeline

O GitHub Actions executa as seguintes etapas:

```text
Checkout do código
        ↓
Configuração do Node.js
        ↓
Inicialização do MongoDB
        ↓
Instalação das dependências
        ↓
Execução do npm test
        ↓
Validação dos testes
```

O MongoDB utilizado na pipeline é configurado através da variável:

```text
MONGODB_URI=mongodb://127.0.0.1:27017/gestao-de-alunos-test
```

As credenciais utilizadas pelos testes também são disponibilizadas como variáveis de ambiente da pipeline.

---

# Resultado da pipeline

Os testes foram executados com sucesso no GitHub Actions.

Exemplo de execução:

```text
Status: Success
```

Resultado da suíte:

```text
7 passing (560ms)
```

Isso demonstra que os testes funcionam tanto no ambiente local quanto no ambiente de Integração Contínua.

---

# Requisitos atendidos

| Requisito | Implementação |
|---|---|
| Fork do projeto original | Concluído |
| Login como administrador | Teste automatizado |
| Cadastro de aluno | Teste automatizado |
| Login como aluno | Teste automatizado |
| Registro da entrega de trabalho | Teste automatizado |
| Mocha | Utilizado |
| SuperTest | Utilizado |
| Chai | Utilizado |
| Data-Driven Testing | `test/data/testData.json` |
| Dotenv | Utilizado |
| Helper de Admin | `test/helpers/adminHelper.js` |
| Helper de Usuário | `test/helpers/userHelper.js` |
| GitHub Actions | `.github/workflows/tests.yml` |
| Testes executando na pipeline | 7 testes passando |

---

# Repositório

Projeto desenvolvido a partir de um fork do repositório proposto na atividade.

**Repositório do projeto:**

https://github.com/santosfabiene-cmd/gestao-de-alunos-api

**Repositório original:**

https://github.com/juliodelimas/gestao-de-alunos-api

---

## Resultado final

O projeto possui testes automatizados cobrindo o fluxo solicitado na atividade:

```text
Administrador realiza login
        ↓
Administrador cadastra aluno
        ↓
Aluno é matriculado
        ↓
Aluno realiza login
        ↓
Aluno registra a entrega de um trabalho
```

Os dados de teste são organizados através de **Data-Driven Testing**, as autenticações são reutilizadas através de **Helpers**, as configurações são carregadas com **Dotenv** e toda a suíte é executada automaticamente através do **GitHub Actions**.