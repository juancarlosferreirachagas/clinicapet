import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { mapSupabaseItem } from "@/lib/mappers";
import type { SupabaseItemRow } from "@/lib/types";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { data: cons, error: eCons } = await supabase
      .from("consultas")
      .select("*, pets(id, nome, especie, raca, nome_tutor, telefone, foto_url), veterinarios(id, nome, crmv, especialidade, email)")
      .eq("id", id)
      .single();

    if (eCons || !cons) {
      if (eCons?.code === "PGRST116") return NextResponse.json({ erro: "Consulta não encontrada" }, { status: 404 });
      throw eCons || new Error("Consulta não encontrada");
    }

    const { data: itens } = await supabase
      .from("consulta_itens")
      .select("*, tipos_servico(nome, categoria)")
      .eq("consulta_id", id)
      .order("id", { ascending: true });

    const { data: pags } = await supabase
      .from("pagamentos")
      .select("*")
      .eq("consulta_id", id)
      .order("id", { ascending: false });

    const pet = cons.pets as { id?: number; nome?: string; especie?: string; raca?: string; nome_tutor?: string; telefone?: string; foto_url?: string } | null;
    const vet = cons.veterinarios as { id?: number; nome?: string; crmv?: string; especialidade?: string; email?: string } | null;

    return NextResponse.json({
      id: cons.id,
      pet_id: cons.pet_id,
      veterinario_id: cons.veterinario_id,
      data_consulta: cons.data_consulta,
      hora: cons.hora,
      motivo: cons.motivo,
      observacoes: cons.observacoes,
      status: cons.status,
      pet: pet,
      veterinario: vet,
      itens: (itens || []).map((i) => mapSupabaseItem(i as SupabaseItemRow)),
      pagamentos: pags || [],
    });
  } catch (e) {
    return NextResponse.json({ erro: (e as Error).message }, { status: 500 });
  }
}
