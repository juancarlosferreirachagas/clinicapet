import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { SupabaseItemRow } from "@/lib/types";
import { mapSupabaseItem } from "@/lib/mappers";

interface ConsultaComVeterinario {
  id: number;
  pet_id: number;
  veterinario_id?: number | null;
  data_consulta: string;
  hora: string;
  motivo?: string | null;
  status?: string;
  veterinarios?: { nome?: string } | null;
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { data: pet, error: ePet } = await supabase.from("pets").select("*").eq("id", id).single();
    if (ePet || !pet) {
      if (ePet?.code === "PGRST116") return NextResponse.json({ erro: "Pet não encontrado" }, { status: 404 });
      throw ePet || new Error("Pet não encontrado");
    }
    const { data: consultas } = await supabase
      .from("consultas")
      .select("*, veterinarios(nome)")
      .eq("pet_id", id)
      .order("data_consulta", { ascending: false })
      .order("hora", { ascending: false });
    const consIds = (consultas || []).map((c: { id: number }) => c.id);
    let pagamentos: { consulta_id?: number; id: number; valor: number; forma_pagamento: string }[] = [];
    let itens: ReturnType<typeof mapSupabaseItem>[] = [];
    if (consIds.length) {
      const [pagsRes, itensRes] = await Promise.all([
        supabase.from("pagamentos").select("id, consulta_id, valor, forma_pagamento").in("consulta_id", consIds).order("id", { ascending: false }),
        supabase.from("consulta_itens").select("*, tipos_servico(nome, categoria)").in("consulta_id", consIds).order("id", { ascending: true }),
      ]);
      pagamentos = (pagsRes.data || []) as { consulta_id?: number; id: number; valor: number; forma_pagamento: string }[];
      const rawItens = (itensRes.data || []) as SupabaseItemRow[];
      itens = rawItens.map(mapSupabaseItem);
    }
    const mapConsulta = (c: ConsultaComVeterinario) => {
      const v = c.veterinarios;
      const pagsCons = pagamentos.filter((p) => p.consulta_id === c.id);
      const itensCons = itens.filter((i) => i.consulta_id === c.id);
      const exames = itensCons.filter((i) => i.tipo_servico_categoria === "exame");
      const procedimentos = itensCons.filter((i) => i.tipo_servico_categoria === "procedimento");
      const vacinas = itensCons.filter((i) => i.tipo_servico_categoria === "vacina");
      return {
        id: c.id,
        veterinario_id: c.veterinario_id,
        data_consulta: c.data_consulta,
        hora: c.hora,
        motivo: c.motivo,
        status: c.status,
        veterinario_nome: v?.nome ?? null,
        pagamentos: pagsCons.map((p) => ({ id: p.id, valor: p.valor, forma_pagamento: p.forma_pagamento })),
        exames: exames.map((e) => ({ id: e.id, tipo_servico_nome: e.tipo_servico_nome, resultado: e.resultado, observacoes: e.observacoes, valor: e.valor })),
        procedimentos: procedimentos.map((p) => ({ id: p.id, tipo_servico_nome: p.tipo_servico_nome, observacoes: p.observacoes, valor: p.valor })),
        vacinas: vacinas.map((v) => ({ id: v.id, tipo_servico_nome: v.tipo_servico_nome, resultado: v.resultado, observacoes: v.observacoes, valor: v.valor })),
      };
    };
    let q = supabase.from("pets").select("id, nome, especie, raca, foto_url, data_nascimento, sexo").eq("nome_tutor", pet.nome_tutor).neq("id", id);
    if (pet.telefone) q = q.eq("telefone", pet.telefone);
    const { data: outrosPets } = await q;

    return NextResponse.json({
      pet,
      consultas: ((consultas || []) as ConsultaComVeterinario[]).map(mapConsulta),
      outros_pets: outrosPets || [],
    });
  } catch (e) {
    return NextResponse.json({ erro: (e as Error).message }, { status: 500 });
  }
}
