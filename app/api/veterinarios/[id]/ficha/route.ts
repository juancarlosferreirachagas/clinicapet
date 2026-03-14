import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { SupabaseItemRow } from "@/lib/types";
import { mapSupabaseItem } from "@/lib/mappers";

interface ConsultaComPet {
  id: number;
  pet_id: number;
  veterinario_id?: number | null;
  data_consulta: string;
  hora: string;
  motivo?: string | null;
  status?: string;
  pets?: { nome?: string; foto_url?: string; especie?: string; nome_tutor?: string; data_nascimento?: string; sexo?: string } | null;
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { data: vet, error: eVet } = await supabase.from("veterinarios").select("*").eq("id", id).single();
    if (eVet || !vet) {
      if (eVet?.code === "PGRST116") return NextResponse.json({ erro: "Veterinário não encontrado" }, { status: 404 });
      throw eVet || new Error("Veterinário não encontrado");
    }
    const { data: consultas } = await supabase
      .from("consultas")
      .select("*, pets(nome, foto_url, especie, nome_tutor, data_nascimento, sexo)")
      .eq("veterinario_id", id)
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
    const mapConsulta = (c: ConsultaComPet) => {
      const p = c.pets;
      const pagsCons = pagamentos.filter((p) => p.consulta_id === c.id);
      const itensCons = itens.filter((i) => i.consulta_id === c.id);
      const exames = itensCons.filter((i) => i.tipo_servico_categoria === "exame");
      const procedimentos = itensCons.filter((i) => i.tipo_servico_categoria === "procedimento");
      const vacinas = itensCons.filter((i) => i.tipo_servico_categoria === "vacina");
      return {
        id: c.id,
        pet_id: c.pet_id,
        pet_nome: p?.nome ?? null,
        pet_foto_url: p?.foto_url ?? null,
        pet_especie: p?.especie ?? null,
        pet_nome_tutor: p?.nome_tutor ?? null,
        pet_data_nascimento: p?.data_nascimento ?? null,
        pet_sexo: p?.sexo ?? null,
        data_consulta: c.data_consulta,
        hora: c.hora,
        motivo: c.motivo,
        status: c.status,
        pagamentos: pagsCons.map((p) => ({ id: p.id, valor: p.valor, forma_pagamento: p.forma_pagamento })),
        exames: exames.map((e) => ({ id: e.id, tipo_servico_nome: e.tipo_servico_nome, resultado: e.resultado, observacoes: e.observacoes, valor: e.valor })),
        procedimentos: procedimentos.map((pr) => ({ id: pr.id, tipo_servico_nome: pr.tipo_servico_nome, observacoes: pr.observacoes, valor: pr.valor })),
        vacinas: vacinas.map((v) => ({ id: v.id, tipo_servico_nome: v.tipo_servico_nome, resultado: v.resultado, observacoes: v.observacoes, valor: v.valor })),
      };
    };
    return NextResponse.json({
      veterinario: vet,
      consultas: ((consultas || []) as ConsultaComPet[]).map(mapConsulta),
    });
  } catch (e) {
    return NextResponse.json({ erro: (e as Error).message }, { status: 500 });
  }
}
