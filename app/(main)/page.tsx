"use client";

import { Suspense } from "react";
import { PetsSection } from "@/components/PetsSection";

function HomeContent() {
  return <PetsSection />;
}

export default function Home() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-[var(--text-muted)] text-[0.9375rem]">Carregando...</div>}>
      <HomeContent />
    </Suspense>
  );
}
