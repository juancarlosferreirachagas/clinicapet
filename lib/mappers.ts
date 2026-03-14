import type { SupabaseConsultaRow, SupabaseItemRow } from "./types";

interface MappedItem {
  id: number;
  consulta_id: number;
  tipo_servico_nome?: string;
  tipo_servico_categoria?: string;
  observacoes?: string | null;
  resultado?: string | null;
  valor?: number | null;
}

export function mapSupabaseItem(i: SupabaseItemRow): MappedItem {
  return {
    consulta_id: i.consulta_id,
    id: i.id,
    tipo_servico_nome: i.tipos_servico?.nome ?? undefined,
    tipo_servico_categoria: i.tipos_servico?.categoria ?? undefined,
    observacoes: i.observacoes,
    resultado: i.resultado,
    valor: i.valor,
  };
}

export function mapConsultaListItem(c: SupabaseConsultaRow) {
  return {
    id: c.id,
    pet_id: c.pet_id,
    veterinario_id: c.veterinario_id,
    data_consulta: c.data_consulta,
    hora: c.hora,
    motivo: c.motivo,
    status: c.status,
    pet_nome: c.pets?.nome ?? null,
    pet_foto_url: c.pets?.foto_url ?? null,
    pet_especie: c.pets?.especie ?? null,
    pet_nome_tutor: c.pets?.nome_tutor ?? null,
    veterinario_nome: c.veterinarios?.nome ?? null,
  };
}

export function safeParseFloat(val: unknown): number | null {
  if (val == null || val === "") return null;
  const n = parseFloat(String(val));
  return Number.isNaN(n) ? null : n;
}
