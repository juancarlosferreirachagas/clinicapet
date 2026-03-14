import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase.from("veterinarios").select("*").order("id", { ascending: false });
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
    const crmv = (b.crmv || "").trim();
    if (!nome || !crmv) {
      return NextResponse.json({ erro: "Nome e CRMV são obrigatórios." }, { status: 400 });
    }
    const { data, error } = await supabase.from("veterinarios").insert({
      nome,
      crmv,
      especialidade: (b.especialidade || "").trim() || null,
      email: (b.email || "").trim() || null,
    }).select().single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    return NextResponse.json({ erro: (e as Error).message }, { status: 500 });
  }
}
