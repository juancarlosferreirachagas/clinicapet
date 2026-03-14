"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { PetsSection } from "@/components/PetsSection";
import { ComingSoonAC } from "@/components/ComingSoonAC";
import type { Section } from "@/lib/types";

const ENTREGAS: Partial<Record<Section, { titulo: string; ac: string; data: string; icon: string }>> = {
  tutores: { titulo: "Cadastro de Tutores", ac: "AC2", data: "12/04", icon: "person" },
  vets: { titulo: "Cadastro de Veterinários", ac: "AC2", data: "12/04", icon: "medical_services" },
  consultas: { titulo: "Consultas e Agenda", ac: "AC3", data: "10/05", icon: "calendar_today" },
  pagamentos: { titulo: "Pagamentos", ac: "AC4 (Prova)", data: "07/06", icon: "payment" },
};

function HomeContent() {
  const searchParams = useSearchParams();
  const s = searchParams.get("s");
  const section: Section = s && ["pets", "vets", "tutores", "consultas", "pagamentos"].includes(s) ? (s as Section) : "pets";
  if (section === "pets") return <PetsSection />;
  const info = section && ENTREGAS[section];
  if (info) return <ComingSoonAC titulo={info.titulo} ac={info.ac} data={info.data} icon={info.icon} />;
  return <PetsSection />;
}

export default function Home() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-[var(--text-muted)] text-[0.9375rem]">Carregando...</div>}>
      <HomeContent />
    </Suspense>
  );
}
