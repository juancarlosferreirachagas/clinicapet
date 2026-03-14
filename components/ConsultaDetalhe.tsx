"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, getErrorMessage } from "@/lib/api";
import { formatarData } from "@/lib/utils";
import { API_BASE, CN } from "@/lib/constants";
import type { TipoServico } from "@/lib/types";
import { Breadcrumb } from "./Breadcrumb";
import { PetAvatar } from "./PetAvatar";
import { useToast } from "./Toast";

interface ConsultaDetalheData {
  id: number;
  pet_id: number;
  veterinario_id?: number | null;
  data_consulta: string;
  hora: string;
  motivo?: string | null;
  observacoes?: string | null;
  status?: string;
  pet: { id: number; nome: string; especie: string; raca?: string; nome_tutor?: string; telefone?: string; foto_url?: string };
  veterinario?: { id: number; nome: string; crmv: string; especialidade?: string } | null;
  itens: { id: number; tipo_servico_nome: string; tipo_servico_categoria: string; observacoes?: string; resultado?: string; valor?: number }[];
  pagamentos: { id: number; valor: number; forma_pagamento: string }[];
}

export function ConsultaDetalhe({ id, petId }: { id: string; petId?: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [data, setData] = useState<ConsultaDetalheData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tipos, setTipos] = useState<TipoServico[]>([]);
  const [addExame, setAddExame] = useState(false);
  const [addProc, setAddProc] = useState(false);
  const [addVacina, setAddVacina] = useState(false);
  const [addForm, setAddForm] = useState({ tipo_servico_id: "", observacoes: "", resultado: "", valor: "" });

  useEffect(() => {
    const load = () => {
      api<ConsultaDetalheData>(`${API_BASE}/consultas/${id}/detalhe`).then((r) => {
        if (r.ok && r.dados && !("erro" in r.dados)) setData(r.dados);
        else {
          toast(getErrorMessage(r, "Erro ao carregar."), "error");
          router.push(petId ? `/pet/${petId}` : "/");
        }
        setLoading(false);
      });
    };
    load();
    api<TipoServico[]>(`${API_BASE}/tipos-servico`).then((r) => {
      if (r.ok && Array.isArray(r.dados)) setTipos(r.dados);
    });
  }, [id, petId, router, toast]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.tipo_servico_id) return;
    const r = await api<unknown>(`${API_BASE}/consultas/${id}/itens`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tipo_servico_id: +addForm.tipo_servico_id,
        observacoes: addForm.observacoes || null,
        resultado: addForm.resultado || null,
        valor: addForm.valor ? parseFloat(addForm.valor) : null,
      }),
    });
    if (r.ok) {
      toast("Item adicionado.", "success");
      setAddForm({ tipo_servico_id: "", observacoes: "", resultado: "", valor: "" });
      setAddExame(false);
      setAddProc(false);
      setAddVacina(false);
      api<ConsultaDetalheData>(`${API_BASE}/consultas/${id}/detalhe`).then((r) => {
        if (r.ok && r.dados && !("erro" in r.dados)) setData(r.dados);
      });
    } else toast(getErrorMessage(r, "Erro ao adicionar."), "error");
  };

  if (loading) return <p className={CN.listEmpty}>Carregando...</p>;
  if (!data) return null;

  const { pet, veterinario, itens, pagamentos } = data;
  const totalPago = pagamentos.reduce((s, p) => s + Number(p.valor), 0);
  const exames = itens.filter((i) => i.tipo_servico_categoria === "exame");
  const procedimentos = itens.filter((i) => i.tipo_servico_categoria === "procedimento");
  const vacinas = itens.filter((i) => i.tipo_servico_categoria === "vacina");

  return (
    <section className="max-w-4xl">
      <Breadcrumb
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/?s=pets", label: "Pets" },
          { href: `/pet/${pet.id}`, label: pet.nome },
          { label: `${formatarData(data.data_consulta)} às ${data.hora}` },
        ]}
      />

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-5 p-6 lg:p-8 rounded-[var(--radius-xl)] bg-white border border-slate-100/80 shadow-[var(--shadow)] mb-8">
        <div className="flex gap-5 items-start">
          <PetAvatar fotoUrl={pet.foto_url} especie={pet.especie} nome={pet.nome} size="md" className="shrink-0" />
          <div>
          <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">{formatarData(data.data_consulta)} às {data.hora}</h1>
          <p className="text-[var(--primary)] font-medium mt-0.5">
            <Link href={`/pet/${pet.id}`} className="hover:underline">{pet.nome}</Link>
            {pet.raca ? ` • ${pet.raca}` : ""}
          </p>
          {pet.nome_tutor && (
            <p className="text-[var(--text-muted)] text-[0.875rem] mt-1">
              Tutor: <Link href={`/tutor?nome=${encodeURIComponent(pet.nome_tutor)}${pet.telefone ? `&telefone=${encodeURIComponent(pet.telefone)}` : ""}`} className={CN.link}>{pet.nome_tutor}</Link>
            </p>
          )}
          {veterinario && (
            <p className="text-[var(--text-muted)] text-[0.875rem] mt-1">
              Dr(a) <Link href={`/vet/${veterinario.id}`} className={CN.link}>{veterinario.nome}</Link>
            </p>
          )}
          {data.motivo && <p className="text-[var(--text-muted)] italic text-[0.875rem] mt-2">{data.motivo}</p>}
          {data.observacoes && <p className="text-[var(--text-muted)] text-[0.875rem] mt-2 whitespace-pre-wrap">{data.observacoes}</p>}
          </div>
        </div>
        <Link href={petId ? `/pet/${petId}` : "/?s=consultas"} className="text-[0.75rem] font-medium text-[var(--primary)] hover:underline">
          ← {petId ? "Voltar ao pet" : "Voltar à agenda"}
        </Link>
      </div>

      {/* Exames */}
      <div className="rounded-[var(--radius-lg)] bg-white border border-slate-100/80 shadow-[var(--shadow)] overflow-hidden mb-6">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold flex items-center gap-2">
            <span className="material-icons-round text-[var(--primary)] text-lg">science</span>
            Exames
          </h2>
          {!addExame && (
            <button type="button" onClick={() => setAddExame(true)} className="text-[0.75rem] font-medium text-[var(--primary)] hover:underline flex items-center gap-1">
              <span className="material-icons-round text-sm">add</span> Adicionar
            </button>
          )}
        </div>
        <div className="divide-y divide-slate-100">
          {!exames.length && !addExame && <p className={CN.listEmpty}>Nenhum exame.</p>}
          {exames.map((i) => (
            <div key={i.id} className="px-5 py-4">
              <div className="font-medium text-[var(--primary)]">{i.tipo_servico_nome}</div>
              {i.resultado && <p className="text-[0.8125rem] text-[var(--text-muted)] mt-1">{i.resultado}</p>}
              {i.observacoes && <p className="text-[0.75rem] text-[var(--text-muted)] italic">{i.observacoes}</p>}
              {i.valor != null && <p className="text-[0.75rem] mt-1">R$ {Number(i.valor).toFixed(2)}</p>}
            </div>
          ))}
          {addExame && (
            <form onSubmit={handleAddItem} className="px-5 py-4 bg-[var(--primary-subtle)]">
              <select
                value={addForm.tipo_servico_id}
                onChange={(e) => setAddForm({ ...addForm, tipo_servico_id: e.target.value })}
                className={CN.input}
                required
              >
                <option value="">Selecione o exame</option>
                {tipos.filter((t) => t.categoria === "exame").map((t) => (
                  <option key={t.id} value={t.id}>{t.nome}</option>
                ))}
              </select>
              <input value={addForm.resultado} onChange={(e) => setAddForm({ ...addForm, resultado: e.target.value })} className={`${CN.input} mt-2`} placeholder="Resultado" />
              <input value={addForm.observacoes} onChange={(e) => setAddForm({ ...addForm, observacoes: e.target.value })} className={`${CN.input} mt-2`} placeholder="Observações" />
              <input type="number" step="0.01" value={addForm.valor} onChange={(e) => setAddForm({ ...addForm, valor: e.target.value })} className={`${CN.input} mt-2`} placeholder="Valor (R$)" />
              <div className="flex gap-2 mt-2">
                <button type="submit" className={CN.btnPrimary}>Adicionar</button>
                <button type="button" onClick={() => setAddExame(false)} className={CN.btnSecondary}>Cancelar</button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Procedimentos */}
      <div className="rounded-[var(--radius-lg)] bg-white border border-slate-100/80 shadow-[var(--shadow)] overflow-hidden mb-6">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold flex items-center gap-2">
            <span className="material-icons-round text-[var(--primary)] text-lg">medical_services</span>
            Procedimentos
          </h2>
          {!addProc && (
            <button type="button" onClick={() => setAddProc(true)} className="text-[0.75rem] font-medium text-[var(--primary)] hover:underline flex items-center gap-1">
              <span className="material-icons-round text-sm">add</span> Adicionar
            </button>
          )}
        </div>
        <div className="divide-y divide-slate-100">
          {!procedimentos.length && !addProc && <p className={CN.listEmpty}>Nenhum procedimento.</p>}
          {procedimentos.map((i) => (
            <div key={i.id} className="px-5 py-4">
              <div className="font-medium text-[var(--primary)]">{i.tipo_servico_nome}</div>
              {i.observacoes && <p className="text-[0.8125rem] text-[var(--text-muted)] mt-1">{i.observacoes}</p>}
              {i.valor != null && <p className="text-[0.75rem] mt-1">R$ {Number(i.valor).toFixed(2)}</p>}
            </div>
          ))}
          {addProc && (
            <form onSubmit={handleAddItem} className="px-5 py-4 bg-[var(--primary-subtle)]">
              <select
                value={addForm.tipo_servico_id}
                onChange={(e) => setAddForm({ ...addForm, tipo_servico_id: e.target.value })}
                className={CN.input}
                required
              >
                <option value="">Selecione o procedimento</option>
                {tipos.filter((t) => t.categoria === "procedimento").map((t) => (
                  <option key={t.id} value={t.id}>{t.nome}</option>
                ))}
              </select>
              <input value={addForm.observacoes} onChange={(e) => setAddForm({ ...addForm, observacoes: e.target.value })} className={`${CN.input} mt-2`} placeholder="Observações" />
              <input type="number" step="0.01" value={addForm.valor} onChange={(e) => setAddForm({ ...addForm, valor: e.target.value })} className={`${CN.input} mt-2`} placeholder="Valor (R$)" />
              <div className="flex gap-2 mt-2">
                <button type="submit" className={CN.btnPrimary}>Adicionar</button>
                <button type="button" onClick={() => setAddProc(false)} className={CN.btnSecondary}>Cancelar</button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Vacinas */}
      <div className="rounded-[var(--radius-lg)] bg-white border border-slate-100/80 shadow-[var(--shadow)] overflow-hidden mb-6">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold flex items-center gap-2">
            <span className="material-icons-round text-[var(--primary)] text-lg">vaccines</span>
            Vacinas
          </h2>
          {!addVacina && (
            <button type="button" onClick={() => setAddVacina(true)} className="text-[0.75rem] font-medium text-[var(--primary)] hover:underline flex items-center gap-1">
              <span className="material-icons-round text-sm">add</span> Adicionar
            </button>
          )}
        </div>
        <div className="divide-y divide-slate-100">
          {!vacinas.length && !addVacina && <p className={CN.listEmpty}>Nenhuma vacina.</p>}
          {vacinas.map((i) => (
            <div key={i.id} className="px-5 py-4">
              <div className="font-medium text-[var(--primary)]">{i.tipo_servico_nome}</div>
              {i.observacoes && <p className="text-[0.8125rem] text-[var(--text-muted)] mt-1">{i.observacoes}</p>}
              {i.valor != null && <p className="text-[0.75rem] mt-1">R$ {Number(i.valor).toFixed(2)}</p>}
            </div>
          ))}
          {addVacina && (
            <form onSubmit={handleAddItem} className="px-5 py-4 bg-[var(--primary-subtle)]">
              <select
                value={addForm.tipo_servico_id}
                onChange={(e) => setAddForm({ ...addForm, tipo_servico_id: e.target.value })}
                className={CN.input}
                required
              >
                <option value="">Selecione a vacina</option>
                {tipos.filter((t) => t.categoria === "vacina").map((t) => (
                  <option key={t.id} value={t.id}>{t.nome}</option>
                ))}
              </select>
              <input value={addForm.observacoes} onChange={(e) => setAddForm({ ...addForm, observacoes: e.target.value })} className={`${CN.input} mt-2`} placeholder="Observações (ex: lote, validade)" />
              <input type="number" step="0.01" value={addForm.valor} onChange={(e) => setAddForm({ ...addForm, valor: e.target.value })} className={`${CN.input} mt-2`} placeholder="Valor (R$)" />
              <div className="flex gap-2 mt-2">
                <button type="submit" className={CN.btnPrimary}>Adicionar</button>
                <button type="button" onClick={() => setAddVacina(false)} className={CN.btnSecondary}>Cancelar</button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Pagamentos */}
      <div className="rounded-[var(--radius-lg)] bg-white border border-slate-100/80 shadow-[var(--shadow)] overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold flex items-center gap-2">
            <span className="material-icons-round text-[var(--primary)] text-lg">payment</span>
            Pagamentos
          </h2>
        </div>
        <div className="divide-y divide-slate-100">
          {!pagamentos.length && <p className={CN.listEmpty}>Nenhum pagamento registrado.</p>}
          {pagamentos.map((p) => (
            <div key={p.id} className="px-5 py-4 flex justify-between">
              <span className="font-medium">R$ {Number(p.valor).toFixed(2)}</span>
              <span className="text-[var(--text-muted)] text-[0.8125rem]">{p.forma_pagamento}</span>
            </div>
          ))}
          {pagamentos.length > 0 && (
            <div className="px-5 py-4 bg-slate-50/80 font-semibold flex justify-between rounded-b-[var(--radius)]">
              <span>Total</span>
              <span>R$ {totalPago.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
