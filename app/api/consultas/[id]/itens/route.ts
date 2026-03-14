import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { SupabaseItemRow } from "@/lib/types";
import { mapSupabaseItem, safeParseFloat } from "@/lib/mappers";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { data, error } = await supabase
      .from("consulta_itens")
      .select("*, tipos_servico(nome, categoria)")
      .eq("consulta_id", id)
      .order("id", { ascending: true });
    if (error) throw error;
    const rawItens = (data || []) as SupabaseItemRow[];
    return NextResponse.json(
      rawItens.map((i) => ({ ...mapSupabaseItem(i), tipo_servico_id: i.tipo_servico_id }))
    );
  } catch (e) {
    return NextResponse.json({ erro: (e as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const b = await request.json();
    const tipo_servico_id = b.tipo_servico_id;
    if (!tipo_servico_id) {
      return NextResponse.json({ erro: "Tipo de serviço é obrigatório." }, { status: 400 });
    }
    const { data, error } = await supabase
      .from("consulta_itens")
      .insert({
        consulta_id: +id,
        tipo_servico_id: +tipo_servico_id,
        observacoes: (b.observacoes || "").trim() || null,
        resultado: (b.resultado || "").trim() || null,
        valor: safeParseFloat(b.valor),
      })
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    return NextResponse.json({ erro: (e as Error).message }, { status: 500 });
  }
}
