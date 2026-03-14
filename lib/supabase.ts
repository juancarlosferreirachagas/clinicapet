import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!url || !key) {
  throw new Error("Defina SUPABASE_URL e SUPABASE_ANON_KEY (ou NEXT_PUBLIC_*) no .env.local");
}

export const supabase = createClient(url, key);
