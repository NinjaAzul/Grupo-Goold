```mermaid
erDiagram
    SequelizeMeta {
        VARCHAR name PK
    }
    roles {
        INT id PK
        VARCHAR name UK
        DATETIME created_at
        DATETIME updated_at
    }
    users {
        INT id PK
        VARCHAR nome
        VARCHAR sobrenome
        VARCHAR password
        VARCHAR cep nullable
        VARCHAR logradouro nullable
        VARCHAR numero nullable
        VARCHAR complemento nullable
        VARCHAR bairro nullable
        VARCHAR cidade nullable
        VARCHAR estado nullable
        DATETIME created_at
        DATETIME updated_at
    }
```