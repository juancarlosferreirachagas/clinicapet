import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { data, error } = await supabase.from("veterinarios").select("*").eq("id", id).single();
    if (error) {
      if (error.code === "PGRST116") return NextResponse.json({ erro: "Veterinário não encontrado" }, { status: 404 });
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
    const crmv = (b.crmv || "").trim();
    if (!nome || !crmv) {
      return NextResponse.json({ erro: "Nome e CRMV são obrigatórios." }, { status: 400 });
    }
    const { data, error } = await supabase.from("veterinarios").update({
      nome,
      crmv,
      especialidade: (b.especialidade || "").trim() || null,
      email: (b.email || "").trim() || null,
    }).eq("id", id).select().single();
    if (error) throw error;
    if (!data) return NextResponse.json({ erro: "Veterinário não encontrado" }, { status: 404 });
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ erro: (e as Error).message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { data: cons } = await supabase.from("consultas").select("id").eq("veterinario_id", id);
    if (cons?.length) return NextResponse.json({ erro: "Veterinário possui consultas vinculadas." }, { status: 400 });
    const { error } = await supabase.from("veterinarios").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ mensagem: "Veterinário excluído" });
  } catch (e) {
    return NextResponse.json({ erro: (e as Error).message }, { status: 500 });
  }
}
