"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, getErrorMessage } from "@/lib/api";
import { formatarData } from "@/lib/utils";
import { API_BASE, CN } from "@/lib/constants";
import type { ConsultaFicha, ItemComConsulta, Pet } from "@/lib/types";
import { Breadcrumb } from "./Breadcrumb";
import { PetAvatar } from "./PetAvatar";
import { PetInfoBadges } from "./PetInfoBadges";
import { useToast } from "./Toast";

interface FichaData {
  pet: Pet;
  consultas: ConsultaFicha[];
  outros_pets?: { id: number; nome: string; especie: string; raca?: string; foto_url?: string; data_nascimento?: string; sexo?: string }[];
}

export function PetFicha({ id }: { id: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [data, setData] = useState<FichaData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<FichaData>(`${API_BASE}/pets/${id}/ficha`).then((r) => {
      if (r.ok && r.dados && !("erro" in r.dados)) setData(r.dados);
      else {
        toast(getErrorMessage(r, "Erro ao carregar ficha."), "error");
        router.push("/");
      }
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <p className={CN.listEmpty}>Carregando...</p>;
  if (!data) return null;

  const { pet, consultas, outros_pets = [] } = data;
  const totalExames = consultas.reduce((s, c) => s + (c.exames?.length || 0), 0);
  const ultimaConsulta = consultas[0];
  const examesComConsulta: ItemComConsulta[] = consultas.flatMap((c) => (c.exames || []).map((e) => ({ ...e, consulta_id: c.id, data_consulta: c.data_consulta, hora: c.hora, veterinario_nome: c.veterinario_nome })));
  const procedimentosComConsulta: ItemComConsulta[] = consultas.flatMap((c) => (c.procedimentos || []).map((p) => ({ ...p, consulta_id: c.id, data_consulta: c.data_consulta, hora: c.hora, veterinario_nome: c.veterinario_nome })));
  const vacinasComConsulta: ItemComConsulta[] = consultas.flatMap((c) => (c.vacinas || []).map((v) => ({ ...v, consulta_id: c.id, data_consulta: c.data_consulta, hora: c.hora, veterinario_nome: c.veterinario_nome })));

  return (
    <section className="max-w-6xl">
      <Breadcrumb crumbs={[{ href: "/", label: "Home" }, { href: "/?s=pets", label: "Pets" }, { label: pet.nome }]} />

      {/* Hero */}
      <div className="flex flex-col sm:flex-row gap-8 p-6 lg:p-8 rounded-[var(--radius-xl)] bg-white border border-slate-100/80 shadow-[var(--card-shadow)] mb-8">
        <PetAvatar fotoUrl={pet.foto_url} especie={pet.especie} nome={pet.nome} size="lg" />
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-[var(--text)] mb-1 tracking-tight">{pet.nome}</h1>
          <p className="text-[var(--primary)] font-medium text-[0.9375rem]">{pet.especie}{pet.raca ? ` • ${pet.raca}` : ""}</p>
          <PetInfoBadges especie={pet.especie} data_nascimento={pet.data_nascimento} sexo={pet.sexo} showEspecie className="mt-2" />
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center gap-2 text-[0.8125rem]">
              <span className="material-icons-round text-[var(--primary)] text-lg">person</span>
              <span className="text-[var(--text-muted)]">Tutor:</span>
              <Link href={`/tutor?nome=${encodeURIComponent(pet.nome_tutor)}${pet.telefone ? `&telefone=${encodeURIComponent(pet.telefone)}` : ""}`} className={`${CN.link} font-medium`}>
                {pet.nome_tutor}
              </Link>
            </div>
            {pet.telefone && (
              <a href={`tel:${pet.telefone.replace(/\D/g, "")}`} className="flex items-center gap-2 text-[0.8125rem] text-[var(--primary)] hover:underline">
                <span className="material-icons-round text-lg">phone</span>
                {pet.telefone}
              </a>
            )}
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            <Link href="/?s=pagamentos" className="inline-flex items-center gap-1.5 px-4 py-2 text-[0.8125rem] font-medium rounded-xl bg-[var(--primary-muted)] text-[var(--primary)] hover:bg-[var(--primary-light)]/80 transition-colors">
              <span className="material-icons-round text-base">payment</span> Pagamentos
            </Link>
            <Link href="/?s=consultas" className="inline-flex items-center gap-1.5 px-4 py-2 text-[0.8125rem] font-medium rounded-xl bg-[var(--primary-muted)] text-[var(--primary)] hover:bg-[var(--primary-light)]/80 transition-colors">
              <span className="material-icons-round text-base">calendar_today</span> Agenda
            </Link>
          </div>
        </div>
      </div>

      {/* Resumo – informações relevantes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-[var(--radius-lg)] bg-white border border-slate-100/80 shadow-[var(--shadow)] hover:shadow-[var(--shadow-md)] transition-shadow duration-200">
          <div className="flex items-center gap-2 text-[var(--text-muted)] text-[0.75rem] font-medium mb-1">
            <span className="material-icons-round text-base">event_note</span> Consultas
          </div>
          <div className="text-2xl font-bold text-[var(--primary)]">{consultas.length}</div>
        </div>
        <div className="p-5 rounded-[var(--radius-lg)] bg-white border border-slate-100/80 shadow-[var(--shadow)] hover:shadow-[var(--shadow-md)] transition-shadow duration-200">
          <div className="flex items-center gap-2 text-[var(--text-muted)] text-[0.75rem] font-medium mb-1">
            <span className="material-icons-round text-base">science</span> Exames
          </div>
          <div className="text-2xl font-bold text-[var(--text)]">{totalExames}</div>
        </div>
        <div className="p-5 rounded-[var(--radius-lg)] bg-white border border-slate-100/80 shadow-[var(--shadow)] hover:shadow-[var(--shadow-md)] transition-shadow duration-200">
          <div className="flex items-center gap-2 text-[var(--text-muted)] text-[0.75rem] font-medium mb-1">
            <span className="material-icons-round text-base">schedule</span> Última consulta
          </div>
          <div className="text-base font-semibold text-[var(--text)]">
            {ultimaConsulta ? `${formatarData(ultimaConsulta.data_consulta)}` : "—"}
          </div>
          {ultimaConsulta?.veterinario_nome && <p className="text-[0.7rem] text-[var(--text-muted)]">Dr(a) {ultimaConsulta.veterinario_nome}</p>}
        </div>
        <div className="p-5 rounded-[var(--radius-lg)] bg-white border border-slate-100/80 shadow-[var(--shadow)] hover:shadow-[var(--shadow-md)] transition-shadow duration-200">
          <div className="flex items-center gap-2 text-[var(--text-muted)] text-[0.75rem] font-medium mb-1">
            <span className="material-icons-round text-base">pets</span> Espécie
          </div>
          <div className="text-base font-semibold text-[var(--text)] truncate">{pet.especie}{pet.raca ? ` • ${pet.raca}` : ""}</div>
        </div>
      </div>

      {/* Outros pets do tutor */}
      {outros_pets.length > 0 && (
        <div className="rounded-[var(--radius-lg)] bg-white border border-slate-100/80 shadow-[var(--shadow)] overflow-hidden mb-8">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <span className="material-icons-round text-[var(--primary)] text-lg">pets</span>
              Outros pets do tutor ({pet.nome_tutor})
            </h2>
          </div>
          <div className="flex flex-wrap gap-3 p-5">
            {outros_pets.map((o) => (
              <Link key={o.id} href={`/pet/${o.id}`} className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[var(--primary-muted)] text-[var(--primary)] hover:bg-[var(--primary-light)]/80 text-[0.9375rem] font-medium transition-colors duration-200">
                <PetAvatar fotoUrl={o.foto_url} especie={o.especie} nome={o.nome} size="sm" />
                <div>
                  <div>{o.nome} {o.raca ? `(${o.raca})` : ""}</div>
                  <PetInfoBadges data_nascimento={o.data_nascimento} sexo={o.sexo} className="mt-0.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Histórico em 4 colunas */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-[var(--text)] flex items-center gap-2">
          <span className="material-icons-round text-[var(--primary)] text-lg">history</span>
          Histórico
        </h2>
        <Link href="/?s=consultas" className="text-[0.75rem] font-medium text-[var(--primary)] hover:underline flex items-center gap-1">
          Ver agenda <span className="material-icons-round text-sm">open_in_new</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Coluna Consultas */}
        <div className="rounded-[var(--radius-lg)] bg-white border border-slate-100/80 shadow-[var(--shadow)] overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-[0.875rem] font-semibold flex items-center gap-2">
              <span className="material-icons-round text-[var(--primary)] text-lg">event_note</span>
              Consultas
            </h3>
          </div>
          <div className="divide-y divide-slate-100">
            {!consultas.length && <p className="text-[var(--text-muted)] py-6 text-center text-[0.8125rem]">Nenhuma consulta</p>}
            {consultas.map((c) => (
              <Link key={c.id} href={`/pet/${pet.id}/consulta/${c.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--primary-subtle)] transition-colors">
                <PetAvatar fotoUrl={pet.foto_url} especie={pet.especie} nome={pet.nome} size="xs" className="shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-[var(--primary)] text-[0.8125rem]">{formatarData(c.data_consulta)} às {c.hora}</div>
                  {c.veterinario_nome && <p className="text-[0.75rem] text-[var(--text-muted)]">Dr(a) {c.veterinario_nome}</p>}
                  {c.motivo && <p className="text-[0.75rem] text-[var(--text-muted)] truncate">{c.motivo}</p>}
                  {c.pagamentos?.length > 0 && <p className="text-[0.7rem] text-[var(--text-muted)] mt-0.5">R$ {c.pagamentos.reduce((s, p) => s + p.valor, 0).toFixed(2)}</p>}
                </div>
              </Link>
            ))}
          </div>
        </div>
        {/* Coluna Exames */}
        <div className="rounded-[var(--radius-lg)] bg-white border border-slate-100/80 shadow-[var(--shadow)] overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-[0.875rem] font-semibold flex items-center gap-2">
              <span className="material-icons-round text-[var(--primary)] text-lg">science</span>
              Exames
            </h3>
          </div>
          <div className="divide-y divide-slate-100">
            {!examesComConsulta.length && <p className="text-[var(--text-muted)] py-6 text-center text-[0.8125rem]">Nenhum exame</p>}
            {examesComConsulta.map((e) => (
              <Link key={e.id} href={`/pet/${pet.id}/consulta/${e.consulta_id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--primary-subtle)] transition-colors">
                <PetAvatar fotoUrl={pet.foto_url} especie={pet.especie} nome={pet.nome} size="xs" className="shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-[var(--primary)] text-[0.8125rem]">{e.tipo_servico_nome || "Exame"}</div>
                  <p className="text-[0.75rem] text-[var(--text-muted)]">{e.data_consulta} às {e.hora}</p>
                  {e.resultado && <p className="text-[0.7rem] text-[var(--text-muted)] truncate">{e.resultado}</p>}
                </div>
              </Link>
            ))}
          </div>
        </div>
        {/* Coluna Procedimentos */}
        <div className="rounded-[var(--radius-lg)] bg-white border border-slate-100/80 shadow-[var(--shadow)] overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-[0.875rem] font-semibold flex items-center gap-2">
              <span className="material-icons-round text-[var(--primary)] text-lg">medical_services</span>
              Procedimentos
            </h3>
          </div>
          <div className="divide-y divide-slate-100">
            {!procedimentosComConsulta.length && <p className="text-[var(--text-muted)] py-6 text-center text-[0.8125rem]">Nenhum procedimento</p>}
            {procedimentosComConsulta.map((p) => (
              <Link key={p.id} href={`/pet/${pet.id}/consulta/${p.consulta_id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--primary-subtle)] transition-colors">
                <PetAvatar fotoUrl={pet.foto_url} especie={pet.especie} nome={pet.nome} size="xs" className="shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-[var(--primary)] text-[0.8125rem]">{p.tipo_servico_nome || "Procedimento"}</div>
                  <p className="text-[0.75rem] text-[var(--text-muted)]">{p.data_consulta} às {p.hora}</p>
                  {p.observacoes && <p className="text-[0.7rem] text-[var(--text-muted)] truncate">{p.observacoes}</p>}
                </div>
              </Link>
            ))}
          </div>
        </div>
        {/* Coluna Vacinas */}
        <div className="rounded-[var(--radius-lg)] bg-white border border-slate-100/80 shadow-[var(--shadow)] overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-[0.875rem] font-semibold flex items-center gap-2">
              <span className="material-icons-round text-[var(--primary)] text-lg">vaccines</span>
              Vacinas
            </h3>
          </div>
          <div className="divide-y divide-slate-100">
            {!vacinasComConsulta.length && <p className="text-[var(--text-muted)] py-6 text-center text-[0.8125rem]">Nenhuma vacina</p>}
            {vacinasComConsulta.map((v) => (
              <Link key={v.id} href={`/pet/${pet.id}/consulta/${v.consulta_id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--primary-subtle)] transition-colors">
                <PetAvatar fotoUrl={pet.foto_url} especie={pet.especie} nome={pet.nome} size="xs" className="shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-[var(--primary)] text-[0.8125rem]">{v.tipo_servico_nome || "Vacina"}</div>
                  <p className="text-[0.75rem] text-[var(--text-muted)]">{v.data_consulta} às {v.hora}</p>
                  {v.resultado && <p className="text-[0.7rem] text-[var(--text-muted)] truncate">{v.resultado}</p>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
