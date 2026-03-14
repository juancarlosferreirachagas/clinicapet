import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { safeParseFloat } from "@/lib/mappers";

export async function GET() {
  try {
    const { data: pags, error } = await supabase
      .from("pagamentos")
      .select("*, consultas(pet_id, data_consulta)")
      .order("id", { ascending: false });
    if (error) throw error;
    if (!pags?.length) return NextResponse.json([]);
    const { data: pets } = await supabase.from("pets").select("id, nome, foto_url, especie, nome_tutor");
    const petMap = Object.fromEntries((pets || []).map((p: { id: number; nome: string; foto_url?: string; especie?: string; nome_tutor?: string }) => [p.id, p]));
    return NextResponse.json(
      pags.map((p: { id: number; consulta_id: number; valor: number; forma_pagamento: string; status: string; consultas?: { pet_id?: number; data_consulta?: string } }) => {
        const pet = p.consultas?.pet_id ? petMap[p.consultas.pet_id] : null;
        return {
          id: p.id,
          consulta_id: p.consulta_id,
          valor: p.valor,
          forma_pagamento: p.forma_pagamento,
          status: p.status,
          data_consulta: p.consultas?.data_consulta,
          pet_id: p.consultas?.pet_id ?? null,
          pet_nome: pet?.nome ?? null,
          pet_foto_url: pet?.foto_url ?? null,
          pet_especie: pet?.especie ?? null,
          pet_nome_tutor: pet?.nome_tutor ?? null,
        };
      })
    );
  } catch (e) {
    return NextResponse.json({ erro: (e as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const b = await request.json();
    const consulta_id = b.consulta_id;
    const valor = safeParseFloat(b.valor);
    if (!consulta_id) return NextResponse.json({ erro: "Consulta é obrigatória." }, { status: 400 });
    if (!valor || valor <= 0) return NextResponse.json({ erro: "Valor deve ser maior que zero." }, { status: 400 });
    const { data, error } = await supabase
      .from("pagamentos")
      .insert({
        consulta_id,
        valor,
        forma_pagamento: (b.forma_pagamento || "dinheiro").trim() || "dinheiro",
        status: "pago",
        pago_em: new Date().toISOString(),
      })
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    return NextResponse.json({ erro: (e as Error).message }, { status: 500 });
  }
}
