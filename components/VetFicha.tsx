"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, getErrorMessage } from "@/lib/api";
import { formatarData } from "@/lib/utils";
import { API_BASE, CN } from "@/lib/constants";
import type { ConsultaFicha, ItemComConsulta, Veterinario } from "@/lib/types";
import { useToast } from "./Toast";
import { Breadcrumb } from "./Breadcrumb";
import { PetAvatar } from "./PetAvatar";
import { PetInfoBadges } from "./PetInfoBadges";

interface FichaData {
  veterinario: Veterinario;
  consultas: ConsultaFicha[];
}

interface PetUnico {
  id: number;
  nome: string;
  especie: string;
  foto_url?: string;
  nome_tutor: string;
  data_nascimento?: string;
  sexo?: string;
}

function VetAvatar({ nome }: { nome: string }) {
  const initials = nome
    .split(" ")
    .filter((_, i, arr) => i === 0 || i === arr.length - 1)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return (
    <div className="w-36 h-36 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] flex items-center justify-center text-white text-3xl font-bold shadow-xl flex-shrink-0">
      {initials}
    </div>
  );
}

export function VetFicha({ id }: { id: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [data, setData] = useState<FichaData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<FichaData>(`${API_BASE}/veterinarios/${id}/ficha`).then((r) => {
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

  const { veterinario, consultas } = data;
  const totalExames = consultas.reduce((s, c) => s + (c.exames?.length || 0), 0);
  const ultimaConsulta = consultas[0];
  const examesComConsulta: ItemComConsulta[] = consultas.flatMap((c) => (c.exames || []).map((e) => ({ ...e, consulta_id: c.id, pet_id: c.pet_id!, pet_foto_url: c.pet_foto_url, pet_especie: c.pet_especie, pet_nome: c.pet_nome, data_consulta: c.data_consulta, hora: c.hora })));
  const procedimentosComConsulta: ItemComConsulta[] = consultas.flatMap((c) => (c.procedimentos || []).map((p) => ({ ...p, consulta_id: c.id, pet_id: c.pet_id!, pet_foto_url: c.pet_foto_url, pet_especie: c.pet_especie, pet_nome: c.pet_nome, data_consulta: c.data_consulta, hora: c.hora })));
  const vacinasComConsulta: ItemComConsulta[] = consultas.flatMap((c) => (c.vacinas || []).map((v) => ({ ...v, consulta_id: c.id, pet_id: c.pet_id!, pet_foto_url: c.pet_foto_url, pet_especie: c.pet_especie, pet_nome: c.pet_nome, data_consulta: c.data_consulta, hora: c.hora })));
  const petsUnicos: PetUnico[] = Array.from(new Map(consultas.filter((c) => c.pet_id != null).map((c) => [c.pet_id!, { id: c.pet_id!, nome: c.pet_nome ?? "", especie: c.pet_especie ?? "", foto_url: c.pet_foto_url ?? undefined, nome_tutor: c.pet_nome_tutor ?? "", data_nascimento: c.pet_data_nascimento ?? undefined, sexo: c.pet_sexo ?? undefined }])).values());

  return (
    <section className="max-w-6xl">
      <Breadcrumb crumbs={[{ href: "/", label: "Home" }, { href: "/?s=vets", label: "Veterinários" }, { label: veterinario.nome }]} />

      {/* Hero */}
      <div className="flex flex-col sm:flex-row gap-8 p-6 lg:p-8 rounded-[var(--radius-xl)] bg-white border border-slate-100/80 shadow-[var(--card-shadow)] mb-8">
        <VetAvatar nome={veterinario.nome} />
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-[var(--text)] mb-1 tracking-tight">{veterinario.nome}</h1>
          <p className="text-[var(--primary)] font-medium text-[0.9375rem]">CRMV {veterinario.crmv}</p>
          {veterinario.especialidade && (
            <p className="text-[var(--text-muted)] text-[0.875rem] mt-1">{veterinario.especialidade}</p>
          )}
          <div className="flex flex-wrap gap-4 mt-4">
            {veterinario.email && (
              <a href={`mailto:${veterinario.email}`} className="flex items-center gap-2 text-[0.8125rem] text-[var(--primary)] hover:underline">
                <span className="material-icons-round text-lg">email</span>
                {veterinario.email}
              </a>
            )}
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            <Link href="/?s=consultas" className="inline-flex items-center gap-1.5 px-4 py-2 text-[0.8125rem] font-medium rounded-xl bg-[var(--primary-muted)] text-[var(--primary)] hover:bg-[var(--primary-light)]/80 transition-colors">
              <span className="material-icons-round text-base">calendar_today</span> Agenda
            </Link>
            <Link href="/?s=pagamentos" className="inline-flex items-center gap-1.5 px-4 py-2 text-[0.8125rem] font-medium rounded-xl bg-[var(--primary-muted)] text-[var(--primary)] hover:bg-[var(--primary-light)]/80 transition-colors">
              <span className="material-icons-round text-base">payment</span> Pagamentos
            </Link>
          </div>
        </div>
      </div>

      {/* Resumo */}
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
            {ultimaConsulta ? formatarData(ultimaConsulta.data_consulta) : "—"}
          </div>
          {ultimaConsulta?.pet_nome && <p className="text-[0.7rem] text-[var(--text-muted)]">{ultimaConsulta.pet_nome}</p>}
        </div>
        <div className="p-5 rounded-[var(--radius-lg)] bg-white border border-slate-100/80 shadow-[var(--shadow)] hover:shadow-[var(--shadow-md)] transition-shadow duration-200">
          <div className="flex items-center gap-2 text-[var(--text-muted)] text-[0.75rem] font-medium mb-1">
            <span className="material-icons-round text-base">workspace_premium</span> Especialidade
          </div>
          <div className="text-base font-semibold text-[var(--text)] truncate">{veterinario.especialidade || "—"}</div>
        </div>
      </div>

      {/* Pets atendidos – fotos organizadas */}
      {petsUnicos.length > 0 && (
        <div className="rounded-[var(--radius-lg)] bg-white border border-slate-100/80 shadow-[var(--shadow)] overflow-hidden mb-8">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <span className="material-icons-round text-[var(--primary)] text-lg">pets</span>
              Pets atendidos ({petsUnicos.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
            {petsUnicos.map((p) => (
              <Link key={p.id} href={`/pet/${p.id}`} className="flex flex-col rounded-[var(--radius)] border-l-[3px] border-l-[var(--primary)] bg-slate-50/80 hover:bg-[var(--primary-subtle)] p-4 transition-colors">
                <div className="flex items-start gap-3">
                  <PetAvatar fotoUrl={p.foto_url} especie={p.especie} nome={p.nome} size="md" className="shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className={CN.link}>{p.nome}</span>
                    <p className="text-[0.8125rem] text-[var(--text-muted)]">{p.especie}</p>
                    <PetInfoBadges especie={p.especie} data_nascimento={p.data_nascimento} sexo={p.sexo} showEspecie className="mt-1" />
                    {p.nome_tutor && <p className="text-[0.75rem] text-[var(--text-muted)] mt-0.5">Tutor: {p.nome_tutor}</p>}
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center gap-1 text-[0.75rem] text-[var(--primary)]">
                  Ver ficha <span className="material-icons-round text-sm">chevron_right</span>
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
              <Link key={c.id} href={`/pet/${c.pet_id}/consulta/${c.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--primary-subtle)] transition-colors">
                <PetAvatar fotoUrl={c.pet_foto_url} especie={c.pet_especie ?? ""} nome={c.pet_nome ?? ""} size="sm" className="shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-[var(--primary)] text-[0.8125rem]">{formatarData(c.data_consulta)} às {c.hora}</div>
                  {c.pet_nome && <p className="text-[0.75rem] text-[var(--text-muted)]">{c.pet_nome}</p>}
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
              <Link key={e.id} href={`/pet/${e.pet_id}/consulta/${e.consulta_id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--primary-subtle)] transition-colors">
                <PetAvatar fotoUrl={e.pet_foto_url} especie={e.pet_especie ?? ""} nome={e.pet_nome ?? ""} size="xs" className="shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-[var(--primary)] text-[0.8125rem]">{e.tipo_servico_nome || "Exame"}</div>
                  <p className="text-[0.75rem] text-[var(--text-muted)]">{e.data_consulta} às {e.hora}</p>
                  {e.pet_nome && <p className="text-[0.7rem] text-[var(--text-muted)]">{e.pet_nome}</p>}
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
              <Link key={p.id} href={`/pet/${p.pet_id}/consulta/${p.consulta_id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--primary-subtle)] transition-colors">
                <PetAvatar fotoUrl={p.pet_foto_url} especie={p.pet_especie ?? ""} nome={p.pet_nome ?? ""} size="xs" className="shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-[var(--primary)] text-[0.8125rem]">{p.tipo_servico_nome || "Procedimento"}</div>
                  <p className="text-[0.75rem] text-[var(--text-muted)]">{p.data_consulta} às {p.hora}</p>
                  {p.pet_nome && <p className="text-[0.7rem] text-[var(--text-muted)]">{p.pet_nome}</p>}
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
              <Link key={v.id} href={`/pet/${v.pet_id}/consulta/${v.consulta_id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--primary-subtle)] transition-colors">
                <PetAvatar fotoUrl={v.pet_foto_url} especie={v.pet_especie ?? ""} nome={v.pet_nome ?? ""} size="xs" className="shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-[var(--primary)] text-[0.8125rem]">{v.tipo_servico_nome || "Vacina"}</div>
                  <p className="text-[0.75rem] text-[var(--text-muted)]">{v.data_consulta} às {v.hora}</p>
                  {v.pet_nome && <p className="text-[0.7rem] text-[var(--text-muted)]">{v.pet_nome}</p>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
