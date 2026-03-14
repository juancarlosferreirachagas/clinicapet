"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, getErrorMessage } from "@/lib/api";
import { formatarData } from "@/lib/utils";
import { API_BASE, CN } from "@/lib/constants";
import type { Consulta, Pet, Veterinario, TipoServico } from "@/lib/types";
import { useToast } from "./Toast";
import { useConfirm } from "./ConfirmModal";
import { SectionHeader } from "./ui/SectionHeader";
import { Card, CardHeader } from "./ui/Card";
import { FormField } from "./ui/FormField";
import { Modal } from "./ui/Modal";
import { PetAvatar } from "./PetAvatar";

const EMPTY_FORM = { pet_id: "", veterinario_id: "", data_consulta: "", hora: "", motivo: "" };

interface ItemSelecionado { tipo_servico_id: number; nome: string; categoria: string; valor?: string; observacoes?: string }

export function ConsultasSection() {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [vets, setVets] = useState<Veterinario[]>([]);
  const [tipos, setTipos] = useState<TipoServico[]>([]);
  const [itens, setItens] = useState<ItemSelecionado[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const router = useRouter();
  const { toast } = useToast();
  const { confirm } = useConfirm();

  const tiposPorCategoria = useMemo(() => ({
    exame: tipos.filter(t => t.categoria === "exame"),
    procedimento: tipos.filter(t => t.categoria === "procedimento"),
    vacina: tipos.filter(t => t.categoria === "vacina"),
  }), [tipos]);

  const loadSelects = () => {
    Promise.all([
      api<Pet[]>(`${API_BASE}/pets`),
      api<Veterinario[]>(`${API_BASE}/veterinarios`),
      api<TipoServico[]>(`${API_BASE}/tipos-servico`),
    ]).then(([r1, r2, r3]) => {
      if (r1.ok && Array.isArray(r1.dados)) setPets(r1.dados);
      if (r2.ok && Array.isArray(r2.dados)) setVets(r2.dados);
      if (r3.ok && Array.isArray(r3.dados)) setTipos(r3.dados);
    });
  };

  const load = () => {
    api<Consulta[]>(`${API_BASE}/consultas`).then((r) => {
      if (r.ok && Array.isArray(r.dados)) setConsultas(r.dados);
      else toast(getErrorMessage(r, "Erro ao carregar."), "error");
      setLoading(false);
    });
  };

  useEffect(() => {
    load();
    loadSelects();
  }, []);

  const resetForm = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setItens([]);
  };

  const handleEdit = (c: Consulta) => {
    setEditId(c.id);
    setForm({
      pet_id: String(c.pet_id),
      veterinario_id: c.veterinario_id ? String(c.veterinario_id) : "",
      data_consulta: c.data_consulta,
      hora: (c.hora || "").substring(0, 5),
      motivo: c.motivo || "",
    });
    setFormOpen(true);
    loadSelects();
  };

  const handleCancelarConsulta = async (id: number) => {
    if (!(await confirm({ titulo: "Cancelar consulta", mensagem: "A consulta será marcada como cancelada. O registro permanece para histórico. Deseja continuar?", confirmarTexto: "Cancelar consulta" }))) return;
    const r = await api<Consulta>(`${API_BASE}/consultas/${id}/cancelar`, { method: "PATCH" });
    if (r.ok) {
      toast("Consulta cancelada com sucesso.", "success");
      resetForm();
      load();
    } else toast(getErrorMessage(r, "Erro ao cancelar."), "error");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.pet_id || !form.data_consulta || !form.hora) {
      toast("Preencha pet, data e hora.", "error");
      return;
    }
    const baseBody = {
      pet_id: +form.pet_id,
      veterinario_id: form.veterinario_id ? +form.veterinario_id : null,
      data_consulta: form.data_consulta,
      hora: form.hora.substring(0, 5),
      motivo: form.motivo || null,
    };
    const body = editId ? baseBody : {
      ...baseBody,
      ...(itens.length > 0 && {
        itens: itens.map((i) => ({
          tipo_servico_id: i.tipo_servico_id,
          valor: i.valor ? parseFloat(i.valor) : undefined,
          observacoes: i.observacoes || undefined,
        })),
      }),
    };
    const url = editId ? `${API_BASE}/consultas/${editId}` : `${API_BASE}/consultas`;
    const r = await api<Consulta>(url, {
      method: editId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (r.ok) {
      toast(editId ? "Consulta atualizada com sucesso." : "Consulta agendada com sucesso.", "success");
      resetForm();
      setFormOpen(false);
      load();
    } else toast(getErrorMessage(r, "Erro ao salvar."), "error");
  };

  const porData = consultas.reduce<Record<string, Consulta[]>>((acc, c) => {
    if (!acc[c.data_consulta]) acc[c.data_consulta] = [];
    acc[c.data_consulta].push(c);
    return acc;
  }, {});
  const datas = Object.keys(porData).sort();

  const startNova = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
  };
  const novoBtn = (
    <button type="button" onClick={startNova} className={CN.btnNovo}>
      <span className="material-icons-round text-base">add</span> Nova consulta
    </button>
  );

  return (
    <section>
      <SectionHeader
        title="Agenda de Consultas"
        subtitle="Visualize e agende consultas por data"
        quickLinks={[{ href: "/?s=pets", label: "Pets" }, { href: "/?s=vets", label: "Veterinários" }, { href: "/?s=pagamentos", label: "Pagamentos" }]}
      />
      <Card>
          <CardHeader title="Agenda" action={novoBtn} />
          <div className="space-y-5">
            {loading && <p className={CN.listEmpty}>Carregando...</p>}
            {!loading && !datas.length && <p className={CN.listEmpty}>Nenhuma consulta agendada.</p>}
            {datas.map((dt) => (
              <div key={dt} className="mb-5 last:mb-0">
                <div className="text-[0.8125rem] font-semibold text-[var(--primary)] uppercase tracking-wider py-2.5 mb-3 border-b-2 border-[var(--primary-muted)]">
                  {formatarData(dt)}
                </div>
                {porData[dt].map((c) => (
                  <div key={c.id} className="flex items-center gap-4 py-3.5 px-4 mb-2.5 bg-white rounded-xl border border-slate-100 border-l-4 border-l-[var(--primary)] text-[0.9375rem] hover:bg-[var(--primary-subtle)] transition-colors duration-200 last:mb-0">
                    <PetAvatar fotoUrl={c.pet_foto_url} especie={c.pet_especie ?? ""} nome={c.pet_nome ?? ""} size="sm" className="shrink-0" />
                    <Link href={`/pet/${c.pet_id}/consulta/${c.id}`} className="flex-1 min-w-0 flex items-center gap-4">
                      <span className="font-semibold text-[var(--text)] shrink-0">{(c.hora || "").substring(0, 5)}</span>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className={CN.link}>{c.pet_nome || "Pet"}</span>
                        {c.pet_nome_tutor && <span className="text-[0.75rem] text-[var(--text-muted)]">Tutor: {c.pet_nome_tutor}</span>}
                        {c.veterinario_nome && c.veterinario_id && (
                          <span className="text-[0.75rem] text-[var(--text-muted)]">com Dr(a) <span role="button" tabIndex={0} onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push(`/vet/${c.veterinario_id}`); }} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); router.push(`/vet/${c.veterinario_id}`); } }} className={CN.link}>{c.veterinario_nome}</span></span>
                        )}
                        {c.motivo && <span className="text-[0.75rem] text-[var(--text-muted)] italic">{c.motivo}</span>}
                      </div>
                    </Link>
                    <div className="flex gap-1 shrink-0">
                      <button type="button" onClick={() => handleEdit(c)} className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary-muted)] text-[var(--primary)] hover:bg-[var(--primary-light)] transition-colors">
                        <span className="material-icons-round text-lg">edit</span>
                      </button>
                      <button type="button" onClick={() => handleCancelarConsulta(c.id)} className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors" title="Cancelar consulta">
                        <span className="material-icons-round text-lg">event_busy</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Card>
      <Modal open={formOpen} onClose={() => { resetForm(); setFormOpen(false); }} title={editId ? "Editar consulta" : "Nova consulta"}>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <h4 className="text-[0.75rem] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <span className="material-icons-round text-sm">pets</span> Agendamento
                </h4>
                <div className="grid grid-cols-2 gap-4 gap-x-5">
                  <FormField label="Animal" hint="Pet a ser atendido" className="col-span-2 sm:col-span-1">
                    <select value={form.pet_id} onChange={(e) => setForm({ ...form, pet_id: e.target.value })} className={`${CN.input} py-2.5`} required>
                      <option value="">Selecione o pet</option>
                      {pets.map((p) => <option key={p.id} value={p.id}>{p.nome} – {p.especie}</option>)}
                    </select>
                  </FormField>
                  <FormField label="Veterinário responsável" className="col-span-2 sm:col-span-1">
                    <select value={form.veterinario_id} onChange={(e) => setForm({ ...form, veterinario_id: e.target.value })} className={`${CN.input} py-2.5`}>
                      <option value="">Selecione (opcional)</option>
                      {vets.map((v) => <option key={v.id} value={v.id}>{v.nome}</option>)}
                    </select>
                  </FormField>
                  <FormField label="Data">
                    <input type="date" value={form.data_consulta} onChange={(e) => setForm({ ...form, data_consulta: e.target.value })} className={`${CN.input} py-2.5`} required />
                  </FormField>
                  <FormField label="Horário">
                    <input type="time" value={form.hora} onChange={(e) => setForm({ ...form, hora: e.target.value })} className={`${CN.input} py-2.5`} required />
                  </FormField>
                  <FormField label="Motivo / Queixa principal" hint="Ex: vacinação, check-up, dor" className="col-span-2">
                    <input value={form.motivo} onChange={(e) => setForm({ ...form, motivo: e.target.value })} className={`${CN.input} py-2.5`} placeholder="Motivo da consulta ou queixa do tutor" />
                  </FormField>
                </div>
              </div>

              {!editId && tipos.length > 0 && (
                <div>
                  <h4 className="text-[0.75rem] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <span className="material-icons-round text-sm">add_circle</span> Lançar também
                  </h4>
                  <p className="text-[0.8125rem] text-[var(--text-muted)] mb-3">Adicione exames, procedimentos e vacinas à consulta</p>
                  <div className="flex flex-wrap gap-2">
                    {tiposPorCategoria.exame.map((t) => {
                      const sel = itens.find((i) => i.tipo_servico_id === t.id);
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => {
                            if (sel) setItens(itens.filter((i) => i.tipo_servico_id !== t.id));
                            else setItens([...itens, { tipo_servico_id: t.id, nome: t.nome, categoria: t.categoria }]);
                          }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.8125rem] border transition-colors ${
                            sel ? "bg-[var(--primary)] text-white border-[var(--primary)]" : "bg-white border-slate-200 hover:border-[var(--primary-muted)] text-[var(--text)]"
                          }`}
                        >
                          <span className="material-icons-round text-sm">{sel ? "check" : "science"}</span>
                          {t.nome}
                        </button>
                      );
                    })}
                    {tiposPorCategoria.procedimento.map((t) => {
                      const sel = itens.find((i) => i.tipo_servico_id === t.id);
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => {
                            if (sel) setItens(itens.filter((i) => i.tipo_servico_id !== t.id));
                            else setItens([...itens, { tipo_servico_id: t.id, nome: t.nome, categoria: t.categoria }]);
                          }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.8125rem] border transition-colors ${
                            sel ? "bg-[var(--primary)] text-white border-[var(--primary)]" : "bg-white border-slate-200 hover:border-[var(--primary-muted)] text-[var(--text)]"
                          }`}
                        >
                          <span className="material-icons-round text-sm">{sel ? "check" : "medical_services"}</span>
                          {t.nome}
                        </button>
                      );
                    })}
                    {tiposPorCategoria.vacina.map((t) => {
                      const sel = itens.find((i) => i.tipo_servico_id === t.id);
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => {
                            if (sel) setItens(itens.filter((i) => i.tipo_servico_id !== t.id));
                            else setItens([...itens, { tipo_servico_id: t.id, nome: t.nome, categoria: t.categoria }]);
                          }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.8125rem] border transition-colors ${
                            sel ? "bg-[var(--primary)] text-white border-[var(--primary)]" : "bg-white border-slate-200 hover:border-[var(--primary-muted)] text-[var(--text)]"
                          }`}
                        >
                          <span className="material-icons-round text-sm">{sel ? "check" : "vaccines"}</span>
                          {t.nome}
                        </button>
                      );
                    })}
                  </div>
                  {itens.length > 0 && (
                    <p className="text-[0.75rem] text-[var(--text-muted)] mt-2">{itens.length} item(ns) selecionado(s) – será possível ajustar valores na ficha da consulta</p>
                  )}
                </div>
              )}

              <div className="flex gap-3 pt-2 border-t border-slate-100">
                <button type="submit" className={CN.btnPrimary}>{editId ? "Salvar alterações" : "Agendar consulta"}</button>
                <button type="button" onClick={() => { resetForm(); setFormOpen(false); }} className={CN.btnSecondary}>Cancelar</button>
              </div>
            </form>
      </Modal>
    </section>
  );
}
