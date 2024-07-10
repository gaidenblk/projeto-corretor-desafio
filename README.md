# projeto-corretor-desafio

Projeto feito com React + backend typescript/postgresql

![CorreThor](image.png)

# Projeto CorreThor

Este repositório contém o frontend e o backend do projeto CorreThor.

## Estrutura do Projeto

- `/api/` - Pasta contendo o backend do projeto.
- `/client/` - Pasta contendo o frontend do projeto.

## Configuração do Backend

Dentro da pasta `api`, você encontrará dois arquivos `.sql`:

1. `create_tables.sql` - Contém as queries necessárias para criar as tabelas da aplicação.
2. `populate_tables.sql` - Contém as queries para popular as tabelas com dados iniciais.

### Criação das Tabelas

O conteúdo do arquivo `create_tables.sql` é o seguinte:

```sql
CREATE TABLE admins (
  id SERIAL PRIMARY KEY,
  token VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE correctors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE corrections (
  id SERIAL PRIMARY KEY,
  "correctorId" INT NOT NULL,
  class VARCHAR(255) NOT NULL,
  module VARCHAR(255) NOT NULL,
  meeting VARCHAR(255) NOT NULL,
  student VARCHAR(255) NOT NULL,
  FOREIGN KEY ("correctorId") REFERENCES correctors(id) ON DELETE CASCADE
);
```

### Populando as Tabelas

O conteúdo do arquivo `populate_tables.sql` é o seguinte:

```sql
INSERT INTO admins (id, token, name) VALUES
(1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVml0b3IgQXJydWRhIn0.nS8hPbA12kO7D_fnifaPsrr0zR95mWWMjjsiAKoDlX4', 'Victor Arruda');

INSERT INTO correctors (name) VALUES
('Adrian Roger'),
('Raissa Lopes');

INSERT INTO corrections ("correctorId", class, module, meeting, student) VALUES
(1,'Turma 6','Typescript','Aula 2 - Tuplas', 'Victor Júnior'),
(2,'Turma 6','Typescript','Aula 2 - Tuplas', 'Victor Júnior');
```

### Configuração do Ambiente

Na pasta `api`, você encontrará um arquivo de exemplo chamado `.env.example` que contém os parâmetros necessários para a conexão com o banco de dados. Renomeie este arquivo para `.env` e configure-o corretamente com as informações do seu banco de dados.

### Exemplo de `.env`

```env
DATABASE_URL=postgresql://username:password@localhost:5432/mydatabase
```

## Estrutura dos Endpoints

### A seguir estão as rotas disponíveis na API:

### Rotas Públicas

> GET /

- Rota para obter status da API

### Rotas Protegidas

> GET /admin

- Rota para obter informações dos administradores

> GET /correctors

- Rota para obter a lista de corretores

> GET /corrections/:correctorId

- Rota para obter as correções de um corretor específico

> POST /correctors

- Rota para adicionar um novo corretor

> PUT /correctors/:correctorId

- Rota para atualizar informações de um corretor

> DELETE /correctors/:correctorId

- Rota para deletar um corretor

> POST /corrections

- Rota para adicionar uma nova correção

> DELETE /corrections/:correctionId

- Rota para deletar uma correção

> PUT /corrections/:correctionId

- Rota para atualizar uma correção

## Instruções para Executar o Projeto

### Backend

1. Navegue até a pasta api:

```bash
cd projeto/api
```

2. Instale as dependências:

```bash
npm install
```

3. Configure o arquivo `.env` com as informações do seu banco de dados.
4. Crie as tabelas no banco de dados utilizando o arquivo `create_tables.sql`:

```bash
psql -U <seu-usuario> -d <seu-banco> -f create_tables.sql
```

5. Popule as tabelas com dados iniciais utilizando o arquivo `populate_tables.sql`:

```bash
psql -U <seu-usuario> -d <seu-banco> -f populate_tables.sql
```

6. Inicie o servidor:

```bash
npm run start
```

### Frontend

1. Navegue até a pasta `client`:

```bash
cd projeto/client
```

2. Instale as dependências:

```bash
npm install
```

3. Inicie o servidor de desenvolvimento:

```bash
npm start
```

> 🚧 Projeto em construção 🚧
