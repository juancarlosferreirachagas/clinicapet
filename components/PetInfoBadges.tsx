"use client";

import { calcularIdade, getEspecieIcon } from "@/lib/utils";

interface PetInfoBadgesProps {
  especie?: string;
  data_nascimento?: string | null;
  sexo?: string | null;
  showEspecie?: boolean;
  className?: string;
}

export function PetInfoBadges({ especie, data_nascimento, sexo, showEspecie, className = "" }: PetInfoBadgesProps) {
  const idade = calcularIdade(data_nascimento);
  const especieIcon = getEspecieIcon(especie || "");
  const isMacho = sexo?.toLowerCase() === "macho";

  if (!idade && !sexo && !(showEspecie && especie)) return null;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {idade && (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-[var(--primary-muted)] text-[var(--primary)] text-[0.75rem] font-medium" title="Idade">
          <span className="material-icons-round text-sm">cake</span>
          {idade}
        </span>
      )}
      {sexo && (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-100 text-[var(--text-muted)] text-[0.75rem] font-medium" title={isMacho ? "Macho" : "Fêmea"}>
          <span className="material-icons-round text-sm">{isMacho ? "male" : "female"}</span>
          {isMacho ? "Macho" : "Fêmea"}
        </span>
      )}
      {showEspecie && especie && (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-100 text-[var(--text-muted)] text-[0.75rem] font-medium" title={especie}>
          <span className="material-icons-round text-sm">{especieIcon}</span>
          {especie}
        </span>
      )}
    </div>
  );
}
