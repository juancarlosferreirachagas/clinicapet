import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { mapConsultaListItem, safeParseFloat } from "@/lib/mappers";
import type { SupabaseConsultaRow } from "@/lib/types";

export async function GET(req: NextRequest) {
  try {
    const incluirCanceladas = req.nextUrl.searchParams.get("incluir_canceladas") === "1";
    let q = supabase
      .from("consultas")
      .select("*, pets(nome, foto_url, especie, nome_tutor), veterinarios(nome)")
      .order("data_consulta", { ascending: false })
      .order("hora", { ascending: false });
    if (!incluirCanceladas) q = q.neq("status", "cancelada");
    const { data, error } = await q;
    if (error) throw error;
    return NextResponse.json(((data || []) as SupabaseConsultaRow[]).map(mapConsultaListItem));
  } catch (e) {
    return NextResponse.json({ erro: (e as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const b = await request.json();
    const pet_id = b.pet_id;
    const data_consulta = (b.data_consulta || "").trim();
    const hora = (b.hora || "").substring(0, 5).trim();
    const itens: { tipo_servico_id: number; observacoes?: string; resultado?: string; valor?: number }[] = Array.isArray(b.itens)
      ? b.itens
          .filter((i: unknown) => i && typeof i === "object" && "tipo_servico_id" in i && i.tipo_servico_id)
          .map((i: { tipo_servico_id: number; observacoes?: string; resultado?: string; valor?: number }) => ({
            tipo_servico_id: +i.tipo_servico_id,
            observacoes: (i.observacoes || "").trim() || undefined,
            resultado: (i.resultado || "").trim() || undefined,
            valor: safeParseFloat(i.valor) ?? undefined,
          }))
      : [];
    if (!pet_id || !data_consulta || !hora) {
      return NextResponse.json({ erro: "Pet, data e hora são obrigatórios." }, { status: 400 });
    }
    const { data, error } = await supabase
      .from("consultas")
      .insert({
        pet_id,
        veterinario_id: b.veterinario_id || null,
        data_consulta,
        hora,
        motivo: (b.motivo || "").trim() || null,
      })
      .select()
      .single();
    if (error) throw error;
    const consulta_id = data.id;
    if (itens.length > 0) {
      const { error: errItens } = await supabase.from("consulta_itens").insert(
        itens.map((i) => ({
          consulta_id,
          tipo_servico_id: i.tipo_servico_id,
          observacoes: i.observacoes ?? null,
          resultado: i.resultado ?? null,
          valor: i.valor ?? null,
        }))
      );
      if (errItens) throw errItens;
    }
    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    return NextResponse.json({ erro: (e as Error).message }, { status: 500 });
  }
}
