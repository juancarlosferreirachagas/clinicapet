"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, getErrorMessage } from "@/lib/api";
import { API_BASE, CN } from "@/lib/constants";
import type { Pagamento, Consulta } from "@/lib/types";
import { useToast } from "./Toast";
import { useConfirm } from "./ConfirmModal";
import { SectionHeader } from "./ui/SectionHeader";
import { Card, CardHeader } from "./ui/Card";
import { FormField } from "./ui/FormField";
import { Modal } from "./ui/Modal";
import { PetAvatar } from "./PetAvatar";

type FormaPagamento = "dinheiro" | "cartao" | "pix";
const EMPTY_FORM: { consulta_id: string; valor: string; forma_pagamento: FormaPagamento } = { consulta_id: "", valor: "", forma_pagamento: "dinheiro" };

export function PagamentosSection() {
  const [pags, setPags] = useState<Pagamento[]>([]);
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const { toast } = useToast();
  const { confirm } = useConfirm();

  const loadConsultas = () => {
    api<Consulta[]>(`${API_BASE}/consultas`).then((r) => {
      if (r.ok && Array.isArray(r.dados)) setConsultas(r.dados);
    });
  };

  const load = () => {
    api<Pagamento[]>(`${API_BASE}/pagamentos`).then((r) => {
      if (r.ok && Array.isArray(r.dados)) setPags(r.dados);
      else toast(getErrorMessage(r, "Erro ao carregar."), "error");
      setLoading(false);
    });
  };

  useEffect(() => {
    load();
    loadConsultas();
  }, []);

  const resetForm = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
  };

  const handleEdit = (p: Pagamento) => {
    setEditId(p.id);
    const fp = p.forma_pagamento;
    const forma = fp === "cartao" || fp === "pix" ? fp : "dinheiro";
    setForm({
      consulta_id: String(p.consulta_id),
      valor: String(p.valor),
      forma_pagamento: forma,
    });
    setFormOpen(true);
    loadConsultas();
  };

  const handleEstornar = async (id: number) => {
    if (!(await confirm({ titulo: "Estornar pagamento", mensagem: "O pagamento será removido. O valor voltará a constar como pendente. Deseja continuar?", confirmarTexto: "Estornar" }))) return;
    const r = await api<{ mensagem?: string }>(`${API_BASE}/pagamentos/${id}`, { method: "DELETE" });
    if (r.ok) {
      toast("Pagamento estornado com sucesso.", "success");
      resetForm();
      load();
    } else toast(getErrorMessage(r, "Erro ao estornar."), "error");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId && !form.consulta_id) {
      toast("Selecione uma consulta.", "error");
      return;
    }
    const val = parseFloat(form.valor);
    if (!val || val <= 0) {
      toast("Informe um valor maior que zero.", "error");
      return;
    }
    const body = editId ? { valor: val, forma_pagamento: form.forma_pagamento } : { consulta_id: +form.consulta_id, valor: val, forma_pagamento: form.forma_pagamento };
    const url = editId ? `${API_BASE}/pagamentos/${editId}` : `${API_BASE}/pagamentos`;
    const r = await api<Pagamento>(url, {
      method: editId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (r.ok) {
      toast(editId ? "Pagamento atualizado com sucesso." : "Pagamento registrado com sucesso.", "success");
      resetForm();
      setFormOpen(false);
      load();
    } else toast(getErrorMessage(r, "Erro ao salvar."), "error");
  };

  const novoBtn = (
    <button type="button" onClick={() => { resetForm(); setFormOpen(true); }} className={CN.btnNovo}>
      <span className="material-icons-round text-base">add</span> Registrar
    </button>
  );

  return (
    <section>
      <SectionHeader
        title="Pagamentos"
        subtitle="Registre os pagamentos das consultas"
        quickLinks={[{ href: "/?s=consultas", label: "Ver agenda" }, { href: "/?s=pets", label: "Pets" }]}
      />
      <Modal open={formOpen} onClose={() => { resetForm(); setFormOpen(false); }} title={editId ? "Editar pagamento" : "Registrar pagamento"}>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4 gap-x-5">
                {!editId && (
                  <FormField label="Consulta" hint="Selecione a consulta a ser paga" className="col-span-2">
                    <select value={form.consulta_id} onChange={(e) => setForm({ ...form, consulta_id: e.target.value })} className={CN.input} required>
                      <option value="">Selecione a consulta</option>
                      {consultas.map((c) => <option key={c.id} value={c.id}>{c.data_consulta} – {c.pet_nome || "-"}</option>)}
                    </select>
                  </FormField>
                )}
                <FormField label="Valor (R$)">
                  <input type="number" step="0.01" min="0" value={form.valor} onChange={(e) => setForm({ ...form, valor: e.target.value })} className={CN.input} placeholder="0,00" required />
                </FormField>
                <FormField label="Forma de pagamento">
                  <select value={form.forma_pagamento} onChange={(e) => setForm({ ...form, forma_pagamento: e.target.value as FormaPagamento })} className={CN.input}>
                    <option value="dinheiro">Dinheiro</option>
                    <option value="cartao">Cartão (crédito/débito)</option>
                    <option value="pix">PIX</option>
                  </select>
                </FormField>
              </div>
              <div className="flex gap-3 pt-2 border-t border-slate-100">
                <button type="submit" className={CN.btnPrimary}>{editId ? "Salvar alterações" : "Registrar pagamento"}</button>
                <button type="button" onClick={() => { resetForm(); setFormOpen(false); }} className={CN.btnSecondary}>Cancelar</button>
              </div>
            </form>
      </Modal>
      <Card>
          <CardHeader title="Pagamentos realizados" action={novoBtn} />
          <div className="space-y-2.5">
            {loading && <p className={CN.listEmpty}>Carregando...</p>}
            {!loading && !pags.length && <p className={CN.listEmpty}>Nenhum pagamento.</p>}
            {pags.map((p) => (
              <div key={p.id} className={CN.listItem}>
                {p.pet_id ? (
                  <PetAvatar fotoUrl={p.pet_foto_url} especie={p.pet_especie ?? ""} nome={p.pet_nome ?? ""} size="sm" className="shrink-0" />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                    <span className="material-icons-round text-slate-400">receipt</span>
                  </div>
                )}
                {p.pet_id ? (
                  <Link href={`/pet/${p.pet_id}`} className="flex-1 min-w-0 block">
                    <strong className="text-[var(--primary)] font-semibold">R$ {Number(p.valor).toFixed(2)}</strong> – {p.forma_pagamento || "N/A"}
                    <p className="mt-0.5 text-[0.75rem] text-[var(--text-muted)]">{p.pet_nome || "-"} {p.pet_nome_tutor ? `• Tutor: ${p.pet_nome_tutor}` : ""} • {p.data_consulta || "-"}</p>
                  </Link>
                ) : (
                  <div className="flex-1 min-w-0">
                    <strong className="text-[var(--primary)] font-semibold">R$ {Number(p.valor).toFixed(2)}</strong> – {p.forma_pagamento || "N/A"}
                    <p className="mt-0.5 text-[0.75rem] text-[var(--text-muted)]">{p.pet_nome || "-"} • {p.data_consulta || "-"}</p>
                  </div>
                )}
                <div className="flex gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button type="button" onClick={() => handleEdit(p)} className={CN.btnEditar}><span className="material-icons-round text-sm mr-0.5">edit</span> Editar</button>
                  <button type="button" onClick={() => handleEstornar(p.id)} className={CN.btnExcluir}><span className="material-icons-round text-sm mr-0.5">undo</span> Estornar</button>
                </div>
              </div>
            ))}
          </div>
        </Card>
    </section>
  );
}
