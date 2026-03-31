# CRUD NestJS

Sistema de gerenciamento de tarefas desenvolvido para praticar conceitos de Fullstack, focado em organização profissional e escalabilidade.

---

## Como rodar o projeto

Siga o passo a passo para configurar o ambiente localmente:

### 1. Pré-requisitos
* **Node.js** instalado (v16 ou superior)
* **PostgreSQL** rodando localmente ou via Docker
* Gerenciador de banco de dados (Ex: **DBeaver**)

### 2. Instalação
No terminal do VS Code, dentro da pasta raiz do projeto, execute:

npm install

### 3. Configuração do Banco de Dados
Crie um arquivo chamado .env na raiz do projeto e configure suas credenciais:

.env
DB_HOST=localhost  
DB_PORT=5432  
DB_USERNAME=seu_usuario  
DB_PASSWORD=sua_senha  
DB_DATABASE=nome_do_banco  

### 4. Executando a aplicação

### Modo de desenvolvimento
npm run start:dev

A API estará disponível em: \http://localhost:3000\

---

## Tecnologias Utilizadas

Este projeto foi construído com as seguintes ferramentas:

* **Backend:** Node.js, NestJS, TypeScript
* **Banco de Dados:** PostgreSQL (TypeORM)
* **Ferramentas:** DBeaver, VS Code, Git

---

## Exemplos de Requisições

Endpoints principais para teste (via Postman ou Insomnia):

### Criar uma Tarefa
* **Método:** \POST\
* **URL:** \http://localhost:3000/tasks\
* **Corpo (JSON):**
json  
{  
  "title": "Estudar NestJS",  
  "description": "Praticar a criação de módulos e serviços",  
  "status": "OPEN"  
}

### Listar Todas as Tarefas
* **Método:** \GET\
* **URL:** \http://localhost:3000/tasks\

---

## Estrutura do Projeto

A organização segue o padrão recomendado pelo NestJS:

* \src/\: Contém os módulos, controllers, services e entidades da aplicação.
* \test/\: Testes automatizados.
* \.gitignore\: Configurado para ignorar \`node_modules\` e arquivos de ambiente (\`.env\`).
* \README.md\: Documentação técnica do projeto.

---

## Observações e Dificuldades

Durante o desenvolvimento, os principais pontos de atenção foram:

* **Injeção de Dependência:** Compreender como o NestJS gerencia a comunicação entre Controllers e Services através dos Módulos.
* **Sincronização com o Banco:** Configurar o TypeORM para que as entidades criadas no código refletissem corretamente nas tabelas do PostgreSQL.
* **Padronização:** Adaptar-se à estrutura de pastas do framework, garantindo que cada arquivo estivesse em seu devido lugar seguindo as boas práticas de mercado.

---

## Aprendizados e Objetivos

* **Versionamento Profissional:** Gerenciamento de repositórios com Git.
* **Arquitetura NestJS:** Separação de responsabilidades e organização de arquivos.
* **Boas Práticas:** Uso estratégico do \`.gitignore\` e variáveis de ambiente.
* **Documentação:** Criação de um histórico de evolução claro para o portfólio.

Feito com dedicação por **Maria Laura Bastos**
