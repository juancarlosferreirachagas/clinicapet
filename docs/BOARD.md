# Board Ágil -- Clínica Pet

Roadmap organizado em 4 sprints (AC1 a AC4), seguindo metodologia Scrum com user stories, critérios de aceitação e entregáveis.

---

## AC1 -- Cadastro de Pets (Fundação)

**Objetivo:** CRUD completo de pets com arquitetura em 3 camadas.

### User Stories

| ID | User Story | Prioridade |
|----|-----------|------------|
| US01 | Como recepcionista, quero cadastrar um pet com dados do animal e tutor, para manter o registro atualizado | Alta |
| US02 | Como recepcionista, quero editar os dados de um pet, para corrigir informações | Alta |
| US03 | Como recepcionista, quero excluir um pet sem consultas, para limpar registros inativos | Alta |
| US04 | Como recepcionista, quero ver a lista de todos os pets, para localizar rapidamente um animal | Alta |
| US05 | Como recepcionista, quero ver a ficha completa de um pet, com histórico e dados do tutor | Média |
| US06 | Como recepcionista, quero anexar foto do pet, para identificação visual | Média |

### Critérios de Aceitação

- [ ] CRUD funcional (Create, Read, Update, Delete)
- [ ] Validação de campos obrigatórios (nome, espécie, nome do tutor)
- [ ] Regra RESTRICT: não excluir pet com consultas vinculadas
- [ ] Upload de foto limitado a 5 MB
- [ ] Ficha do pet com histórico de consultas
- [ ] Interface responsiva (mobile e desktop)

### Entregáveis

- Schema SQL (`database/schema.sql`)
- API REST (`app/api/pets/`)
- Interface (`components/PetsSection.tsx`, `components/PetFicha.tsx`)
- Documentação (`docs/AC1-PETS.md`)
- Diagramas de classes e casos de uso

### Status: CONCLUÍDO

---

## AC2 -- Veterinários e Consultas

**Objetivo:** CRUD de veterinários, agendamento de consultas, ficha do veterinário.

### User Stories

| ID | User Story | Prioridade |
|----|-----------|------------|
| US07 | Como recepcionista, quero cadastrar veterinários com CRMV e especialidade | Alta |
| US08 | Como recepcionista, quero agendar consultas vinculando pet e veterinário | Alta |
| US09 | Como recepcionista, quero editar e cancelar consultas | Alta |
| US10 | Como recepcionista, quero ver a agenda de consultas organizada por data | Alta |
| US11 | Como recepcionista, quero ver a ficha do veterinário com histórico de atendimentos | Média |
| US12 | Como recepcionista, quero adicionar itens (exames, procedimentos, vacinas) a uma consulta | Média |

### Critérios de Aceitação

- [ ] CRUD de veterinários (nome, CRMV, especialidade, email)
- [ ] CRUD de consultas (pet, vet, data, hora, motivo)
- [ ] Agenda visual organizada por data
- [ ] Cancelamento de consulta (soft delete via status)
- [ ] Tipos de serviço (exame, procedimento, vacina) com lançamento na consulta
- [ ] Ficha do veterinário com pets atendidos

### Entregáveis

- Schema (`veterinarios`, `consultas`, `tipos_servico`, `consulta_itens`)
- APIs (`/api/veterinarios/`, `/api/consultas/`, `/api/tipos-servico`)
- Interface (VetsSection, ConsultasSection, VetFicha, ConsultaDetalhe)
- Documentação atualizada

### Status: CONCLUÍDO

---

## AC3 -- Tutores e Pagamentos

**Objetivo:** Módulo de tutores, pagamentos e visão financeira.

### User Stories

| ID | User Story | Prioridade |
|----|-----------|------------|
| US13 | Como recepcionista, quero buscar tutores por nome ou telefone | Alta |
| US14 | Como recepcionista, quero ver a ficha do tutor com todos os seus pets e consultas | Alta |
| US15 | Como recepcionista, quero registrar pagamentos vinculados a consultas | Alta |
| US16 | Como recepcionista, quero editar e estornar pagamentos | Alta |
| US17 | Como recepcionista, quero ver o total pago por consulta | Média |

### Critérios de Aceitação

- [ ] Listagem e busca de tutores (derivados dos pets)
- [ ] Ficha do tutor com pets, consultas, exames, pagamentos
- [ ] CRUD de pagamentos (dinheiro, cartão, PIX)
- [ ] Estorno de pagamento
- [ ] Total por consulta no detalhe da consulta

### Entregáveis

- Schema (`pagamentos`)
- APIs (`/api/tutores`, `/api/tutores/ficha`, `/api/pagamentos/`)
- Interface (TutorsSection, PagamentosSection, TutorPage)
- Documentação atualizada

### Status: CONCLUÍDO

---

## AC4 -- Qualidade, Testes e Entrega Final

**Objetivo:** Polimento, testes, segurança e documentação final.

### User Stories

| ID | User Story | Prioridade |
|----|-----------|------------|
| US18 | Como desenvolvedor, quero código limpo e sem duplicações | Alta |
| US19 | Como desenvolvedor, quero testes automatizados nas rotas da API | Alta |
| US20 | Como usuário, quero que o sistema seja seguro (autenticação, RLS) | Média |
| US21 | Como professor, quero documentação completa (diagramas, manual) | Alta |
| US22 | Como usuário, quero acessar o sistema em produção (deploy) | Baixa |

### Critérios de Aceitação

- [ ] Code review e clean code (concluído)
- [ ] Testes unitários/integração nas API routes
- [ ] Autenticação de usuário (login/logout)
- [ ] RLS (Row Level Security) no Supabase
- [ ] Deploy em produção (Vercel)
- [ ] Documentação final: diagramas atualizados, manual de uso, README completo

### Entregáveis

- Testes automatizados
- Configuração de auth
- Deploy em produção
- Documentação final completa

### Status: EM ANDAMENTO

---

## Metodologia

- **Framework:** Scrum adaptado (sprints = ACs)
- **Board:** Kanban (Backlog > Em Progresso > Concluído)
- **Commits:** Conventional Commits (`feat`, `fix`, `docs`, `refactor`)
- **Manifesto Ágil:** Priorizar software funcionando, responder a mudanças, colaboração contínua
- **Princípios aplicados:**
  - Entrega incremental (cada AC entrega valor)
  - Simplicidade (manter apenas o essencial)
  - Excelência técnica (clean code, refatoração contínua)
  - Reflexão e adaptação (retrospectiva ao final de cada AC)
