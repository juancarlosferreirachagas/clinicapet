# Clínica Pet

Sistema de gestão veterinária com Next.js 16, React 19, TypeScript e Tailwind CSS.

## Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Banco:** Supabase (PostgreSQL)

## Setup

1. Copie `.env.example` para `.env.local`
2. Preencha `SUPABASE_URL` e `SUPABASE_ANON_KEY`
3. `npm install`
4. `npm run migrate` (cria colunas extras no banco)
5. `npm run dev`

## Scripts

- `npm run dev` - Desenvolvimento (localhost:3000)
- `npm run build` - Build de produção
- `npm start` - Produção
- `npm run lint` - ESLint
- `npm run seed` - Popular banco com dados de exemplo
- `npm run migrate` - Executar migrações SQL

## Migrações

Para rodar as migrações, adicione `DATABASE_URL` no `.env.local`:

1. Supabase > Project Settings > Database > Connection string (URI)
2. Copie a string e adicione: `DATABASE_URL=postgresql://...`
3. Execute: `npm run migrate`

## Configuração de Storage (foto do pet)

No Supabase: Storage > New bucket > nome `pet-photos`, marque **Public**. Em Policies, adicione:
- INSERT: `true` (permitir insert)
- SELECT: `true` (permitir leitura pública)

## Estrutura

```
app/          - Páginas e API routes (App Router)
components/   - Componentes React
lib/          - Supabase client, tipos, API client, utilitários
docs/         - Documentação (AC1-AC4, diagramas)
database/     - Schema SQL e migrações
scripts/      - Seeds e migrações CLI
```

## Arquitetura (3 camadas)

| Camada | Tecnologia | Pasta |
|--------|------------|-------|
| Apresentação | React, Tailwind CSS | `app/`, `components/` |
| Aplicação | Next.js API Routes | `app/api/` |
| Persistência | Supabase (PostgreSQL) | `database/`, `lib/supabase.ts` |
