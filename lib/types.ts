export type Section = "pets" | "vets" | "tutores" | "consultas" | "pagamentos";

export interface Pet {
  id: number;
  nome: string;
  especie: string;
  raca?: string | null;
  nome_tutor: string;
  telefone?: string | null;
  foto_url?: string | null;
  data_nascimento?: string | null;
  sexo?: "macho" | "femea" | null;
}

export interface Veterinario {
  id: number;
  nome: string;
  crmv: string;
  especialidade?: string | null;
  email?: string | null;
  foto_url?: string | null;
}

export interface Consulta {
  id: number;
  pet_id: number;
  veterinario_id?: number | null;
  data_consulta: string;
  hora: string;
  motivo?: string | null;
  observacoes?: string | null;
  status?: string;
  pet_nome?: string | null;
  pet_foto_url?: string | null;
  pet_especie?: string | null;
  pet_nome_tutor?: string | null;
  veterinario_nome?: string | null;
}

export interface TipoServico {
  id: number;
  nome: string;
  categoria: "exame" | "procedimento" | "vacina";
  descricao?: string | null;
}

export interface Pagamento {
  id: number;
  consulta_id: number;
  valor: number;
  forma_pagamento?: string | null;
  status?: string;
  data_consulta?: string | null;
  pet_id?: number | null;
  pet_nome?: string | null;
  pet_foto_url?: string | null;
  pet_especie?: string | null;
  pet_nome_tutor?: string | null;
}

export interface ExameItem {
  id: number;
  tipo_servico_nome?: string | null;
  resultado?: string | null;
  observacoes?: string | null;
  valor?: number | null;
}

export interface ProcedimentoItem {
  id: number;
  tipo_servico_nome?: string | null;
  observacoes?: string | null;
  valor?: number | null;
}

export interface PagamentoResumo {
  id: number;
  valor: number;
  forma_pagamento: string;
}

export interface ConsultaFicha {
  id: number;
  pet_id?: number;
  veterinario_id?: number | null;
  data_consulta: string;
  hora: string;
  motivo?: string | null;
  status?: string;
  veterinario_nome?: string | null;
  pet_nome?: string | null;
  pet_foto_url?: string | null;
  pet_especie?: string | null;
  pet_nome_tutor?: string | null;
  pet_data_nascimento?: string | null;
  pet_sexo?: string | null;
  pagamentos: PagamentoResumo[];
  exames?: ExameItem[];
  procedimentos?: ProcedimentoItem[];
  vacinas?: ExameItem[];
}

export interface ItemComConsulta {
  id: number;
  tipo_servico_nome?: string | null;
  resultado?: string | null;
  observacoes?: string | null;
  valor?: number | null;
  consulta_id: number;
  pet_id?: number;
  pet_foto_url?: string | null;
  pet_especie?: string | null;
  pet_nome?: string | null;
  data_consulta: string;
  hora: string;
  veterinario_nome?: string | null;
}

export interface SupabaseConsultaRow {
  id: number;
  pet_id: number;
  veterinario_id?: number | null;
  data_consulta: string;
  hora: string;
  motivo?: string | null;
  observacoes?: string | null;
  status?: string;
  pets?: { nome?: string; foto_url?: string; especie?: string; nome_tutor?: string; data_nascimento?: string; sexo?: string } | null;
  veterinarios?: { nome?: string } | null;
}

export interface SupabaseItemRow {
  id: number;
  consulta_id: number;
  tipo_servico_id: number;
  observacoes?: string | null;
  resultado?: string | null;
  valor?: number | null;
  tipos_servico?: { nome?: string; categoria?: string } | null;
}
