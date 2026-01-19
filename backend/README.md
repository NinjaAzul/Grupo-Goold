# Grupo Goold - Backend

Backend do projeto Grupo Goold desenvolvido com Node.js, TypeScript, Express e Sequelize.

## 📚 Documentação

### Schema do Banco de Dados

A documentação completa do schema do banco de dados está disponível na pasta [`docs/`](./docs/):

- **[schema.dbml](./docs/schema.dbml)** - Arquivo DBML com a estrutura completa do banco
- **[diagram.pdf](./docs/diagram.pdf)** - Diagrama visual em PDF do schema
- **[README.md](./docs/README.md)** - Documentação detalhada sobre o schema

Para visualizar o diagrama interativo:
1. Acesse [dbdiagram.io](https://dbdiagram.io/)
2. Copie o conteúdo do arquivo `docs/schema.dbml`
3. Cole no editor

## 🚀 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia o servidor em modo desenvolvimento

# Build
npm run build            # Compila TypeScript para JavaScript

# Banco de Dados
npm run db:migrate       # Executa migrações
npm run db:seed          # Executa seeds
npm run dbml:generate    # Gera documentação DBML do schema

# Testes
npm run test             # Executa testes
npm run test:watch       # Executa testes em modo watch
npm run test:coverage    # Gera relatório de cobertura

# Qualidade de Código
npm run lint             # Verifica problemas de lint
npm run lint:fix          # Corrige problemas de lint
npm run format            # Formata código com Prettier
```

## 🔧 Configuração

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente no arquivo `.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=grupo_goold
DB_USER=root
DB_PASSWORD=password
# ... outras variáveis
```

3. Execute as migrações:
```bash
npm run db:migrate
```

## 📖 Gerando Documentação do Schema

Para gerar/atualizar a documentação do schema do banco de dados:

```bash
# Localmente
npm run dbml:generate

# Dentro do Docker
docker-compose exec backend npm run dbml:generate
```

O arquivo será gerado em `docs/schema.dbml` e pode ser visualizado em [dbdiagram.io](https://dbdiagram.io/).

## 🏗️ Estrutura do Projeto

```
backend/
├── docs/              # Documentação (schema DBML, diagramas)
├── src/
│   ├── modules/       # Módulos da aplicação
│   ├── shared/        # Código compartilhado
│   └── infra/         # Infraestrutura (server, database, etc.)
├── scripts/           # Scripts utilitários
└── dist/              # Código compilado (gerado)
```

## 📝 Tecnologias

- **Node.js** - Runtime JavaScript
- **TypeScript** - Linguagem de programação
- **Express** - Framework web
- **Sequelize** - ORM para banco de dados
- **MySQL** - Banco de dados relacional
- **Jest** - Framework de testes
- **Swagger** - Documentação da API

## 🔗 Links Úteis

- [Documentação do Schema](./docs/README.md)
- [dbdiagram.io](https://dbdiagram.io/) - Visualizar diagrama do banco

