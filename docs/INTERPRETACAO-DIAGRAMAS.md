# Como interpretar os diagramas

## Diagrama de Classes

**O que mostra:** Estrutura das entidades do sistema e como se relacionam.

| Símbolo | Significado | No seu projeto |
|---------|-------------|----------------|
| **Classe (retângulo)** | Uma entidade/tabela | Pet, Veterinário, Consulta, Pagamento |
| **Atributo (+nome: tipo)** | Campo da entidade | +nome: String = nome do pet |
| **Seta "1" → "*"** | Um para muitos | Um Pet tem várias Consultas |
| **Seta "1" → "*"** | Um para muitos | Uma Consulta pode ter vários Pagamentos |

**Relacionamentos:**
- `Pet possui Consulta` — um pet pode ter várias consultas
- `Veterinario atende Consulta` — um veterinário atende várias consultas
- `Consulta gera Pagamento` — uma consulta pode gerar vários pagamentos
- `Consulta contém ConsultaItem` — uma consulta pode ter vários itens (exames, procedimentos, vacinas)
- `TipoServico classifica ConsultaItem` — cada item pertence a um tipo de serviço

---

## Diagrama de Casos de Uso

**O que mostra:** O que o usuário faz no sistema.

| Símbolo | Significado | No seu projeto |
|---------|-------------|----------------|
| **((Ator))** | Quem usa o sistema | Recepcionista ou Usuário |
| **Retângulo** | Caso de uso (ação) | Cadastrar Pet, Agendar Consulta |
| **Seta sólida** | Ator realiza o caso de uso | Recepcionista → Agendar Consulta |
| **Seta tracejada** | Dependência entre casos | Agendar Consulta *requer* Pet cadastrado |

**Fluxo lógico:**
1. Primeiro cadastra Pets e Veterinários
2. Depois agenda Consultas (precisa de pet + vet)
3. Por fim registra Pagamentos (precisa de consulta)

---

## Resumo

- **Classes** = modelo dos dados (como está no banco)
- **Casos de uso** = fluxo de trabalho (o que o usuário faz)
- O professor quer ver que você entende a estrutura e o funcionamento do sistema
