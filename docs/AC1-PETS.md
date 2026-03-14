# AC1 -- Cadastro de Pets

## Objetivo

Módulo de cadastro de pets com CRUD completo, respeitando a arquitetura de 3 camadas.

## Arquitetura (3 camadas)

| Camada | Tecnologia | Responsabilidade |
|--------|------------|------------------|
| **Apresentação** | React 19, Next.js App Router, Tailwind CSS | Interface, formulários, listagem |
| **Aplicação** | Next.js API Routes (`app/api/pets/`) | Regras de negócio, validação, orquestração |
| **Persistência** | Supabase/PostgreSQL (`database/schema.sql`) | Armazenamento dos dados |

## Funcionalidades

- **Create:** Cadastrar novo pet (nome, espécie, raça, tutor, telefone, foto, data de nascimento, sexo)
- **Read:** Listar pets e buscar por ID, ficha completa do pet
- **Update:** Editar pet existente
- **Delete:** Excluir pet (somente se não tiver consultas vinculadas)

## Regras de negócio

1. Campos obrigatórios: nome do pet, espécie, nome do tutor
2. Raça, telefone, foto, data de nascimento e sexo são opcionais
3. Não é possível excluir pet que possui consultas (RESTRICT)
4. Upload de foto limitado a 5 MB (JPEG, PNG, WebP, GIF)

## Arquivos envolvidos

```
app/api/pets/route.ts              # GET (listar), POST (criar)
app/api/pets/[id]/route.ts         # GET (por ID), PUT (editar), DELETE (excluir)
app/api/pets/[id]/ficha/route.ts   # GET (ficha completa com consultas)
app/api/upload/route.ts            # POST (upload de foto)
app/(main)/page.tsx                # Página home com seção Pets
app/(main)/pet/[id]/page.tsx       # Página da ficha do pet
components/PetsSection.tsx         # Listagem, formulário CRUD
components/PetFicha.tsx            # Ficha completa do pet
components/PetAvatar.tsx           # Avatar com foto ou ícone
components/PetInfoBadges.tsx       # Badges de idade, sexo, espécie
database/schema.sql                # Tabela pets
lib/types.ts                       # Interface Pet
```

## API REST

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/pets | Lista todos os pets |
| GET | /api/pets/:id | Busca pet por ID |
| POST | /api/pets | Cadastra novo pet |
| PUT | /api/pets/:id | Atualiza pet |
| DELETE | /api/pets/:id | Exclui pet (retorna 400 se tiver consultas) |
| GET | /api/pets/:id/ficha | Ficha completa (pet + consultas + outros pets do tutor) |
| POST | /api/upload | Upload de foto do pet |

## Como testar

1. `npm run dev` (localhost:3000)
2. Acesse a seção Pets no menu lateral
3. Cadastre um pet e teste Editar e Excluir
4. Crie uma consulta para um pet e tente excluí-lo -- deve exibir mensagem de erro
5. Teste upload de foto no formulário de cadastro
