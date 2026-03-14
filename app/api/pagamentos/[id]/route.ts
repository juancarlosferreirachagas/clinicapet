import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { safeParseFloat } from "@/lib/mappers";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { data, error } = await supabase.from("pagamentos").select("*").eq("id", id).single();
    if (error) {
      if (error.code === "PGRST116") return NextResponse.json({ erro: "Pagamento não encontrado" }, { status: 404 });
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
    const valor = safeParseFloat(b.valor);
    if (!valor || valor <= 0) return NextResponse.json({ erro: "Valor deve ser maior que zero." }, { status: 400 });
    const { data, error } = await supabase
      .from("pagamentos")
      .update({ valor, forma_pagamento: (b.forma_pagamento || "dinheiro").trim() || "dinheiro" })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    if (!data) return NextResponse.json({ erro: "Pagamento não encontrado" }, { status: 404 });
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ erro: (e as Error).message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { error } = await supabase.from("pagamentos").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ mensagem: "Pagamento excluído" });
  } catch (e) {
    return NextResponse.json({ erro: (e as Error).message }, { status: 500 });
  }
}
