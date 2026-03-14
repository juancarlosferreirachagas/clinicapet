import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { mapConsultaListItem } from "@/lib/mappers";
import type { SupabaseConsultaRow } from "@/lib/types";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { data, error } = await supabase
      .from("consultas")
      .select("*, pets(nome), veterinarios(nome)")
      .eq("id", id)
      .single();
    if (error) {
      if (error.code === "PGRST116") return NextResponse.json({ erro: "Consulta não encontrada" }, { status: 404 });
      throw error;
    }
    return NextResponse.json(mapConsultaListItem(data as SupabaseConsultaRow));
  } catch (e) {
    return NextResponse.json({ erro: (e as Error).message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const b = await request.json();
    const pet_id = b.pet_id;
    const data_consulta = (b.data_consulta || "").trim();
    const hora = (b.hora || "").substring(0, 5).trim();
    if (!pet_id || !data_consulta || !hora) {
      return NextResponse.json({ erro: "Pet, data e hora são obrigatórios." }, { status: 400 });
    }
    const { data, error } = await supabase
      .from("consultas")
      .update({
        pet_id,
        veterinario_id: b.veterinario_id || null,
        data_consulta,
        hora,
        motivo: (b.motivo || "").trim() || null,
      })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    if (!data) return NextResponse.json({ erro: "Consulta não encontrada" }, { status: 404 });
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ erro: (e as Error).message }, { status: 500 });
  }
}

export async function DELETE() {
  return NextResponse.json({ erro: "Consultas não são excluídas. Use cancelar." }, { status: 405 });
}
