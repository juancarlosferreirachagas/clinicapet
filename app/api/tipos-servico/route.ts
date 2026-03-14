import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const cat = req.nextUrl.searchParams.get("categoria");
    let q = supabase.from("tipos_servico").select("*").order("categoria").order("nome");
    if (cat === "exame" || cat === "procedimento" || cat === "vacina") {
      q = q.eq("categoria", cat);
    }
    const { data, error } = await q;
    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (e) {
    return NextResponse.json({ erro: (e as Error).message }, { status: 500 });
  }
}
