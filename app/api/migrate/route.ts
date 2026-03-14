import { NextRequest, NextResponse } from "next/server";
import { readdirSync, readFileSync } from "fs";
import { join } from "path";

const MIGRATIONS_DIR = join(process.cwd(), "database", "migrations");

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-migration-secret");
  const expected = process.env.MIGRATION_SECRET;
  if (!expected || secret !== expected) {
    return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });
  }

  const url = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
  if (!url) {
    return NextResponse.json(
      { erro: "DATABASE_URL não definido. Adicione em .env.local (Supabase > Project Settings > Database > Connection string)" },
      { status: 500 }
    );
  }

  try {
    // @ts-expect-error pg types not installed (dev-only route)
    const pg = (await import("pg")).default;
    const client = new pg.Client({ connectionString: url });
    await client.connect();
    const files = readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith(".sql")).sort();
    for (const file of files) {
      const sql = readFileSync(join(MIGRATIONS_DIR, file), "utf8");
      await client.query(sql);
    }
    await client.end();
    return NextResponse.json({ ok: true, mensagem: `${files.length} migração(ões) executada(s).` });
  } catch (e) {
    return NextResponse.json({ erro: (e as Error).message }, { status: 500 });
  }
}
