import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase.from("pets").select("*").order("id", { ascending: false });
    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (e) {
    return NextResponse.json({ erro: (e as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const b = await request.json();
    const nome = (b.nome || "").trim();
    const especie = (b.especie || "").trim();
    const nome_tutor = (b.nome_tutor || "").trim();
    if (!nome || !especie || !nome_tutor) {
      return NextResponse.json({ erro: "Nome do pet, espécie e nome do tutor são obrigatórios." }, { status: 400 });
    }
    const { data, error } = await supabase.from("pets").insert({
      nome,
      especie,
      raca: (b.raca || "").trim() || null,
      nome_tutor,
      telefone: (b.telefone || "").trim() || null,
      foto_url: (b.foto_url || "").trim() || null,
      data_nascimento: (b.data_nascimento || "").trim() || null,
      sexo: (b.sexo || "").trim() || null,
    }).select().single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    return NextResponse.json({ erro: (e as Error).message }, { status: 500 });
  }
}
