# Organização de commits -- AC1

## Padrão de commits

Usar [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(ac1): estrutura inicial do projeto (Next.js + Supabase)
feat(ac1): schema da tabela pets
feat(ac1): API REST CRUD de pets
feat(ac1): componente PetsSection (listagem + formulário)
feat(ac1): componente PetFicha (ficha completa)
feat(ac1): upload de foto do pet (Supabase Storage)
feat(ac1): validação de campos obrigatórios na API
feat(ac1): regra RESTRICT - não excluir pet com consultas
feat(ac1): badges de idade, sexo e espécie
docs(ac1): documentação e diagramas
```

## Comandos Git (se começar do zero)

```bash
git init
git add .
git commit -m "feat(ac1): CRUD completo de pets - 3 camadas"
```

## Commits incrementais (já com código)

```bash
git add database/schema.sql
git commit -m "feat(ac1): schema pets"

git add app/api/pets/
git commit -m "feat(ac1): API REST pets"

git add components/PetsSection.tsx components/PetFicha.tsx components/PetAvatar.tsx components/PetInfoBadges.tsx
git commit -m "feat(ac1): interface cadastro e ficha de pets"

git add app/api/upload/
git commit -m "feat(ac1): upload de foto do pet"

git add docs/
git commit -m "docs(ac1): documentação e diagramas atualizados"
```
