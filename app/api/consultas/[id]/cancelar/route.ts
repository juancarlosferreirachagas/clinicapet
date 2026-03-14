import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function PATCH(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { data: pags } = await supabase.from("pagamentos").select("id").eq("consulta_id", id);
    if (pags?.length) return NextResponse.json({ erro: "Consulta possui pagamentos. Não pode ser cancelada." }, { status: 400 });
    const { data, error } = await supabase.from("consultas").update({ status: "cancelada" }).eq("id", id).select().single();
    if (error) throw error;
    if (!data) return NextResponse.json({ erro: "Consulta não encontrada" }, { status: 404 });
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ erro: (e as Error).message }, { status: 500 });
  }
}
