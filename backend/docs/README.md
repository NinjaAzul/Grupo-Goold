# Documentação do Schema do Banco de Dados

Esta pasta contém a documentação do schema do banco de dados do projeto Grupo Goold.

## Arquivos

### `schema.dbml`
Arquivo DBML (Database Markup Language) que descreve a estrutura completa do banco de dados, incluindo:
- Tabelas e suas colunas
- Tipos de dados
- Chaves primárias e estrangeiras
- Índices
- Relacionamentos entre tabelas
- Enums e constraints

**Como visualizar:**
1. Acesse [dbdiagram.io](https://dbdiagram.io/)
2. Copie o conteúdo do arquivo `schema.dbml`
3. Cole no editor para visualizar o diagrama interativo

### `diagram.pdf`
Diagrama visual em PDF do schema do banco de dados, gerado a partir do arquivo DBML.

## Gerando a Documentação

Para gerar/atualizar o arquivo `schema.dbml`:

```bash
# Localmente
npm run dbml:generate

# Dentro do Docker
docker-compose exec backend npm run dbml:generate
```

O script conecta-se ao banco de dados MySQL e gera automaticamente o arquivo DBML com toda a estrutura atual.

## Estrutura do Banco de Dados

O banco de dados `grupo_goold` contém as seguintes tabelas principais:

- **users** - Usuários do sistema
- **roles** - Perfis de acesso
- **permissions** - Permissões do sistema
- **user_permissions** - Relação muitos-para-muitos entre usuários e permissões
- **appointments** - Agendamentos
- **rooms** - Salas de agendamento
- **logs** - Logs de atividades do sistema
- **states** - Estados brasileiros
- **cities** - Cidades brasileiras
- **SequelizeMeta** - Controle de migrações do Sequelize

## Relacionamentos Principais

- `appointments` → `users` (user_id)
- `appointments` → `rooms` (room_id)
- `users` → `roles` (role_id)
- `users` → `cities` (city_id)
- `cities` → `states` (state_id)
- `logs` → `users` (user_id)
- `user_permissions` → `users` (user_id)
- `user_permissions` → `permissions` (permission_id)

## Notas

- O arquivo `schema.dbml` é gerado automaticamente a partir do banco de dados real
- Sempre que houver mudanças no schema (migrações), execute `npm run dbml:generate` para atualizar a documentação
- O PDF pode ser gerado manualmente a partir do DBML usando ferramentas como dbdiagram.io

