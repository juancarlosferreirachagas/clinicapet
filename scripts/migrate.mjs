import dotenv from "dotenv";
import { existsSync, readdirSync, readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
dotenv.config({ path: join(root, ".env") });
dotenv.config({ path: join(root, ".env.local") });

// Supabase: Project Settings > Database > Connection string (URI)
const url = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
if (!url) {
  console.error("Defina DATABASE_URL no .env.local");
  console.error("Supabase: Project Settings > Database > Connection string (URI)");
  process.exit(1);
}

async function migrate() {
  let pg;
  try {
    pg = (await import("pg")).default;
  } catch {
    console.error("Instale pg: npm install pg");
    process.exit(1);
  }

  const client = new pg.Client({ connectionString: url });
  try {
    await client.connect();
    const migrationsDir = join(__dirname, "../database/migrations");
    const files = readdirSync(migrationsDir).filter((f) => f.endsWith(".sql")).sort();
    for (const file of files) {
      const sql = readFileSync(join(migrationsDir, file), "utf8");
      await client.query(sql);
      console.log("Migração executada:", file);
    }
    console.log("Todas as migrações concluídas.");
  } catch (e) {
    console.error("Erro:", e.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

migrate();
