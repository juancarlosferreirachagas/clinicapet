import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY;
if (!url || !key) {
  console.error("Defina SUPABASE_URL e SUPABASE_ANON_KEY no .env ou .env.local");
  process.exit(1);
}

const supabase = createClient(url, key);

async function seed() {
  const { count: petsCount } = await supabase.from("pets").select("*", { count: "exact", head: true });
  if (petsCount > 0) {
    console.log("Banco já possui dados. Use --force para limpar e re-semear.");
    if (!process.argv.includes("--force")) process.exit(0);
    await supabase.from("pagamentos").delete().neq("id", 0);
    await supabase.from("consultas").delete().neq("id", 0);
    await supabase.from("pets").delete().neq("id", 0);
    await supabase.from("veterinarios").delete().neq("id", 0);
  }

  const pets = [
    { nome: "Rex", especie: "Cachorro", raca: "Labrador", nome_tutor: "Maria Silva", telefone: "(11) 98765-4321" },
    { nome: "Mia", especie: "Gato", raca: "Siamês", nome_tutor: "João Santos", telefone: "(11) 91234-5678" },
    { nome: "Thor", especie: "Cachorro", raca: "Golden Retriever", nome_tutor: "Ana Costa", telefone: null },
    { nome: "Luna", especie: "Gato", raca: "Persa", nome_tutor: "Giovana", telefone: "(11) 99999-1111" },
  ];
  const vets = [
    { nome: "Dra. Carla Mendes", crmv: "SP-12345", especialidade: "Clínica geral", email: "carla@clinica.com" },
    { nome: "Dr. Pedro Lima", crmv: "SP-67890", especialidade: "Cirurgia", email: "pedro@clinica.com" },
  ];

  const { data: petsData, error: e1 } = await supabase.from("pets").insert(pets).select("id");
  if (e1) {
    console.error("Erro pets:", e1.message);
    process.exit(1);
  }
  const { data: vetsData, error: e2 } = await supabase.from("veterinarios").insert(vets).select("id");
  if (e2) {
    console.error("Erro veterinários:", e2.message);
    process.exit(1);
  }

  const consultas = [
    { pet_id: petsData[0].id, veterinario_id: vetsData[0].id, data_consulta: "2026-03-10", hora: "09:00", motivo: "Check-up anual" },
    { pet_id: petsData[1].id, veterinario_id: vetsData[0].id, data_consulta: "2026-03-11", hora: "14:30", motivo: "Vacinação" },
    { pet_id: petsData[2].id, veterinario_id: vetsData[1].id, data_consulta: "2026-03-12", hora: "10:00", motivo: "Consulta de rotina" },
    { pet_id: petsData[3].id, veterinario_id: vetsData[0].id, data_consulta: "2026-03-13", hora: "11:00", motivo: "Consulta preventiva" },
  ];
  const { data: consData, error: e3 } = await supabase.from("consultas").insert(consultas).select("id");
  if (e3) {
    console.error("Erro consultas:", e3.message);
    process.exit(1);
  }

  const pagamentos = [
    { consulta_id: consData[0].id, valor: 150, forma_pagamento: "pix", status: "pago", pago_em: new Date().toISOString() },
    { consulta_id: consData[1].id, valor: 80, forma_pagamento: "dinheiro", status: "pago", pago_em: new Date().toISOString() },
    { consulta_id: consData[3].id, valor: 120, forma_pagamento: "cartao", status: "pago", pago_em: new Date().toISOString() },
  ];
  const { error: e4 } = await supabase.from("pagamentos").insert(pagamentos);
  if (e4) {
    console.error("Erro pagamentos:", e4.message);
    process.exit(1);
  }

  console.log("Seed concluído: 4 pets, 2 veterinários, 4 consultas, 3 pagamentos");
}

seed();
