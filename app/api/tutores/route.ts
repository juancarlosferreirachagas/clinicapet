import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

interface PetTutorRow {
  nome_tutor: string;
  telefone: string | null;
}

export async function GET(req: NextRequest) {
  try {
    const busca = req.nextUrl.searchParams.get("q")?.trim() || "";
    const { data: pets, error } = await supabase.from("pets").select("nome_tutor, telefone").order("nome_tutor");
    if (error) throw error;
    const seen = new Set<string>();
    const tutores: PetTutorRow[] = [];
    const petsList = (pets || []) as PetTutorRow[];
    for (const p of petsList) {
      const key = `${p.nome_tutor}|${p.telefone || ""}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const nome = p.nome_tutor;
      const tel = p.telefone ?? null;
      if (!busca || nome.toLowerCase().includes(busca.toLowerCase()) || (tel && tel.includes(busca))) {
        tutores.push({ nome_tutor: nome, telefone: tel });
      }
    }
    return NextResponse.json(tutores);
  } catch (e) {
    return NextResponse.json({ erro: (e as Error).message }, { status: 500 });
  }
}
