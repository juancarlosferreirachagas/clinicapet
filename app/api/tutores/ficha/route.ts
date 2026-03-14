import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { SupabaseItemRow } from "@/lib/types";
import { mapSupabaseItem } from "@/lib/mappers";

interface ConsultaComPetEVet {
  id: number;
  pet_id: number;
  veterinario_id?: number | null;
  data_consulta: string;
  hora: string;
  motivo?: string | null;
  status?: string;
  pets?: { nome?: string; foto_url?: string; especie?: string; nome_tutor?: string } | null;
  veterinarios?: { nome?: string } | null;
}

export async function GET(req: NextRequest) {
  try {
    const nome = req.nextUrl.searchParams.get("nome");
    const telefone = req.nextUrl.searchParams.get("telefone");
    if (!nome || !nome.trim()) {
      return NextResponse.json({ erro: "Parâmetro nome é obrigatório." }, { status: 400 });
    }
    let q = supabase.from("pets").select("id, nome, especie, raca, foto_url, nome_tutor, telefone, data_nascimento, sexo").eq("nome_tutor", nome.trim());
    if (telefone && telefone.trim()) {
      q = q.eq("telefone", telefone.trim());
    }
    const { data: pets, error } = await q.order("nome");
    if (error) throw error;
    const petsList = pets || [];
    const petIds = petsList.map((p: { id: number }) => p.id);

    let consultas: ConsultaComPetEVet[] = [];
    let pagamentos: { consulta_id?: number; id: number; valor: number; forma_pagamento: string }[] = [];
    let itens: ReturnType<typeof mapSupabaseItem>[] = [];

    if (petIds.length) {
      const { data: cons } = await supabase
        .from("consultas")
        .select("*, pets(nome, foto_url, especie, nome_tutor), veterinarios(nome)")
        .in("pet_id", petIds)
        .order("data_consulta", { ascending: false })
        .order("hora", { ascending: false });
      consultas = (cons || []) as ConsultaComPetEVet[];
      const consIds = consultas.map((c) => c.id);

      if (consIds.length) {
        const [pagsRes, itensRes] = await Promise.all([
          supabase.from("pagamentos").select("id, consulta_id, valor, forma_pagamento").in("consulta_id", consIds),
          supabase.from("consulta_itens").select("*, tipos_servico(nome, categoria)").in("consulta_id", consIds),
        ]);
        pagamentos = (pagsRes.data || []) as { consulta_id?: number; id: number; valor: number; forma_pagamento: string }[];
        const rawItens = (itensRes.data || []) as SupabaseItemRow[];
        itens = rawItens.map(mapSupabaseItem);
      }
    }

    const mapConsulta = (c: ConsultaComPetEVet) => {
      const p = c.pets;
      const v = c.veterinarios;
      const pagsCons = pagamentos.filter((pa) => pa.consulta_id === c.id);
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
        data_consulta: c.data_consulta,
        hora: c.hora,
        motivo: c.motivo,
        status: c.status,
        veterinario_nome: v?.nome ?? null,
        pagamentos: pagsCons.map((pa) => ({ id: pa.id, valor: pa.valor, forma_pagamento: pa.forma_pagamento })),
        exames: exames.map((e) => ({ id: e.id, tipo_servico_nome: e.tipo_servico_nome, resultado: e.resultado })),
        procedimentos: procedimentos.map((pr) => ({ id: pr.id, tipo_servico_nome: pr.tipo_servico_nome })),
        vacinas: vacinas.map((va) => ({ id: va.id, tipo_servico_nome: va.tipo_servico_nome, resultado: va.resultado })),
      };
    };

    return NextResponse.json({
      pets: petsList,
      nome_tutor: nome.trim(),
      telefone: telefone || null,
      consultas: consultas.map(mapConsulta),
    });
  } catch (e) {
    return NextResponse.json({ erro: (e as Error).message }, { status: 500 });
  }
}
