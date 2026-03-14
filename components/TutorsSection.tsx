"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { API_BASE, CN } from "@/lib/constants";
import { SectionHeader } from "./ui/SectionHeader";
import { Card, CardHeader } from "./ui/Card";

interface TutorItem {
  nome_tutor: string;
  telefone: string | null;
}

export function TutorsSection() {
  const [tutores, setTutores] = useState<TutorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");

  const load = (q = "") => {
    setLoading(true);
    api<TutorItem[]>(`${API_BASE}/tutores${q ? `?q=${encodeURIComponent(q)}` : ""}`).then((r) => {
      if (r.ok && Array.isArray(r.dados)) setTutores(r.dados);
      else setTutores([]);
      setLoading(false);
    });
  };

  useEffect(() => load(), []);

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    load(busca);
  };

  const hrefTutor = (t: TutorItem) =>
    `/tutor?nome=${encodeURIComponent(t.nome_tutor)}${t.telefone ? `&telefone=${encodeURIComponent(t.telefone)}` : ""}`;

  return (
    <section>
      <SectionHeader
        title="Tutores"
        subtitle="Localize o tutor para acessar os pets rapidamente"
        quickLinks={[{ href: "/?s=pets", label: "Pets" }, { href: "/?s=consultas", label: "Consultas" }]}
      />
      <Card>
        <CardHeader title="Lista de tutores" />
        <div className="p-4 border-b border-slate-100">
          <form onSubmit={handleBuscar} className="flex gap-2">
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome ou telefone..."
              className={`${CN.input} flex-1`}
            />
            <button type="submit" className={CN.btnPrimary}>
              Buscar
            </button>
            {busca && (
              <button type="button" onClick={() => { setBusca(""); load(); }} className={CN.btnSecondary}>
                Limpar
              </button>
            )}
          </form>
        </div>
        <div className="divide-y divide-slate-100">
          {loading && <p className={CN.listEmpty}>Carregando...</p>}
          {!loading && !tutores.length && <p className={CN.listEmpty}>Nenhum tutor encontrado.</p>}
          {!loading && tutores.map((t, i) => (
            <Link
              key={`${t.nome_tutor}-${t.telefone || ""}-${i}`}
              href={hrefTutor(t)}
              className="flex items-center gap-4 px-5 py-4 hover:bg-[var(--primary-subtle)] transition-colors duration-200"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary-muted)] to-[var(--primary-light)]/50 flex items-center justify-center flex-shrink-0">
                <span className="material-icons-round text-[var(--primary)] text-2xl">person</span>
              </div>
              <div className="flex-1 min-w-0">
                <span className={CN.link}>{t.nome_tutor}</span>
                {t.telefone && <p className="text-[0.75rem] text-[var(--text-muted)]">{t.telefone}</p>}
              </div>
              <span className="material-icons-round text-[var(--text-muted)]">chevron_right</span>
            </Link>
          ))}
        </div>
      </Card>
    </section>
  );
}
