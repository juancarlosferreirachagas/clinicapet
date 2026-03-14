"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { PetsSection } from "@/components/PetsSection";
import { VetsSection } from "@/components/VetsSection";
import { ConsultasSection } from "@/components/ConsultasSection";
import { PagamentosSection } from "@/components/PagamentosSection";
import { TutorsSection } from "@/components/TutorsSection";
import type { Section } from "@/lib/types";

function HomeContent() {
  const searchParams = useSearchParams();
  const s = searchParams.get("s");
  const section: Section = s && ["pets", "vets", "tutores", "consultas", "pagamentos"].includes(s) ? (s as Section) : "pets";
  if (section === "pets") return <PetsSection />;
  if (section === "vets") return <VetsSection />;
  if (section === "tutores") return <TutorsSection />;
  if (section === "consultas") return <ConsultasSection />;
  return <PagamentosSection />;
}

export default function Home() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-[var(--text-muted)] text-[0.9375rem]">Carregando...</div>}>
      <HomeContent />
    </Suspense>
  );
}
