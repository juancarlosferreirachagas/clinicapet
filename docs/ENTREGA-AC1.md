# Clínica Pet — Board e Entregas

> **Link para o professor:** Este documento serve como board do projeto e registro de commits.  
> Acesse também: [Repositório](https://github.com/juancarlosferreirachagas/clinicapet) | [Board](https://github.com/users/juancarlosferreirachagas/projects/1) | [App](https://clinicapet.vercel.app) | [Vídeo](#)

---

## Board de Funcionalidades

### AC1 — Cadastro de Pets ✅ (Entregue)

| # | Tarefa | Camada | Status |
|---|--------|--------|--------|
| 1 | Setup do projeto (Next.js, TypeScript, Tailwind) | Geral | ✅ |
| 2 | Schema da tabela `pets` e migrações | Banco | ✅ |
| 3 | Cliente Supabase + tipos TypeScript | Lib | ✅ |
| 4 | API criar e listar pets | Backend | ✅ |
| 5 | Formulário de cadastro de pet | Frontend | ✅ |
| 6 | Listagem de pets com cards | Frontend | ✅ |
| 7 | Integração completa e layout | Frontend | ✅ |
| 8 | Documentação e diagramas | Docs | ✅ |

### AC2 — Cadastro de tutores ⏳ (Backlog)

### AC3 — Consultas e agenda ⏳ (Backlog)

### AC4 (Prova) — Pagamentos ⏳ (Backlog)

---

## Commits da AC1

| Hash | Mensagem |
|------|----------|
| `c3443d7` | feat: setup inicial do projeto Next.js com TypeScript e Tailwind |
| `81e71bc` | feat: schema do banco e migrações com Supabase |
| `9947cbb` | feat: cliente Supabase, tipos e utilitários |
| `4bdeb93` | feat: páginas e API routes principais |
| `77548d4` | feat: componentes React e layout |
| `d364314` | docs: documentação e diagramas AC1-AC4 |

---

## Links da Entrega AC1

| Item | Link |
|------|------|
| Repositório | https://github.com/juancarlosferreirachagas/clinicapet |
| Board (GitHub Projects) | https://github.com/users/juancarlosferreirachagas/projects/1 |
| App hospedado | https://clinicapet.vercel.app |
| Branch AC1 | `git checkout ac1` |
| Vídeo | *(adicionar link do YouTube após gravar)* |

### Como rodar a AC1 (apenas cadastro de pets)

```bash
git clone https://github.com/juancarlosferreirachagas/clinicapet.git
cd clinicapet
git checkout ac1
npm install
cp .env.example .env.local   # preencher SUPABASE_URL e SUPABASE_ANON_KEY
npm run dev
```
