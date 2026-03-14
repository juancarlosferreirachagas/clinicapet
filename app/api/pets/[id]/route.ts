import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { data, error } = await supabase.from("pets").select("*").eq("id", id).single();
    if (error) {
      if (error.code === "PGRST116") return NextResponse.json({ erro: "Pet não encontrado" }, { status: 404 });
      throw error;
    }
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ erro: (e as Error).message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const b = await request.json();
    const nome = (b.nome || "").trim();
    const especie = (b.especie || "").trim();
    const nome_tutor = (b.nome_tutor || "").trim();
    if (!nome || !especie || !nome_tutor) {
      return NextResponse.json({ erro: "Nome do pet, espécie e nome do tutor são obrigatórios." }, { status: 400 });
    }
    const { data, error } = await supabase.from("pets").update({
      nome,
      especie,
      raca: (b.raca || "").trim() || null,
      nome_tutor,
      telefone: (b.telefone || "").trim() || null,
      foto_url: (b.foto_url || "").trim() || null,
      data_nascimento: (b.data_nascimento || "").trim() || null,
      sexo: (b.sexo || "").trim() || null,
    }).eq("id", id).select().single();
    if (error) throw error;
    if (!data) return NextResponse.json({ erro: "Pet não encontrado" }, { status: 404 });
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ erro: (e as Error).message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { data: cons } = await supabase.from("consultas").select("id").eq("pet_id", id);
    if (cons?.length) return NextResponse.json({ erro: "Pet possui consultas. Exclua-as antes." }, { status: 400 });
    const { error } = await supabase.from("pets").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ mensagem: "Pet excluído" });
  } catch (e) {
    return NextResponse.json({ erro: (e as Error).message }, { status: 500 });
  }
}
