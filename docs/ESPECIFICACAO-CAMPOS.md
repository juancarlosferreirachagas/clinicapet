# Especificação de Campos – Clínica Pet

## Visão geral
Definição profissional e inovadora dos campos para todas as abas do sistema, alinhada ao fluxo de uma clínica veterinária.

---

## 1. PET (Cadastro do animal)

### Campos atuais
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| nome | texto | sim | Nome do animal |
| especie | texto | sim | Cachorro, Gato, Ave, Coelho, etc. |
| raca | texto | não | Raça ou SRD |
| nome_tutor | texto | sim | Nome do responsável |
| telefone | texto | não | Contato principal (WhatsApp) |
| foto_url | url | não | Foto do animal |
| sexo | enum | não | Macho / Fêmea |
| data_nascimento | data | não | Para cálculo de idade |

### Campos recomendados (evolução futura)
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| peso_atual | decimal | não | Último peso (kg) – importante para medicação |
| pelagem | texto | não | Cor/tipo de pelagem |
| microchip | texto | não | Identificação única |
| castrado | boolean | não | Sim / Não |
| alergias | texto | não | Alergias conhecidas |
| medicamentos_continuos | texto | não | Medicação em uso |
| observacoes | texto | não | Notas gerais do prontuário |

---

## 2. TUTOR (Responsável)
*Atualmente embutido no pet. Para evolução: entidade separada.*

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| nome | texto | sim | Nome completo |
| telefone | texto | não | Principal (WhatsApp) |
| email | email | não | Contato |
| cpf | texto | não | Para faturamento |
| endereco | texto | não | Logradouro, número, bairro |
| cidade | texto | não | |
| cep | texto | não | |

---

## 3. VETERINÁRIO

### Campos atuais
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| nome | texto | sim | Nome completo |
| crmv | texto | sim | Registro profissional (UF + número) |
| especialidade | texto | não | Clínica geral, Cirurgia, etc. |
| email | email | não | Contato |

### Campos recomendados (evolução)
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| telefone | texto | não | Contato |
| celular | texto | não | WhatsApp |
| ativo | boolean | sim | Se está em atendimento |

---

## 4. CONSULTA

### Campos atuais
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| pet_id | fk | sim | Animal atendido |
| veterinario_id | fk | não | Profissional responsável |
| data_consulta | data | sim | Data da consulta |
| hora | texto | sim | Horário (HH:MM) |
| motivo | texto | não | Queixa principal |
| observacoes | texto | não | Observações do atendimento |
| status | enum | sim | agendada, realizada, cancelada |

### Campos recomendados (evolução)
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| peso_consulta | decimal | não | Peso no momento |
| temperatura | decimal | não | Temperatura corporal |
| anamnese | texto | não | Histórico relatado |
| exame_fisico | texto | não | Achados do exame |
| diagnostico | texto | não | Hipótese/diagnóstico |
| prescricao | texto | não | Medicação orientada |
| retorno_em | data | não | Data sugerida de retorno |

---

## 5. FICHA DO PET (Resumo na tela do animal)

### Informações relevantes (prioridade)
1. **Última consulta** – data e veterinário
2. **Total de consultas** – indicador de histórico
3. **Exames realizados** – quantidade (indicador de cuidado)
4. **Espécie/Raça** – identificação rápida
5. **Tutor + contato** – para emergências

### Remover
- Total pago (informação financeira; ver em Pagamentos)

---

## 6. FORMULÁRIOS – Boas práticas
- Agrupar campos por contexto (Dados do animal | Dados do tutor)
- Placeholders descritivos e exemplos
- Validação em tempo real
- Labels claros e curtos
- Campos opcionais bem identificados

---

## 7. PAGAMENTOS
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| consulta_id | fk | sim | Consulta relacionada |
| valor | decimal | sim | Valor pago |
| forma_pagamento | enum | sim | Dinheiro, Cartão, PIX |
| status | enum | sim | pendente, pago, estornado |
