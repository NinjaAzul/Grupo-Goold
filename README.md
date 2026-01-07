# Grupo Goold - Projeto Full-Stack

Projeto Goold Schedule com backend (Express + Sequelize + MySQL) e frontend (Next.js + Tailwind CSS).

## Estrutura do Projeto

```
Grupo-Goold/
├── backend/              # Backend Express + Sequelize
│   └── docker-compose.yml # Configuração Docker
└── frontend/             # Frontend Next.js + Tailwind CSS
```

## Tecnologias

### Backend
- Node.js
- Express
- Sequelize
- MySQL

### Frontend
- Next.js
- React
- Tailwind CSS

## Como Executar

### Backend e MySQL com Docker

1. Entre no diretório do backend:
```bash
cd backend
```

2. Suba os serviços com Docker Compose:
```bash
docker-compose up -d
```

3. O backend estará disponível em: `http://localhost:3001`
4. O MySQL estará disponível na porta: `3306`
5. A documentação Swagger estará disponível em: `http://localhost:3001/api-docs`

### Frontend

1. Entre no diretório do frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

4. Acesse: `http://localhost:3000`

## Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` no diretório backend e ajuste as variáveis conforme necessário:

```bash
cp backend/.env.example backend/.env
```

## Comandos Úteis

### Docker
- Subir serviços: `cd backend && docker-compose up -d`
- Parar serviços: `cd backend && docker-compose down`
- Ver logs: `cd backend && docker-compose logs -f backend`
- Rebuild: `cd backend && docker-compose up -d --build`
- **Nota**: O backend está configurado com hot-reload. Mudanças no código são detectadas automaticamente.

### Backend
- Desenvolvimento: `npm run dev` (requer nodemon)
- Produção: `npm start`
- Documentação API: Acesse `http://localhost:3001/api-docs` para ver a documentação Swagger
- Gerar ERD: `npm run erd:generate` - Gera diagrama ERD do banco de dados
- Visualizar ERD: Acesse `http://localhost:3001/api/erd` para ver o diagrama ERD

### Banco de Dados

#### Migrations
- Criar migration: `npm run migration:generate -- nome-da-migration`
- Executar migrations: `npm run db:migrate`
- Reverter última migration: `npm run db:migrate:undo`
- Reverter todas migrations: `npm run db:migrate:undo:all`
- Status das migrations: `npm run db:migrate:status`

#### Seeders
- Criar seeder: `npm run seed:generate -- nome-do-seeder`
- Executar seeders: `npm run db:seed`
- Reverter último seeder: `npm run db:seed:undo`
- Reverter todos seeders: `npm run db:seed:undo:all`

#### Banco de Dados
- Criar banco: `npm run db:create`
- Deletar banco: `npm run db:drop`

### Frontend
- Desenvolvimento: `npm run dev`
- Build: `npm run build`
- Produção: `npm start`

